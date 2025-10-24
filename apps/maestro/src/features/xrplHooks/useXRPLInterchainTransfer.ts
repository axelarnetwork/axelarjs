import { useWallet, useSignAndSubmitTransaction } from "@axelarjs/xrpl-wallet-standard-vendored";
import { useMutation } from "@tanstack/react-query";
import * as xrpl from "xrpl";
import { toast } from "@axelarjs/ui/toaster";

import { trpc } from "~/lib/trpc";
import { autofillAndSimulateXRPLTx, XRPL_NETWORK_IDENTIFIER } from "~/lib/utils/xrpl";

export interface XRPLInterchainTransferParams {
    caller: string;
    tokenId: string; // 0x-prefixed hex
    tokenAddress: string; // mint base58
    destinationChain: string;
    destinationAddress: string; // hex-encoded recipient for EVM, bytes for others already handled upstream
    amount: string; // base units
    gasValue?: string; // drops
    onStatusUpdate?: (status: {
        type: "pending_approval" | "sending" | "sent" | "idle";
        txHash?: string;
    }) => void;
}

export function useXRPLInterchainTransfer() {
    const { wallet } = useWallet();
    const signAndSubmit = useSignAndSubmitTransaction();

    const buildTx = trpc.xrpl.getInterchainTransferTxBytes.useMutation();

    const mutation = useMutation<{ txHash: string }, Error, XRPLInterchainTransferParams>({
        mutationFn: async (params) => {
            if (!wallet) {
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

            const tx = xrpl.decode(txBase64) as xrpl.Payment; // todo: check for proper type

            let preparedTx;
            try {
                preparedTx = await autofillAndSimulateXRPLTx(tx);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                
                toast.error(`Error during XRPL transaction simulation: ${message}`);
                console.error("Error during XRPL transaction simulation:", error);
                throw error;
            }

            try {
                const result = await signAndSubmit(preparedTx, XRPL_NETWORK_IDENTIFIER); // TODO: refactor type?
                const txHash = result.tx_hash;
                params.onStatusUpdate?.({ type: "sending", txHash: txHash });

                return { txHash };
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);

                toast.error(`Error during XRPL transaction signing/submission: ${message}`);
                console.error("Error during XRPL transaction signing/submission", error);
                throw error;
            }
        },
    });

    const interchainTransfer = async (params: XRPLInterchainTransferParams) =>
    mutation.mutateAsync(params);

    return interchainTransfer;
}