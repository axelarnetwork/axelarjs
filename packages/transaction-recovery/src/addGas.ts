import { SearchGMPResponseData } from "@axelarjs/api";
import { createAxelarQueryNodeClient } from "@axelarjs/api/axelar-query/node";
import { S3CosmosChainConfig } from "@axelarjs/api/s3/types";
import { COSMOS_GAS_RECEIVER_OPTIONS, Environment } from "@axelarjs/core";

import { assertIsDeliverTxSuccess, Coin } from "@cosmjs/stargate";

import { getCosmosSigner } from "./cosmosSigner";
import { gmpClient, s3Client } from "./services";
import { AddGasParams, AddGasResponse, AutocalculateGasOptions } from "./types";

export async function addGas({
  txHash,
  chain,
  token,
  sendOptions,
  autocalculateGasOptions,
}: AddGasParams): Promise<AddGasResponse> {
  const { txFee, timeoutTimestamp, environment, offlineSigner } = sendOptions;

  let coin = token;

  const selectedChainInfo = (await s3Client(sendOptions.environment)
    .getChainConfigs(sendOptions.environment)
    .then((res) => res.chains[chain])
    .catch(() => undefined)) as S3CosmosChainConfig;

  if (!selectedChainInfo) throw new Error(`chain ID ${chain} not found`);

  const { rpc, channelIdToAxelar } = selectedChainInfo.cosmosConfigs;

  const tx = await gmpClient(sendOptions.environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!tx || tx?.length < 1 || !tx[0]) {
    return {
      success: false,
      info: `${txHash} could not be found`,
    };
  }

  if (!matchesOriginalTokenPayment(token)) {
    return {
      success: false,
      info: `The token you are trying to send does not match the token originally used for gas payment. Please send ${tx[0].gas_paid.returnValues.denom} instead`,
    };
  }

  if (token === "autocalculate") {
    coin = await getFullFee({
      tx: tx[0],
      environment,
      autocalculateGasOptions,
    });
  }

  console.log({ coin });

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

  const broadcastResult = await (
    await getCosmosSigner(rpcUrl, offlineSigner)
  ).signAndBroadcast(
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
          memo: tx[0]?.call.id,
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

type GetFullFeeOptions = {
  environment: Environment;
  autocalculateGasOptions?: AutocalculateGasOptions | undefined;
  tx: SearchGMPResponseData;
};
async function getFullFee({
  environment,
  autocalculateGasOptions,
  tx,
}: GetFullFeeOptions): Promise<Coin> {
  const apiClient = createAxelarQueryNodeClient(environment, {});
  const amount = (await apiClient.estimateGasFee({
    sourceChain: tx.call.chain,
    destinationChain: tx.call.returnValues.destinationChain,
    gasLimit: autocalculateGasOptions?.gasLimit ?? BigInt(1_000_000),
    gasMultiplier: autocalculateGasOptions?.gasMultipler ?? 1,
    sourceTokenSymbol: tx.gas_paid.returnValues.denom,
  })) as string;
  console.log({ amount, tx });
  return {
    denom: getIBCDenomOnSrcChain(tx.gas_paid.returnValues.denom, tx.call.chain),
    amount,
  };
}

function matchesOriginalTokenPayment(token: Coin | "autocalculate") {
  //TODO, once we get the s3 repo merged here, this can be implemented
  return true;
}

function getIBCDenomOnSrcChain(denomOnAxelar: string, sourceChain: string) {
  //TODO, get IBC equivalent of denomOnAxelar on srcChain.
  //once we get the s3 repo merged here, this can be implemented
  console.log({ denomOnAxelar, sourceChain });
  return "ibc/9463E39D230614B313B487836D13A392BD1731928713D4C8427A083627048DB3"; //TODO
}
