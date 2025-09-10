import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/lib/trpc";

export interface RegisterCanonicalTokenParams {
  caller: string;
  tokenAddress: string;
  onStatusUpdate?: (status: {
    type: "pending_approval" | "registering" | "registered" | "idle";
    txHash?: string;
  }) => void;
}

export function useRegisterCanonicalToken() {
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const registerTx =
    trpc.solana.getRegisterCanonicalInterchainTokenTxBytes.useMutation();

  const registerMutation = useMutation<
    {
      signature: string;
      tokenId: string;
      tokenAddress: string;
      tokenManagerAddress: string;
    },
    Error,
    RegisterCanonicalTokenParams
  >({
    mutationFn: async (params) => {
      if (!connection || !publicKey) {
        throw new Error("Wallet not connected or connection unavailable");
      }

      // step 1: pending approval for register
      params.onStatusUpdate?.({
        type: "pending_approval",
      });

      const serverResp = await registerTx.mutateAsync(params);
      const { txBase64, tokenId, tokenAddress, tokenManagerAddress } =
        serverResp;
      const tx = Transaction.from(Buffer.from(txBase64, "base64"));

      // Preflight simulate for helpful logs
      try {
        // For legacy Transaction, simulateTransaction only accepts (tx, signers?, includeAccounts?)
        const sim = await connection.simulateTransaction(tx);
        if (sim.value.err) {
          // eslint-disable-next-line no-console
          console.error("[Solana] simulateTransaction error", sim.value);
          const logs = (sim.value.logs || []).join("\n");
          throw new Error(
            `Simulation failed: ${JSON.stringify(sim.value.err)}\n${logs}`
          );
        }
      } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error(String(e));
      }

      const signature = await sendTransaction(tx, connection, {
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });

      // step 2: registering (we surface signature as tx hash analogue)
      params.onStatusUpdate?.({
        type: "registering",
        txHash: signature,
      });

      return { signature, tokenId, tokenAddress, tokenManagerAddress };
    },
  });

  const registerCanonicalToken = async (
    params: RegisterCanonicalTokenParams
  ) => {
    return await registerMutation.mutateAsync(params);
  };

  return { registerCanonicalToken };
}
