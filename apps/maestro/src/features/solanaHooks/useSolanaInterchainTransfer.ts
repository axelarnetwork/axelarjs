import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/lib/trpc";

export interface SolanaInterchainTransferParams {
  caller: string;
  tokenId: string; // 0x-prefixed hex
  tokenAddress: string; // mint base58
  destinationChain: string;
  destinationAddress: string; // hex-encoded recipient for EVM, bytes for others already handled upstream
  amount: string; // base units
  gasValue?: string; // lamports
  onStatusUpdate?: (status: {
    type: "pending_approval" | "sending" | "sent" | "idle";
    txHash?: string;
  }) => void;
}

export function useSolanaInterchainTransfer() {
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const buildTx = trpc.solana.getInterchainTransferTxBytes.useMutation();

  const mutation = useMutation<
    { signature: string },
    Error,
    SolanaInterchainTransferParams
  >({
    mutationFn: async (params) => {
      if (!connection || !publicKey) {
        throw new Error("Wallet not connected or connection unavailable");
      }
      params.onStatusUpdate?.({ type: "pending_approval" });

      const { txBase64 } = await buildTx.mutateAsync({
        caller: params.caller,
        tokenId: params.tokenId,
        tokenAddress: params.tokenAddress,
        destinationChain: params.destinationChain,
        destinationAddress: params.destinationAddress,
        amount: params.amount,
        gasValue: params.gasValue ?? "0",
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
      params.onStatusUpdate?.({ type: "sending", txHash: signature });
      return { signature };
    },
  });

  const interchainTransfer = async (params: SolanaInterchainTransferParams) =>
    mutation.mutateAsync(params);

  return { interchainTransfer };
}
