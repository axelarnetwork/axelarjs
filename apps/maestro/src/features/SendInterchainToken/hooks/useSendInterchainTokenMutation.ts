import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
import { parseUnits } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useERC20Approve, useERC20Reads } from "~/lib/contract/hooks/useERC20";
import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";
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
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  toNetwork: string;
  fromNetwork: string;
  amount: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
};

const AXELAR_QUERY_API = new AxelarQueryAPI({
  environment: process.env.NEXT_PUBLIC_NETWORK_ENV as Environment,
});

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

  const { writeAsync: approveERC20Spend } = useERC20Approve({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenServiceWrites({
    address: TOKEN_LINKER_ADDRESS,
    walletClient,
  });

  return useMutation(async (input: UseSendInterchainTokenInput) => {
    if (!(erc20Reads && address && tokenLinker)) {
      return;
    }

    const { toNetwork, fromNetwork, onFinished, onStatusUpdate } = input;

    const decimals = await erc20Reads.decimals();
    const bnAmount = parseUnits(`${Number(input.amount)}`, decimals);

    const gas = await AXELAR_QUERY_API.estimateGasFee(
      fromNetwork,
      toNetwork,
      getNativeToken(fromNetwork.toLowerCase())
    );

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
      const sendTokenTxHash = await tokenLinker.sendToken(
        [input.tokenId, input.toNetwork, address, bnAmount],
        { value: BigInt(gas) * BigInt(2) }
      );

      onStatusUpdate?.({
        type: "sending",
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
