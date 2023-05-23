import { parseUnits } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useERC20Approve, useERC20Reads } from "~/lib/contract/hooks/useERC20";
import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";

export type TransactionState =
  | { type: "idle" }
  | { type: "failed"; error: Error }
  | { type: "awaiting_approval" }
  | { type: "awaiting_confirmation"; txHash: `0x${string}` }
  | { type: "minting"; txHash: `0x${string}` }
  | { type: "confirmed"; txHash: `0x${string}` };

export type UseMintInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseMintInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  amount: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
};

const TOKEN_LINKER_ADDRESS = String(
  process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
) as `0x${string}`;

export function useMintInterchainTokensMutation(
  config: UseMintInterchainTokenConfig
) {
  const { data: walletClient } = useWalletClient();
  const erc20Reads = useERC20Reads({
    address: config.tokenAddress,
  });

  const { writeAsync: approveERC20Spend } = useERC20Approve({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const tokenService = useInterchainTokenServiceWrites({
    address: TOKEN_LINKER_ADDRESS,
    walletClient,
  });

  const { data: gas } = trpc.axelarjsSDK.estimateGasFee.useQuery({
    sourceChainId: config.sourceChainId,
    destinationChainId: config.destinationChainId,
    sourceChainTokenSymbol: getNativeToken(config.sourceChainId.toLowerCase()),
  });

  return useMutation(async (input: UseMintInterchainTokenInput) => {
    if (!(erc20Reads && address && tokenService && gas)) {
      return;
    }

    const { onFinished, onStatusUpdate } = input;

    const decimals = await erc20Reads.decimals();
    const bnAmount = parseUnits(`${Number(input.amount)}`, decimals);

    //approve
    try {
      onStatusUpdate?.({
        type: "awaiting_approval",
      });

      const tx = await approveERC20Spend({
        args: [TOKEN_LINKER_ADDRESS, bnAmount],
      });

      onStatusUpdate?.({
        type: "confirmed",
        txHash: tx.hash,
      });
    } catch (e) {
      if (e instanceof Error) {
        onStatusUpdate?.({ type: "failed", error: e });
      } else {
        onStatusUpdate?.({
          type: "failed",
          error: new Error("failed to approve token spend amount"),
        });
      }

      return;
    }

    try {
      //send token
      const sendTokenTxHash = await tokenService.sendToken(
        [input.tokenId, config.destinationChainId, address, bnAmount],
        { value: BigInt(gas) * BigInt(2) }
      );

      onStatusUpdate?.({
        type: "minting",
        txHash: sendTokenTxHash,
      });

      if (onFinished) {
        onFinished();
      }
    } catch (e) {
      if (e instanceof Error) {
        onStatusUpdate?.({ type: "failed", error: e });
      } else {
        onStatusUpdate?.({
          type: "failed",
          error: new Error("Failed to send token"),
        });
      }

      return;
    }
  });
}
