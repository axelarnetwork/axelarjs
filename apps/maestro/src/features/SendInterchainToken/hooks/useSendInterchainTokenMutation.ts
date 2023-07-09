import { toast } from "@axelarjs/ui";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation } from "wagmi";

import { useIerc20BurnableMintableDecimals } from "~/lib/contracts/IERC20BurnableMintable.hooks";
import { useInterchainTokenInterchainTransfer } from "~/lib/contracts/InterchainToken.hooks";
import type { TransactionState } from "~/lib/hooks/useTransaction";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
};

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

  const { writeAsync: transferAsync } = useInterchainTokenInterchainTransfer({
    address: config.tokenAddress,
    value: BigInt(gas ?? 0) * BigInt(2),
  });

  return useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount, onStatusUpdate }) => {
      if (!(decimals && address && gas)) {
        return;
      }

      const bnAmount = parseUnits(`${Number(amount)}`, decimals);

      try {
        onStatusUpdate?.({
          status: "awaiting_approval",
        });

        const txResult = await transferAsync({
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
