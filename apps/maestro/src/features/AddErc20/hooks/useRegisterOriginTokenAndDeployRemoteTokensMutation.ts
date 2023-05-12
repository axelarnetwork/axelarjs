import { Logger } from "ethers/lib/utils";
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

      const value = input.gasFees.reduce((a, b) => a + b, BigInt(0));
      const txHash = await tokenLinker.registerOriginTokenAndDeployRemoteTokens(
        [input.tokenAddress, input.destinationChainIds, input.gasFees],
        { value }
      );

      if (input.onStatusUpdate) {
        input.onStatusUpdate({
          type: "deployed",
          txHash: txHash,
          tokenAddress: input.tokenAddress,
        });
      }

      if (input.onFinished) {
        input.onFinished();
      }
    } catch (e) {
      if (input.onStatusUpdate) {
        input.onStatusUpdate({ type: "idle" });
      }
      if (e instanceof Error && "code" in e) {
        switch (e.code) {
          case Logger.errors.ACTION_REJECTED:
            throw new Error("User rejected the transaction");
          default:
            throw new Error("Transaction reverted by EVM");
        }
      }

      return;
    }
  });
}
