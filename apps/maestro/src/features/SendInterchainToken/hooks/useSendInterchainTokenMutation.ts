import { toast } from "@axelarjs/ui";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useERC20Reads } from "~/lib/contract/hooks/useERC20";
import { useTransferInterchainToken } from "~/lib/contract/hooks/useInterchainToken";
import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";
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

const TOKEN_LINKER_ADDRESS = String(
  process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
) as `0x${string}`;

export function useSendInterchainTokenMutation(
  config: UseSendInterchainTokenConfig
) {
  const { data: walletClient } = useWalletClient();
  const erc20Reads = useERC20Reads({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenServiceWrites({
    address: TOKEN_LINKER_ADDRESS,
    walletClient,
  });

  const { data: gas } = trpc.axelarjsSDK.estimateGasFee.useQuery({
    sourceChainId: config.sourceChainId,
    destinationChainId: config.destinationChainId,
    sourceChainTokenSymbol: getNativeToken(config.sourceChainId.toLowerCase()),
  });

  const { writeAsync: transferAsync } = useTransferInterchainToken({
    address: config.tokenAddress,
    value: BigInt(gas ?? 0) * BigInt(2),
  });

  return useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount, onStatusUpdate }) => {
      if (!(erc20Reads && address && tokenLinker && gas)) {
        return;
      }

      const decimals = await erc20Reads.decimals();
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
