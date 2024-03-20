import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  ChainConfig,
  ChainCosmosSubconfig,
  GMPClient,
} from "@axelarjs/api";
import { COSMOS_GAS_RECEIVER_OPTIONS, type Environment } from "@axelarjs/core";
import { AxelarSigningStargateClient } from "@axelarjs/cosmos";

import type { OfflineSigner } from "@cosmjs/proto-signing";
import { assertIsDeliverTxSuccess, type Coin } from "@cosmjs/stargate";
import { longify } from "@cosmjs/stargate/build/queryclient";

import type { AddGasParams, AddGasResponse, GetFullFeeOptions } from "./types";

const getDefaultTimeoutTimestamp = (now = Date.now()) => (now + 90_000) * 1e6; // 90 seconds from now

export type AddGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  gmpClient: GMPClient;
  getSigningStargateClient: (
    rpcUrl: string,
    offlineSigner: OfflineSigner,
  ) => Promise<AxelarSigningStargateClient>;
};

/**
 * Adds gas to a transaction that might be stuck due to insufficient gas
 *
 * @param params {AddGasParams} - Parameters to add gas to a transaction
 * @returns {Promise<AddGasResponse>} - Response from adding gas to a transaction
 */
export async function addGas(
  { autocalculateGasOptions, sendOptions, ...params }: AddGasParams,
  dependencies: AddGasDependencies,
): Promise<AddGasResponse> {
  const { chains } = await dependencies.configClient.getAxelarConfigs(
    sendOptions.environment,
  );

  const chainConfig =
    params.chain in chains && chains[params.chain]?.chainType === "axelarnet"
      ? chains[params.chain]
      : undefined;

  if (!chainConfig) {
    throw new Error(`chain ID ${params.chain} not found`);
  }

  const { rpc, ibc } = chainConfig.config as ChainCosmosSubconfig;

  const [tx] = await dependencies.gmpClient
    .searchGMP({ txHash: params.txHash as `0x${string}` })
    .catch(() => []);

  if (!tx) {
    return {
      success: false,
      info: `${params.txHash} could not be found`,
    };
  }

  const denomOnSrcChain = getIBCDenomOnSrcChain(
    tx.gas_paid?.returnValues?.denom,
    sendOptions.environment,
    chainConfig,
  );

  if (!denomOnSrcChain) throw new Error("could not find denomOnSrcChain");

  if (!matchesOriginalTokenPayment(params.token, denomOnSrcChain)) {
    return {
      success: false,
      info: `The token you are trying to send does not match the token originally \
        used for gas payment. Please send ${tx.gas_paid?.returnValues?.denom} instead`,
    };
  }

  const coin =
    params.token !== "autocalculate"
      ? params.token
      : await getFullFee({
          tx,
          autocalculateGasOptions,
          chainConfig,
          environment: sendOptions.environment,
          axelarQueryClient: dependencies.axelarQueryClient,
        });

  const rpcUrl = sendOptions.rpcUrl ?? rpc[0];

  if (!rpcUrl) {
    return {
      success: false,
      info: "Missing RPC URL. Please pass in an rpcUrl parameter in the sendOptions parameter",
    };
  }

  const signingStargateClient = await dependencies.getSigningStargateClient(
    rpcUrl,
    sendOptions.offlineSigner,
  );

  const sender = await sendOptions.offlineSigner
    .getAccounts()
    .then(([acc]) => acc?.address);

  if (!sender) {
    return {
      success: false,
      info: `Could not find sender from designated offlineSigner`,
    };
  }

  const timeoutTimestamp = longify(
    sendOptions.timeoutTimestamp ?? getDefaultTimeoutTimestamp(),
  );

  const broadcastResult =
    await signingStargateClient.messages.ibcTransfer.transfer.signAndBroadcast(
      sender,
      {
        sourcePort: "transfer",
        sourceChannel: String(ibc?.toAxelar.channelId),
        token: coin,
        sender,
        receiver: COSMOS_GAS_RECEIVER_OPTIONS[sendOptions.environment],
        timeoutTimestamp,
        memo: tx.call.id,
      },
      sendOptions.txFee,
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
  environment,
}: GetFullFeeOptions): Promise<Coin> {
  const amount = await axelarQueryClient.estimateGasFee({
    sourceChain: tx.call.chain,
    destinationChain: tx.call.returnValues.destinationChain,
    gasLimit: autocalculateGasOptions?.gasLimit ?? BigInt(1_000_000),
    gasMultiplier: autocalculateGasOptions?.gasMultipler ?? 1,
    sourceTokenSymbol:
      tx.gas_paid?.returnValues?.denom ?? environment === "mainnet"
        ? "axlUSDC"
        : "aUSDC",
  });

  const denom = getIBCDenomOnSrcChain(
    tx.gas_paid?.returnValues?.denom,
    environment,
    chainConfig,
  );

  if (!denom) throw new Error("could not find denom");

  return {
    denom,
    amount: typeof amount === "string" ? amount : amount.executionFee,
  };
}

function matchesOriginalTokenPayment(
  token: Coin | "autocalculate",
  denom: string,
) {
  return token === "autocalculate" || token?.denom === denom;
}

function getIBCDenomOnSrcChain(
  denomOnAxelar: string | undefined,
  env: Environment,
  chain: ChainConfig,
) {
  if (chain.chainType !== "axelarnet") {
    throw new Error("cannot find token that matches original gas payment");
  }

  /**
   * take the denom that is fetched from the original tx details in the index;
   * if that does not exist, default to USDC
   * (i.e. 'uusdc' on mainnet, 'uausdc' on testnet)
   */
  const denom = denomOnAxelar ?? (env === "mainnet" ? "uusdc" : "uausdc");

  return chain.assets[denom];
}
