import { INTERCHAIN_TOKEN_ENCODERS } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui/toaster";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { parseUnits, TransactionExecutionError } from "viem";

import { useSendStellarToken } from "~/features/stellarHooks";
import { suiClient as client } from "~/lib/clients/suiClient";
import { useWriteInterchainTokenInterchainTransfer } from "~/lib/contracts/InterchainToken.hooks";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { stellarEncodedRecipient } from "~/server/routers/stellar/utils";
import { useConnect as useXRPLConnect, useWallet as useXRPLWallet, useSignAndSubmitTransaction as useXRPLSignAndSubmitTransaction } from "@xrpl-wallet-standard/react";
import * as xrpl from "xrpl";
import { xrplChainConfig } from "~/config/chains";

export type UseSendInterchainTokenConfig = {
  tokenAddress: string;
  sourceChainName: string;
  destinationChainName: string;
  gas?: bigint;
  tokenId?: string;
  destinationAddress?: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
  tokenId?: string;
  destinationAddress?: string;
  decimals?: number;
};

export function useInterchainTransferMutation(
  config: UseSendInterchainTokenConfig
) {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address } = useAccount();
  const { connect: xrplConnection } = useXRPLConnect();
  const { wallet: xrplWallet } = useXRPLWallet();
  const xrplSignAndSubmit = useXRPLSignAndSubmitTransaction();
  

  const { sendToken: sendStellarToken } = useSendStellarToken();

  const { writeContractAsync: transferAsync } =
    useWriteInterchainTokenInterchainTransfer();

  const { mutateAsync: getSendTokenTx } = trpc.sui.getSendTokenTx.useMutation({
    onError(error) {
      console.log("error in getSendTokenTx", error.message);
    },
  });

  const { mutateAsync: getXRPLSendTokenTx } = trpc.xrpl.getInterchainTransferTxBytes.useMutation({
    onError(error) {
      console.log("error in getSendTokenTx", error.message);
    },
  });

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) => {
        const result = await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showObjectChanges: true,
            showEvents: true,
            showEffects: true,
            showRawEffects: true,
          },
        });
        return result;
      },
    });

  const mutation = useMutation<void, unknown, UseSendInterchainTokenInput>({
    mutationFn: async ({ amount, tokenId, destinationAddress, decimals }) => {
      if (!(address && config.gas && tokenId && destinationAddress)) {
        return;
      }

      const bnAmount = parseUnits(amount, decimals || 0);
      try {
        setTxState({
          status: "awaiting_approval",
        });
        let txHash: any;
        let encodedRecipient: `0x${string}`;
        console.log("In mutation: useInterchainTransferMutation");
        // Encode the recipient address for Stellar since it's a base64 string
        if (config.destinationChainName.toLowerCase().includes("stellar")) {
          encodedRecipient = stellarEncodedRecipient(destinationAddress);
        } else {
          encodedRecipient = destinationAddress as `0x${string}`;
        }
        if (config.sourceChainName.toLowerCase().includes("sui")) {
          const sendTokenTxJSON = await getSendTokenTx({
            sender: address,
            tokenId: tokenId,
            amount: bnAmount.toString(),
            destinationChain: config.destinationChainName,
            destinationAddress: encodedRecipient,
            gas: config.gas.toString() ?? "0",
            coinType: config.tokenAddress,
          });
          const receipt = await signAndExecuteTransaction({
            transaction: sendTokenTxJSON,
          });
          txHash = receipt.digest;
        } else if (config.sourceChainName.toLowerCase().includes("xrpl") && !config.sourceChainName.toLowerCase().includes("evm")) {
          console.log("In mutation: XRPL path");

          /*const xrplInterchainTransfer = useXRPLInterchainTransfer();
          console.log("Got xrplInterchainTransfer function", xrplInterchainTransfer);

          xrplInterchainTransfer({
            caller: address,
            tokenId: tokenId,
            tokenAddress: config.tokenAddress,
            destinationChain: config.destinationChainName,
            destinationAddress: encodedRecipient,
            amount: bnAmount.toString(),
            gasValue: config.gas.toString() ?? "0",
          });*/

          const gasToAdd = config.gas ?? 0;
          const totalTransferAmount = bnAmount + gasToAdd;
          const { txBase64 } = await getXRPLSendTokenTx({
            caller: address,
            tokenId: tokenId,
            tokenAddress: config.tokenAddress,
            destinationChain: config.destinationChainName,
            destinationAddress: encodedRecipient,
            amount: totalTransferAmount.toString(),
            gasValue: gasToAdd.toString(),
          });

          const tx = xrpl.decode(txBase64) as xrpl.Payment; // todo: check for proper type

          console.log("Decoded tx:", tx);

          const client = new xrpl.Client(xrplChainConfig.rpcUrls.default.http[0]);
          await client.connect();
          
          let preparedTx;
          try {
              preparedTx = await client.autofill(tx);
              const sim = await client.simulate(preparedTx);

              console.log("Simulation result:", sim);
          }
          catch (error) {
              console.error("Error during XRPL transaction simulation:", error);
              throw error;
          }

          try {
              const result = await xrplSignAndSubmit(preparedTx, `xrpl:${process.env.NEXT_PUBLIC_NETWORK_ENV === 'mainnet' ? '0' : process.env.NEXT_PUBLIC_NETWORK_ENV === 'devnet-amplifier' ? '2' : '1'}`);
              txHash = result.tx_hash;
              console.log("Submitted transaction successfully:", txHash);
              //params.onStatusUpdate?.({ type: "sending", txHash: txHash }); // TODO?

          }
          catch (error) {
              console.error("Error during XRPL transaction signing/submission:", error);
              throw error;
          }
          
        }
        else if (config.sourceChainName.toLowerCase().includes("stellar")) {
          const result = await sendStellarToken.mutateAsync({
            caller: address,
            tokenId: tokenId,
            destinationChain: config.destinationChainName,
            destinationAddress: destinationAddress,
            amount: Number(bnAmount.toString()),
            gasValue: Number(config.gas.toString()) || 0,
          });

          txHash = result.hash;
        } else {
          txHash = await transferAsync({
            address: config.tokenAddress as `0x${string}`,
            value: config.gas ?? 0n,
            args: INTERCHAIN_TOKEN_ENCODERS.interchainTransfer.args({
              destinationChain: config.destinationChainName,
              recipient: encodedRecipient,
              amount: bnAmount,
              metadata: "0x",
            }),
          });
        }
        if (txHash) {
          setTxState({
            status: "submitted",
            hash: txHash,
            chainId,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(`Transaction failed: ${error.cause.shortMessage}`);
          logger.error("Failed to transfer token:", error.cause);

          setTxState({
            status: "idle",
          });
          return;
        }

        if (error instanceof Error) {
          setTxState({
            status: "reverted",
            error: error,
          });
        } else {
          setTxState({
            status: "reverted",
            error: new Error("failed to transfer token"),
          });
        }

        return;
      }
    },
  });

  return {
    ...mutation,
    txState,
    reset: () => {
      setTxState({ status: "idle" });
      mutation.reset();
    },
  };
}
