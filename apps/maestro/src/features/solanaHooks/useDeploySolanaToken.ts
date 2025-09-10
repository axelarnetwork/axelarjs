import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/lib/trpc";

export interface DeploySolanaTokenParams {
  caller: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: string;
  salt: string;
  minterAddress?: string;
  destinationChainIds?: string[];
  gasValues?: string[];
  onStatusUpdate?: (status: {
    type: "pending_approval" | "deploying" | "deployed" | "idle";
    step?: number;
    totalSteps?: number;
    txHash?: string;
  }) => void;
}

export function useDeploySolanaToken() {
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const deployTx = trpc.solana.getDeployTokenTxBytes.useMutation();

  const deployMutation = useMutation<
    {
      signature: string;
      tokenId?: `0x${string}`;
      tokenAddress?: string;
      tokenManagerAddress?: string;
    },
    Error,
    DeploySolanaTokenParams
  >({
    mutationFn: async (params) => {
      if (!connection || !publicKey) {
        throw new Error("Wallet not connected or connection unavailable");
      }

      // step 1: pending approval for deploy
      params.onStatusUpdate?.({
        type: "pending_approval",
        step: 1,
        totalSteps: params.destinationChainIds?.length ? 2 : 1,
      });

      const serverResp = await deployTx.mutateAsync(params as any);
      const { txBase64, tokenId, tokenAddress, tokenManagerAddress } =
        serverResp as any;
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

      // step 2: deploying (we surface signature as tx hash analogue)
      params.onStatusUpdate?.({
        type: "deploying",
        txHash: signature,
        step: 1,
        totalSteps: params.destinationChainIds?.length ? 2 : 1,
      });

      return { signature, tokenId, tokenAddress, tokenManagerAddress };
    },
  });

  const deploySolanaToken = async (params: DeploySolanaTokenParams) => {
    return await deployMutation.mutateAsync(params);
  };

  return { deploySolanaToken };
}
