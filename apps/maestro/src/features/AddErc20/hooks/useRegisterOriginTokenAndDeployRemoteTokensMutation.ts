import { toast } from "@axelarjs/ui";

import { TransactionExecutionError } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";
import { logger } from "~/lib/logger";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseRegisterInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  destinationChainIds: string[];
  gasFees: bigint[];
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useRegisterOriginTokenAndDeployRemoteTokensMutation() {
  const signer = useWalletClient();

  const { address } = useAccount();

  const interchainTokenService = useInterchainTokenServiceWrites({
    address: String(
      process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
    ) as `0x${string}`,
  });

  return useMutation(async (input: UseRegisterInterchainTokenInput) => {
    if (!(signer && interchainTokenService && address)) {
      return;
    }

    try {
      //register tokens

      const value = input.gasFees.reduce((a, b) => a + b);
      const txHash =
        await interchainTokenService.registerOriginTokenAndDeployRemoteTokens(
          [input.tokenAddress, input.destinationChainIds, input.gasFees],
          { value }
        );

      input.onStatusUpdate?.({
        type: "deployed",
        txHash: txHash,
        tokenAddress: input.tokenAddress,
      });

      input.onFinished?.();
    } catch (error) {
      input.onStatusUpdate?.({ type: "idle" });

      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction failed: ${error.cause.shortMessage}`);
        logger.error(
          "Faied to register originToken and deploy RemoteTokens:",
          error.cause
        );
      }

      return;
    }
  });
}
