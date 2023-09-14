import { createAxelarQueryNodeClient } from "@axelarjs/api/axelar-query/node";
import { S3CosmosChainConfig } from "@axelarjs/api/s3/types";
import { COSMOS_GAS_RECEIVER_OPTIONS } from "@axelarjs/core";

import { assertIsDeliverTxSuccess, Coin } from "@cosmjs/stargate";

import { getCosmosSigner } from "../cosmosSigner";
import { gmpClient, s3Client } from "../services";
import { AddGasParams, AddGasResponse, GetFullFeeOptions } from "../types";

export async function addGas({
  txHash,
  chain,
  token,
  sendOptions,
  autocalculateGasOptions,
}: AddGasParams): Promise<AddGasResponse> {
  const { txFee, timeoutTimestamp, environment, offlineSigner } = sendOptions;

  const chainConfig = (await s3Client(sendOptions.environment)
    .getChainConfigs(sendOptions.environment)
    .then((res) => res.chains[chain])
    .catch(() => undefined)) as S3CosmosChainConfig;

  if (!chainConfig) throw new Error(`chain ID ${chain} not found`);

  const { rpc, channelIdToAxelar } = chainConfig.cosmosConfigs;

  const txs = await gmpClient(sendOptions.environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!txs || txs?.length < 1 || !txs[0]) {
    return {
      success: false,
      info: `${txHash} could not be found`,
    };
  }

  const denomOnSrcChain = getIBCDenomOnSrcChain(
    txs[0].gas_paid.returnValues.denom,
    chainConfig
  );
  if (!matchesOriginalTokenPayment(token, denomOnSrcChain)) {
    return {
      success: false,
      info: `The token you are trying to send does not match the token originally \
        used for gas payment. Please send ${txs[0].gas_paid.returnValues.denom} instead`,
    };
  }

  let coin = token;
  if (token === "autocalculate") {
    coin = await getFullFee({
      tx: txs[0],
      environment,
      autocalculateGasOptions,
      chainConfig,
    });
  }

  const sender = await offlineSigner
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

  const signer = await getCosmosSigner(rpcUrl, offlineSigner);

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
          receiver: COSMOS_GAS_RECEIVER_OPTIONS[environment],
          timeoutTimestamp: timeoutTimestamp ?? (Date.now() + 90) * 1e9,
          memo: txs[0]?.call.id,
        },
      },
    ],
    txFee
  );
  assertIsDeliverTxSuccess(broadcastResult);

  return {
    success: true,
    info: "",
    broadcastResult,
  };
}

async function getFullFee({
  environment,
  autocalculateGasOptions,
  tx,
  chainConfig,
}: GetFullFeeOptions): Promise<Coin> {
  const apiClient = createAxelarQueryNodeClient(environment, {});
  const amount = (await apiClient.estimateGasFee({
    sourceChain: tx.call.chain,
    destinationChain: tx.call.returnValues.destinationChain,
    gasLimit: autocalculateGasOptions?.gasLimit ?? BigInt(1_000_000),
    gasMultiplier: autocalculateGasOptions?.gasMultipler ?? 1,
    sourceTokenSymbol: tx.gas_paid.returnValues.denom,
  })) as string;
  return {
    denom: getIBCDenomOnSrcChain(tx.gas_paid.returnValues.denom, chainConfig),
    amount,
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
  const ibcDenom = chain.assets?.find(
    (asset) => asset.id === denomOnAxelar
  )?.ibcDenom;
  if (!ibcDenom)
    throw new Error("cannot find token that matches original gas payment");
  return ibcDenom;
}
