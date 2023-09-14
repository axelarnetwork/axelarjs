import { SearchGMPResponseData } from "@axelarjs/api";
import { createAxelarQueryNodeClient } from "@axelarjs/api/axelar-query/node";
import { COSMOS_GAS_RECEIVER_OPTIONS, Environment } from "@axelarjs/core";

import { OfflineSigner } from "@cosmjs/proto-signing";
import type { Coin, StdFee } from "@cosmjs/stargate";

import { getCosmosSigner } from "./cosmosSigner";
import { gmpClient } from "./services";

export type SendOptions = {
  channelIdToAxelar: string;
  rpcUrl: string;
  txFee: StdFee;
  timeoutTimestamp?: number;
  environment: Environment;
  offlineSigner: OfflineSigner;
};
export type AutocalculateGasOptions = {
  gasLimit?: bigint;
  gasMultipler?: number;
};
export type AddGasParams = {
  txHash: string;
  token: Coin | "autocalculate";
  sendOptions: SendOptions;
  autocalculateGasOptions?: AutocalculateGasOptions;
};

export async function addGas({
  txHash,
  token,
  sendOptions,
  autocalculateGasOptions,
}: AddGasParams) {
  const { txFee, timeoutTimestamp, environment, offlineSigner } = sendOptions;

  let coin = token;
  const tx = await gmpClient(environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!tx || tx?.length < 1 || !tx[0]) {
    throw new Error(`${txHash} could not be found`);
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
    throw new Error("Sender could not be found");
  }

  const signer = await getCosmosSigner(sendOptions.rpcUrl, offlineSigner);

  return signer.signAndBroadcast(
    sender,
    [
      {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: {
          sourcePort: "transfer",
          sourceChannel: sendOptions.channelIdToAxelar,
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

function getIBCDenomOnSrcChain(denomOnAxelar: string, sourceChain: string) {
  //TODO, get IBC equivalent of denomOnAxelar on srcChain
  console.log({ denomOnAxelar, sourceChain });
  return "ibc/9463E39D230614B313B487836D13A392BD1731928713D4C8427A083627048DB3"; //TODO
}
