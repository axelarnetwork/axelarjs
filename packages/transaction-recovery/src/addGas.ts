import { COSMOS_GAS_RECEIVER_OPTIONS, Environment } from "@axelarjs/core";

import type { Coin, StdFee } from "@cosmjs/stargate";

import { getCosmosSigner, getCosmosWallet } from "./cosmosSigner";
import { gmpClient } from "./services";

export type SendOptions = {
  channelIdToAxelar: string;
  rpcUrl: string;
  txFee: StdFee;
  timeoutTimestamp?: number;
  environment: Environment;
  cosmosAddressPrefix: string;
  cosmosWalletMnemonic: string;
};

export async function addGas(
  txHash: string,
  token: Coin | "autocalculate",
  sendOptions: SendOptions
) {
  if (token === "autocalculate") {
    throw new Error("autocalculate not yet supported, but we will soon!");
  }

  const tx = await gmpClient(sendOptions.environment)
    .searchGMP({
      txHash,
    })
    .catch(() => undefined);

  if (!tx || tx?.length < 1) {
    throw new Error(`${txHash} could not be found`);
  }

  const offlineSigner = await getCosmosWallet(
    sendOptions.cosmosWalletMnemonic,
    sendOptions.cosmosAddressPrefix
  );

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
