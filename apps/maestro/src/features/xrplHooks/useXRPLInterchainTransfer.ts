import { useWallet, useSignAndSubmitTransaction } from "@xrpl-wallet-standard/react";
import { useMutation } from "@tanstack/react-query";
import * as xrpl from "xrpl";
import { toast } from "@axelarjs/ui/toaster";

import { trpc } from "~/lib/trpc";
import { xrplChainConfig } from "~/config/chains";

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
    const { wallet, status } = useWallet();
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

            const client = new xrpl.Client(xrplChainConfig.rpcUrls.default.http[0]);
            await client.connect();
            
            let preparedTx;
            try {
                preparedTx = await client.autofill(tx);
                const sim = await client.simulate(preparedTx);
                if (sim.status !== 'success') {
                    throw Error(`Simulation failed: ${sim.status}`);
                }
            }
            catch (error) {
                toast.error(`Error during XRPL transaction simulation: ${error}`); // TODO: what to do in that case?
                throw error;
            }

            try {
                const result = await signAndSubmit(preparedTx, `xrpl:${process.env.NEXT_PUBLIC_NETWORK_ENV === 'mainnet' ? '0' : process.env.NEXT_PUBLIC_NETWORK_ENV === 'devnet-amplifier' ? '2' : '1'}`);
                const txHash = result.tx_hash;
                console.log("Submitted transaction successfully:", txHash);
                params.onStatusUpdate?.({ type: "sending", txHash: txHash });

                return { txHash };
            }
            catch (error) {
                console.error("Error during XRPL transaction signing/submission:", error);
                throw error;
            }
        },
    });

    const interchainTransfer = async (params: XRPLInterchainTransferParams) =>
    mutation.mutateAsync(params);

    return interchainTransfer;
}