import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  GMPClient,
} from "@axelarjs/api";
import type { AxelarCosmosChainConfig } from "@axelarjs/api/axelar-config/types";
import { COSMOS_GAS_RECEIVER_OPTIONS } from "@axelarjs/core";

import { OfflineSigner } from "@cosmjs/proto-signing";
import {
  assertIsDeliverTxSuccess,
  Coin,
  SigningStargateClient,
} from "@cosmjs/stargate";

import { AddGasParams, AddGasResponse, GetFullFeeOptions } from "../types";

export type AddGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  gmpClient: GMPClient;
  getSigningStargateClient: (
    rpcUrl: string,
    offlineSigner: OfflineSigner
  ) => Promise<SigningStargateClient>;
};

/**
 * Adds gas to a transaction that might be stuck due to insufficient gas
 *
 * @param params {AddGasParams} - Parameters to add gas to a transaction
 * @returns {Promise<AddGasResponse>} - Response from adding gas to a transaction
 */
export async function addGas(
  { autocalculateGasOptions, sendOptions, ...params }: AddGasParams,
  dependencies: AddGasDependencies
): Promise<AddGasResponse> {
  const chainConfig = await dependencies.configClient
    .getChainConfigs(sendOptions.environment)
    .then((res) => res.chains[params.chain] as AxelarCosmosChainConfig)
    .catch(() => undefined);

  if (!chainConfig) {
    throw new Error(`chain ID ${params.chain} not found`);
  }

  const { rpc, channelIdToAxelar } = chainConfig.cosmosConfigs;

  const [tx] = await dependencies.gmpClient
    .searchGMP({ txHash: params.txHash })
    .catch(() => []);

  if (!tx) {
    return {
      success: false,
      info: `${params.txHash} could not be found`,
    };
  }

  const denomOnSrcChain = getIBCDenomOnSrcChain(
    tx.gas_paid.returnValues.denom,
    chainConfig
  );

  if (!matchesOriginalTokenPayment(params.token, denomOnSrcChain)) {
    return {
      success: false,
      info: `The token you are trying to send does not match the token originally \
        used for gas payment. Please send ${tx.gas_paid.returnValues.denom} instead`,
    };
  }

  const coin =
    params.token !== "autocalculate"
      ? params.token
      : await getFullFee({
          tx,
          autocalculateGasOptions,
          chainConfig,
          axelarQueryClient: dependencies.axelarQueryClient,
        });

  const sender = await sendOptions.offlineSigner
    .getAccounts()
    .then(([acc]) => acc?.address);

  if (!sender) {
    return {
      success: false,
      info: `Could not find sender from designated offlineSigner`,
    };
  }

  const rpcUrl = sendOptions.rpcUrl ?? rpc[0];

  if (!rpcUrl) {
    return {
      success: false,
      info: "Missing RPC URL. Please pass in an rpcUrl parameter in the sendOptions parameter",
    };
  }

  const signingStargateClient = await dependencies.getSigningStargateClient(
    rpcUrl,
    sendOptions.offlineSigner
  );

  const broadcastResult = await signingStargateClient.signAndBroadcast(
    sender,
    [
      {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: {
          sourcePort: "transfer",
          sourceChannel: channelIdToAxelar,
          token: coin,
          sender,
          receiver: COSMOS_GAS_RECEIVER_OPTIONS[sendOptions.environment],
          timeoutTimestamp:
            sendOptions.timeoutTimestamp ?? (Date.now() + 90) * 1e9,
          memo: tx.call.id,
        },
      },
    ],
    sendOptions.txFee
  );

  assertIsDeliverTxSuccess(broadcastResult);

  return {
    success: true,
    info: "",
    broadcastResult,
  };
}
async function getFullFee({
  autocalculateGasOptions,
  tx,
  chainConfig,
  axelarQueryClient,
}: GetFullFeeOptions): Promise<Coin> {
  const amount = await axelarQueryClient.estimateGasFee({
    sourceChain: tx.call.chain,
    destinationChain: tx.call.returnValues.destinationChain,
    gasLimit: autocalculateGasOptions?.gasLimit ?? BigInt(1_000_000),
    gasMultiplier: autocalculateGasOptions?.gasMultipler ?? 1,
    sourceTokenSymbol: tx.gas_paid.returnValues.denom,
  });

  const denom = getIBCDenomOnSrcChain(
    tx.gas_paid.returnValues.denom,
    chainConfig
  );

  return {
    denom,
    amount: typeof amount === "string" ? amount : amount.executionFee,
  };
}

function matchesOriginalTokenPayment(
  token: Coin | "autocalculate",
  denomOnSrcChain: string
) {
  return token === "autocalculate" || token?.denom === denomOnSrcChain;
}

function getIBCDenomOnSrcChain(
  denomOnAxelar: string,
  chain: AxelarCosmosChainConfig
) {
  const { ibcDenom } =
    chain.assets?.find(({ id }) => id === denomOnAxelar) ?? {};

  if (!ibcDenom) {
    throw new Error("cannot find token that matches original gas payment");
  }

  return ibcDenom;
}
