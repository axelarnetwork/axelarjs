import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/lib/trpc";

export interface DeployRemoteCanonicalTokenParams {
  caller: string;
  tokenAddress: string;
  destinationChain: string | string[];
  gasValue: string | string[];
  onStatusUpdate?: (status: {
    type: "pending_approval" | "deploying" | "deployed" | "idle";
    txHash?: string;
  }) => void;
}

export function useDeployRemoteCanonicalToken() {
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const buildTx =
    trpc.solana.getDeployRemoteCanonicalInterchainTokenTxBytes.useMutation();

  const mutation = useMutation<
    { signature: string; tokenId: string; tokenAddress: string },
    Error,
    DeployRemoteCanonicalTokenParams
  >({
    mutationFn: async (params) => {
      if (!connection || !publicKey) {
        throw new Error("Wallet not connected or connection unavailable");
      }
      params.onStatusUpdate?.({ type: "pending_approval" });

      const { txBase64, tokenId, tokenAddress } = await buildTx.mutateAsync({
        caller: params.caller,
        tokenAddress: params.tokenAddress,
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

  const deployRemoteCanonicalToken = async (
    params: DeployRemoteCanonicalTokenParams
  ) => mutation.mutateAsync(params);

  return { deployRemoteCanonicalToken };
}
