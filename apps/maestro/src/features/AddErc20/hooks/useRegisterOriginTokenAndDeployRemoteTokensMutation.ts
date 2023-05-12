import { ContractFunctionRevertedError, UserRejectedRequestError } from "viem";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import { useInterchainTokenServiceWrites } from "~/lib/contract/hooks/useInterchainTokenService";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

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

  const tokenLinker = useInterchainTokenServiceWrites({
    address: String(
      process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
    ) as `0x${string}`,
  });

  return useMutation(async (input: UseRegisterInterchainTokenInput) => {
    if (!(signer && tokenLinker && address)) {
      return;
    }

    try {
      //register tokens

      const value = input.gasFees.reduce((a, b) => a + b);
      const txHash = await tokenLinker.registerOriginTokenAndDeployRemoteTokens(
        [input.tokenAddress, input.destinationChainIds, input.gasFees],
        { value }
      );

      input.onStatusUpdate?.({
        type: "deployed",
        txHash: txHash,
        tokenAddress: input.tokenAddress,
      });

      input.onFinished?.();
    } catch (e) {
      input.onStatusUpdate?.({ type: "idle" });
      if (e instanceof UserRejectedRequestError) {
        throw new Error("User rejected the transaction");
      }
      if (e instanceof ContractFunctionRevertedError) {
        throw new Error("Transaction reverted by EVM");
      }

      return;
    }
  });
}
