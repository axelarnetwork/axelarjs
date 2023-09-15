import { S3CosmosChainConfig } from "@axelarjs/api/s3/types";
import { COSMOS_GAS_RECEIVER_OPTIONS, Environment } from "@axelarjs/core";

import { assertIsDeliverTxSuccess, Coin } from "@cosmjs/stargate";

import { getCosmosSigner } from "../cosmosSigner";
import { gmpClient, s3Client } from "../services";
import { AddGasParams, AddGasResponse, GetFullFeeOptions } from "../types";

/**
 * Adds gas to a transaction that might be stuck due to insufficient gas
 *
 * @param params {AddGasParams} - Parameters to add gas to a transaction
 * @returns {Promise<AddGasResponse>} - Response from adding gas to a transaction
 */
export async function addGas({
  autocalculateGasOptions,
  sendOptions,
  ...params
}: AddGasParams): Promise<AddGasResponse> {
  const chainConfig = await fetchChainConfig(
    sendOptions.environment,
    params.chain
  );

  if (!chainConfig) {
    throw new Error(`chain ID ${params.chain} not found`);
  }

  const { rpc, channelIdToAxelar } = chainConfig.cosmosConfigs;

  const tx = await fetchGMPTransaction(sendOptions.environment, params.txHash);

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
          environment: sendOptions.environment,
          autocalculateGasOptions,
          chainConfig,
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

  const signer = await getCosmosSigner(rpcUrl, sendOptions.offlineSigner);

  const broadcastResult = await signer.signAndBroadcast(
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

async function fetchChainConfig(environment: Environment, chain: string) {
  return s3Client(environment)
    .getChainConfigs(environment)
    .then((res) => res.chains[chain] as S3CosmosChainConfig)
    .catch(() => undefined);
}

async function fetchGMPTransaction(environment: Environment, txHash: string) {
  const [tx] = await gmpClient(environment)
    .searchGMP({ txHash })
    .catch(() => []);

  return tx;
}

async function getFullFee({
  environment,
  autocalculateGasOptions,
  tx,
  chainConfig,
}: GetFullFeeOptions): Promise<Coin> {
  let apiClient;

  if (typeof window === "undefined") {
    const { createAxelarQueryNodeClient } = await import(
      "@axelarjs/api/axelar-query/node"
    );
    apiClient = createAxelarQueryNodeClient(environment, {});
  } else {
    const { createAxelarQueryBrowserClient } = await import(
      "@axelarjs/api/axelar-query/browser"
    );
    apiClient = createAxelarQueryBrowserClient(environment, {});
  }

  const amount = await apiClient.estimateGasFee({
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
  chain: S3CosmosChainConfig
) {
  const { ibcDenom } =
    chain.assets?.find(({ id }) => id === denomOnAxelar) ?? {};

  if (!ibcDenom) {
    throw new Error("cannot find token that matches original gas payment");
  }

  return ibcDenom;
}
