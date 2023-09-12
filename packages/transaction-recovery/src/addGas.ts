import { S3CosmosChainConfig } from "@axelarjs/api/s3/types";
import { COSMOS_GAS_RECEIVER_OPTIONS, Environment } from "@axelarjs/core";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import type { Coin, StdFee } from "@cosmjs/stargate";

import { getCosmosSigner } from "./cosmosSigner";
import { gmpClient, s3Client } from "./services";

export type SendOptions = {
  txFee: StdFee;
  environment: Environment;
  offlineSigner: DirectSecp256k1HdWallet;
  rpcUrl?: string;
  timeoutTimestamp?: number;
};

export async function addGas(
  chain: string,
  txHash: string,
  token: Coin | "autocalculate",
  sendOptions: SendOptions
) {
  if (token === "autocalculate") {
    throw new Error("autocalculate not yet supported, but we will soon!");
  }

  const selectedChainInfo = (await s3Client()
    .getChainConfigs()
    .then((res) => res.chains[chain])
    .catch(() => undefined)) as S3CosmosChainConfig;

  if (!selectedChainInfo) throw new Error(`chain ID ${chain} not found`);

  const { rpc, channelIdToAxelar } = selectedChainInfo.cosmosConfigs;

  const tx = await gmpClient(sendOptions.environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!tx || tx?.length < 1) {
    throw new Error(`${txHash} could not be found`);
  }

  const sender = await sendOptions.offlineSigner
    .getAccounts()
    .then(([acc]) => acc?.address);

  if (!sender) {
    throw new Error("Sender could not be found");
  }

  const rpcUrl = sendOptions.rpcUrl ?? rpc[0];

  if (!rpcUrl) throw new Error("Pass in an RPC URL");

  return (
    await getCosmosSigner(rpcUrl, sendOptions.offlineSigner)
  ).signAndBroadcast(
    sender,
    [
      {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: {
          sourcePort: "transfer",
          sourceChannel: channelIdToAxelar,
          token,
          sender,
          receiver: COSMOS_GAS_RECEIVER_OPTIONS[sendOptions.environment],
          timeoutTimestamp:
            sendOptions.timeoutTimestamp ?? (Date.now() + 90) * 1e9,
          memo: tx[0]?.call.id,
        },
      },
    ],
    sendOptions.txFee
  );
}
