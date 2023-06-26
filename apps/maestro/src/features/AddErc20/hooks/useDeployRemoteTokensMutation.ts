import { toast } from "@axelarjs/ui";

import { TransactionExecutionError } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useInterchainTokenServiceDeployRemoteTokens } from "~/lib/contract/hooks/useInterchainTokenService";
import { logger } from "~/lib/logger";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployRemoteTokenInput = {
  tokenId: `0x${string}`;
  tokenAddress: `0x${string}`;
  destinationChainIds: string[];
  gasFees: bigint[];
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useDeployRemoteTokensMutation(gas: bigint) {
  const signer = useWalletClient();

  const { address } = useAccount();

  const { writeAsync } = useInterchainTokenServiceDeployRemoteTokens({
    address: String(
      process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
    ) as `0x${string}`,
    value: gas,
  });

  return useMutation(async (input: UseDeployRemoteTokenInput) => {
    if (!(signer && address)) {
      return;
    }

    try {
      //deploy remote tokens
      const deployRemoteTokensTx = await writeAsync({
        args: [input.tokenId, input.destinationChainIds, input.gasFees],
      });

      if (input.onStatusUpdate) {
        input.onStatusUpdate({
          type: "deployed",
          txHash: deployRemoteTokensTx.hash,
          tokenAddress: input.tokenAddress,
        });
      }

      if (input.onFinished) {
        input.onFinished();
      }
    } catch (error) {
      input.onStatusUpdate?.({ type: "idle" });

      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction failed: ${error.cause.shortMessage}`);

        logger.error("Faied to accept token ownership:", error.cause);
      }

      return;
    }
  });
}
