import { createAxelarQueryNodeClient } from "@axelarjs/api";
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

export async function addGas(
  txHash: string,
  token: Coin | "autocalculate",
  sendOptions: SendOptions
) {
  const { txFee, timeoutTimestamp, environment, offlineSigner } = sendOptions;

  const tx = await gmpClient(environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!tx || tx?.length < 1) {
    throw new Error(`${txHash} could not be found`);
  }

  if (token === "autocalculate") {
    token = await getFullFee();
  }

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
          token,
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
};
async function getFullFee({ environment }: GetFullFeeOptions): Promise<Coin> {
  const apiClient = createAxelarQueryNodeClient(environment, {});
  const fullFee = await apiClient.estimateGasFee({
    sourceChain: "ethereum-2",
    destinationChain: "avalanche",
    gasLimit: 700_000 as any,
    gasMultiplier: 1.1,
    sourceContractAddress: undefined,
    destinationContractAddress: undefined,
    amount: 1,
    amountInUnits: "1000000",
  });
  console.log({ fullFee });
  return {
    denom: "",
    amount: "",
  };
}
