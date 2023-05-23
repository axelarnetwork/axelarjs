import { parseUnits } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useERC20Reads } from "~/lib/contract/hooks/useERC20";
import { useTransferInterchainToken } from "~/lib/contract/hooks/useInterchainToken";
import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";

export type TransactionState =
  | { type: "idle" }
  | { type: "failed"; error: Error }
  | { type: "awaiting_approval" }
  | { type: "awaiting_confirmation"; txHash: `0x${string}` }
  | { type: "sending"; txHash: `0x${string}` }
  | { type: "confirmed"; txHash: `0x${string}` };

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
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
    async ({ amount, tokenId, onStatusUpdate }) => {
      if (!(erc20Reads && address && tokenLinker && gas)) {
        return;
      }

      const decimals = await erc20Reads.decimals();
      const bnAmount = parseUnits(`${Number(amount)}`, decimals);

      try {
        onStatusUpdate?.({
          type: "awaiting_approval",
        });

        const tx = await transferAsync({
          args: [config.destinationChainId, address, bnAmount, tokenId],
        });

        onStatusUpdate?.({
          type: "sending",
          txHash: tx.hash,
        });
      } catch (e) {
        if (e instanceof Error) {
          onStatusUpdate?.({ type: "failed", error: e });
        } else {
          onStatusUpdate?.({
            type: "failed",
            error: new Error("failed to transfer token"),
          });
        }

        return;
      }
    }
  );
}
