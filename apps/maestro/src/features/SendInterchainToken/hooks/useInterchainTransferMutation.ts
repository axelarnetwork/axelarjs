import { toast } from "@axelarjs/ui/toast";

import { parseUnits, TransactionExecutionError } from "viem";
import { useAccount, useMutation } from "wagmi";

import { useIerc20BurnableMintableDecimals } from "~/lib/contracts/IERC20BurnableMintable.hooks";
import { useInterchainTokenInterchainTransfer } from "~/lib/contracts/InterchainToken.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeQuery } from "~/services/axelarjsSDK/hooks";

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  sourceChainId: string;
  destinationChainId: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
};

export function useInterchainTransferMutation(
  config: UseSendInterchainTokenConfig
) {
  const [txState, setTxState] = useTransactionState();
  const { data: decimals } = useIerc20BurnableMintableDecimals({
    address: config.tokenAddress,
  });

  const { address } = useAccount();

  const { data: gas } = useEstimateGasFeeQuery({
    sourceChainId: config.sourceChainId,
    destinationChainId: config.destinationChainId,
    sourceChainTokenSymbol: getNativeToken(config.sourceChainId.toLowerCase()),
  });

  const { writeAsync: transferAsync } = useInterchainTokenInterchainTransfer({
    address: config.tokenAddress,
    value: BigInt(gas ?? 0) * BigInt(2),
  });

  const mutation = useMutation<void, unknown, UseSendInterchainTokenInput>(
    async ({ amount }) => {
      if (!(decimals && address && gas)) {
        return;
      }

      const bnAmount = parseUnits(`${Number(amount)}`, decimals);

      try {
        setTxState({
          status: "awaiting_approval",
        });

        const txResult = await transferAsync({
          args: [config.destinationChainId, address, bnAmount, `0x`],
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
