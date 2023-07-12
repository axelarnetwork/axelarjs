import { toast } from "@axelarjs/ui";
import { invariant } from "@axelarjs/utils";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation, useWaitForTransaction } from "wagmi";

import { useIerc20BurnableMintableDecimals } from "~/lib/contracts/IERC20BurnableMintable.hooks";
import {
  useInterchainTokenApprove,
  useInterchainTokenGetTokenManager,
  useInterchainTokenInterchainTransfer,
} from "~/lib/contracts/InterchainToken.hooks";
import { useTokenManagerSendToken } from "~/lib/contracts/TokenManager.hooks";
import type { TransactionState } from "~/lib/hooks/useTransaction";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  recipientAddress: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
  amount: string;
  tokenId: `0x${string}`;
};

export type UseSendInterchainTokenInput = {};

export function useSendInterchainTokenMutation(
  config: UseSendInterchainTokenConfig
) {
  const { data: decimals } = useIerc20BurnableMintableDecimals({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const { data: gas } = trpc.axelarjsSDK.estimateGasFee.useQuery({
    sourceChainId: config.sourceChainId,
    destinationChainId: config.destinationChainId,
    sourceChainTokenSymbol: getNativeToken(config.sourceChainId.toLowerCase()),
  });

  const { data: tokenManagerAddress } = useInterchainTokenGetTokenManager({
    address: config.tokenAddress,
  });

  console.log({ tokenManagerAddress });

  const { writeAsync: approveAsync, data: approveResult } =
    useInterchainTokenApprove({
      address: config.tokenAddress,
    });

  const { writeAsync: transferAsync, data: transferResult } =
    useTokenManagerSendToken({
      address: config.tokenAddress,
      value: BigInt(gas ?? 0) * BigInt(2),
    });

  console.log({ transferResult });
  useWaitForTransaction({
    hash: approveResult?.hash,
    confirmations: 1,
    onSuccess: async () => {
      try {
        invariant(decimals, "need decimals for token");
        const bnAmount = parseUnits(`${Number(config.amount)}`, decimals);

        const txResult = await transferAsync({
          args: [
            config.destinationChainId,
            config.recipientAddress,
            bnAmount,
            `0x`,
          ],
        });
        if (txResult?.hash) {
          config.onStatusUpdate?.({
            status: "submitted",
            hash: txResult.hash,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(`Transaction failed: ${error.cause.shortMessage}`);
          logger.error("Faied to transfer token:", error.cause);

          config.onStatusUpdate?.({
            status: "idle",
          });
          return;
        }

        if (error instanceof Error) {
          config.onStatusUpdate?.({
            status: "reverted",
            error: error,
          });
        } else {
          config.onStatusUpdate?.({
            status: "reverted",
            error: new Error("failed to transfer token"),
          });
        }

        return;
      }
    },
  });

  return useMutation<void, unknown, UseSendInterchainTokenInput>(async () => {
    if (!(decimals && address && gas)) {
      return;
    }

    const bnAmount = parseUnits(`${Number(config.amount)}`, decimals);

    try {
      config.onStatusUpdate?.({
        status: "awaiting_approval",
      });

      const txResult = await approveAsync({
        args: [tokenManagerAddress as `0x${string}`, bnAmount],
      });

      console.log("approval tx resultsss", txResult);
      if (txResult?.hash) {
        config.onStatusUpdate?.({
          status: "awaiting_approval", // update sending token status
          hash: txResult.hash,
        });
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(
          `Approval for transaction failed: ${error.cause.shortMessage}`
        );
        logger.error("Failed to approve token:", error.cause);

        config.onStatusUpdate?.({
          status: "idle",
        });
        return;
      }

      if (error instanceof Error) {
        config.onStatusUpdate?.({
          status: "reverted",
          error: error,
        });
      } else {
        config.onStatusUpdate?.({
          status: "reverted",
          error: new Error("failed to approve token"),
        });
      }

      return;
    }
  });
}
