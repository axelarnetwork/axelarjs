import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/lib/trpc";

export interface DeployRemoteInterchainTokenParams {
  caller: string;
  salt: string; // hex bytes32
  destinationChain: string | string[];
  gasValue: string | string[]; // u64 or array of u64
  onStatusUpdate?: (status: {
    type: "pending_approval" | "deploying" | "deployed" | "idle";
    txHash?: string;
  }) => void;
}

export function useDeployRemoteInterchainToken() {
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const buildTx =
    trpc.solana.getDeployRemoteInterchainTokenTxBytes.useMutation();

  const mutation = useMutation<
    { signature: string; tokenId: string; tokenAddress: string },
    Error,
    DeployRemoteInterchainTokenParams
  >({
    mutationFn: async (params) => {
      if (!connection || !publicKey) {
        throw new Error("Wallet not connected or connection unavailable");
      }
      params.onStatusUpdate?.({ type: "pending_approval" });

      const { txBase64, tokenId, tokenAddress } = await buildTx.mutateAsync({
        caller: params.caller,
        salt: params.salt,
        destinationChain: params.destinationChain,
        gasValue: params.gasValue,
      });

      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const sim = await connection.simulateTransaction(tx);
      if (sim.value.err) {
        // eslint-disable-next-line no-console
        console.error("[Solana] simulateTransaction error", sim.value);
        const logs = (sim.value.logs || []).join("\n");
        throw new Error(
          `Simulation failed: ${JSON.stringify(sim.value.err)}\n${logs}`
        );
      }

      const signature = await sendTransaction(tx, connection, {
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });
      params.onStatusUpdate?.({ type: "deploying", txHash: signature });

      return { signature, tokenId, tokenAddress };
    },
  });

  const deployRemoteInterchainToken = async (
    params: DeployRemoteInterchainTokenParams
  ) => mutation.mutateAsync(params);

  return { deployRemoteInterchainToken };
}
