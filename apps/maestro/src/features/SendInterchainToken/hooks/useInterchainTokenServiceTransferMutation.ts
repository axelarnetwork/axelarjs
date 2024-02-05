import {
  INTERCHAIN_TOKEN_ENCODERS,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";
import { toast } from "@axelarjs/ui/toaster";
import { invariant } from "@axelarjs/utils";
import { useCallback, useEffect, useRef } from "react";

import { parseUnits, TransactionExecutionError } from "viem";
import {
  useAccount,
  useChainId,
  useMutation,
  useWaitForTransaction,
} from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import {
  useInterchainTokenAllowance,
  useInterchainTokenApprove,
  useInterchainTokenDecimals,
} from "~/lib/contracts/InterchainToken.hooks";
import { useInterchainTokenServiceInterchainTransfer } from "~/lib/contracts/InterchainTokenService.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChainName: string;
  destinationChainName: string;
  gas?: bigint;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
};

export function useInterchainTokenServiceTransferMutation(
  config: UseSendInterchainTokenConfig
) {
  const chainId = useChainId();
  const [txState, setTxState] = useTransactionState();

  const { data: decimals } = useInterchainTokenDecimals({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const { data: tokenAllowance } = useInterchainTokenAllowance({
    address: config.tokenAddress,
    args: INTERCHAIN_TOKEN_ENCODERS.allowance.args({
      owner: address ?? "0x",
      spender: NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
    }),
    watch: true,
  });

  const {
    writeAsync: approveInterchainTokenAsync,
    data: approveERC20Data,
    reset: resetApproveMutation,
  } = useInterchainTokenApprove({
    address: config.tokenAddress,
  });

  const {
    writeAsync: interchainTransferAsync,
    data: sendTokenData,
    reset: resetInterchainTransferMutation,
  } = useInterchainTokenServiceInterchainTransfer({
    address: NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
    value: BigInt(config.gas ?? 0) * BigInt(2),
  });

  const { data: approveERC20Recepit } = useWaitForTransaction({
    hash: approveERC20Data?.hash,
  });

  const approvedAmountRef = useRef(0n);

  const handleInterchainTransfer = useCallback(async () => {
    try {
      setTxState({
        status: "awaiting_approval",
      });

      invariant(address, "need address");

      const txResult = await interchainTransferAsync({
        args: INTERCHAIN_TOKEN_SERVICE_ENCODERS.interchainTransfer.args({
          tokenId: config.tokenId,
          destinationChain: config.destinationChainName,
          destinationAddress: address,
          amount: approvedAmountRef.current,
          metadata: "0x",
          gasValue: config.gas ?? 0n,
        }),
      });

      if (txResult?.hash) {
        setTxState({
          status: "submitted",
          hash: txResult.hash,
          chainId,
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
    }
  }, [address, chainId, config, interchainTransferAsync, setTxState]);

  useEffect(
    () => {
      if (approveERC20Recepit && !sendTokenData?.hash) {
        handleInterchainTransfer().catch((error) => {
          logger.error("Failed to send token:", error);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      address,
      sendTokenData?.hash,
      approveERC20Recepit,
      config.destinationChainName,
      interchainTransferAsync,
    ]
  );

  const mutation = useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount }) => {
      if (!(decimals && address && config.gas)) {
        return;
      }

      try {
        approvedAmountRef.current = parseUnits(amount, decimals);

        setTxState({
          status: "awaiting_spend_approval",
          amount: approvedAmountRef.current,
        });

        // only request spend approval if the allowance is not enough
        if (!tokenAllowance || tokenAllowance < approvedAmountRef.current) {
          await approveInterchainTokenAsync({
            args: INTERCHAIN_TOKEN_ENCODERS.approve.args({
              spender: NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
              amount: approvedAmountRef.current,
            }),
          });
          return;
        }

        await handleInterchainTransfer();
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

      resetApproveMutation();
      resetInterchainTransferMutation();

      mutation.reset();
    },
  };
}
