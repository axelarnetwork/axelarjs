import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { nativeToScVal } from "@stellar/stellar-sdk";
import { rpc, Transaction } from "stellar-sdk";

import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import { addressToScVal, tokenToScVal } from ".";
import {
  STELLAR_ITS_CONTRACT_ID,
  STELLAR_RPC_URL,
  XLM_ASSET_ADDRESS,
} from "./config";
import {
  createContractTransaction,
  fetchStellarAccount,
  hexToScVal,
} from "./transactions";

export async function stellarInterchainTransfer({
  tokenId,
  destinationChain,
  destinationAddress,
  amount,
  gasValue,
  caller,
  kit,
}: {
  tokenId: string;
  destinationChain: string;
  destinationAddress: string;
  amount: number;
  gasValue: number;
  caller: string;
  kit: StellarWalletsKit;
}) {
  try {
    const server = new rpc.Server(STELLAR_RPC_URL);

    const { transactionXDR } = await createContractTransaction({
      contractAddress: STELLAR_ITS_CONTRACT_ID,
      method: "interchain_transfer",
      account: await fetchStellarAccount(caller),
      args: [
        addressToScVal(caller),
        hexToScVal(tokenId),
        nativeToScVal(destinationChain, { type: "string" }),
        hexToScVal(destinationAddress),
        nativeToScVal(amount, { type: "i128" }),
        nativeToScVal(null, { type: "void" }),
        tokenToScVal(XLM_ASSET_ADDRESS, gasValue),
      ],
    });

    const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    });

    const tx = new Transaction(
      signedTxXdr,
      NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
    );
    const result = await server.sendTransaction(tx);

    return result;
  } catch (error) {
    console.error("Interchain transfer failed:", error);
    throw error;
  }
}
