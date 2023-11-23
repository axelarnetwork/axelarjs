import { toast } from "@axelarjs/ui/toaster";
import { invariant } from "@axelarjs/utils";
import { useEffect, useRef } from "react";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation, useWaitForTransaction } from "wagmi";

import {
  useInterchainTokenApprove,
  useInterchainTokenDecimals,
} from "~/lib/contracts/InterchainToken.hooks";
import { useInterchainTokenServiceTokenManagerAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import { useTokenManagerInterchainTransfer } from "~/lib/contracts/TokenManager.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeQuery } from "~/services/axelarjsSDK/hooks";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
};

export function useTokenManagerSendTokenMutation(
  config: UseSendInterchainTokenConfig
) {
  const [txState, setTxState] = useTransactionState();

  const { data: decimals } = useInterchainTokenDecimals({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const { data: gas } = useEstimateGasFeeQuery({
    sourceChainId: config.sourceChainId,
    destinationChainId: config.destinationChainId,
    sourceChainTokenSymbol: getNativeToken(config.sourceChainId.toLowerCase()),
  });

  const { data: tokenManagerAddress } =
    useInterchainTokenServiceTokenManagerAddress({
      args: [config.tokenId],
      enabled: Boolean(config.tokenId),
    });

  const { writeAsync: approveInterchainTokenAsync, data: approveERC20Data } =
    useInterchainTokenApprove({
      address: config.tokenAddress,
    });

  const { writeAsync: interchainTransferAsync, data: sendTokenData } =
    useTokenManagerInterchainTransfer({
      address: tokenManagerAddress,
      value: BigInt(gas ?? 0) * BigInt(2),
    });

  const { data: approveERC20Recepit } = useWaitForTransaction({
    hash: approveERC20Data?.hash,
    confirmations: 1,
  });

  const approvedAmountRef = useRef(0n);

  useEffect(
    () => {
      async function sendToken() {
        try {
          setTxState({
            status: "awaiting_approval",
          });

          invariant(address, "need address");

          const txResult = await interchainTransferAsync({
            args: [
              config.destinationChainId,
              address,
              approvedAmountRef.current,
              "0x",
            ],
          });
          if (txResult?.hash) {
            setTxState({
              status: "submitted",
              hash: txResult.hash,
            });
          }
        } catch (error) {
          if (error instanceof TransactionExecutionError) {
            toast.error(`Transaction failed: ${error.cause.shortMessage}`);
            logger.error("Faied to transfer token:", error.cause);

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
      }

      if (approveERC20Recepit && !sendTokenData?.hash) {
        sendToken().catch((error) => {
          logger.error("Failed to send token:", error);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      address,
      approveERC20Recepit,
      config.destinationChainId,
      interchainTransferAsync,
    ]
  );

  const mutation = useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount }) => {
      if (!(decimals && address && gas)) {
        return;
      }

      invariant(tokenManagerAddress, "need token manager address");

      try {
        approvedAmountRef.current = parseUnits(amount, decimals);

        setTxState({
          status: "awaiting_spend_approval",
          amount: approvedAmountRef.current,
        });

        await approveInterchainTokenAsync({
          args: [tokenManagerAddress, approvedAmountRef.current],
        });
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(
            `Approval transaction failed: ${error.cause.shortMessage}`
          );
          logger.error("Failed to approve token transfer:", error.cause);

          setTxState({ status: "idle" });
        }
      }
    }
  );

  return {
    ...mutation,
    txState,
    reset: () => {
      setTxState({ status: "idle" });
      mutation.reset();
    },
  };
}
