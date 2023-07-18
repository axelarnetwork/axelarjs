import { toast } from "@axelarjs/ui";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation } from "wagmi";

import {
  useIerc20BurnableMintableApprove,
  useIerc20BurnableMintableDecimals,
} from "~/lib/contracts/IERC20BurnableMintable.hooks";
import { useInterchainTokenServiceGetTokenManagerAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import { useTokenManagerSendToken } from "~/lib/contracts/TokenManager.hooks";
import type { TransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
};

export function useTokenManagerSendTokenMutation(
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

  const { data: tokenManagerAddress } =
    useInterchainTokenServiceGetTokenManagerAddress({
      args: [config.tokenId],
      enabled: Boolean(config.tokenId),
    });

  const { writeAsync: ierc20ApproveAsync } = useIerc20BurnableMintableApprove({
    address: config.tokenAddress,
  });

  const { writeAsync: tokenManagerSendToken } = useTokenManagerSendToken({
    address: tokenManagerAddress,
    value: BigInt(gas ?? 0) * BigInt(2),
  });

  return useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount, onStatusUpdate }) => {
      if (!tokenManagerAddress) {
        console.warn("need token maanger address");
        return;
      }
      if (!(decimals && address && gas)) {
        return;
      }

      const bnAmount = parseUnits(`${Number(amount)}`, decimals);

      try {
        onStatusUpdate?.({
          status: "awaiting_approval",
        });

        const txResult = await ierc20ApproveAsync({
          args: [tokenManagerAddress, bnAmount],
        });
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(
            `Approval transaction failed: ${error.cause.shortMessage}`
          );
          logger.error("Failed to approve token transfer:", error.cause);

          onStatusUpdate?.({
            status: "idle",
          });
          return;
        }
      }

      try {
        onStatusUpdate?.({
          status: "awaiting_approval",
        });
        debugger;

        const txResult = await tokenManagerSendToken({
          args: [config.destinationChainId, address, bnAmount, `0x`],
        });
        if (txResult?.hash) {
          onStatusUpdate?.({
            status: "submitted",
            hash: txResult.hash,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(`Transaction failed: ${error.cause.shortMessage}`);
          logger.error("Faied to transfer token:", error.cause);

          onStatusUpdate?.({
            status: "idle",
          });
          return;
        }

        if (error instanceof Error) {
          onStatusUpdate?.({
            status: "reverted",
            error: error,
          });
        } else {
          onStatusUpdate?.({
            status: "reverted",
            error: new Error("failed to transfer token"),
          });
        }

        return;
      }
    }
  );
}
