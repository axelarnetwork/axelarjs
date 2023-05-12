import { Logger } from "ethers/lib/utils";
import { useAccount, useMutation, useWalletClient } from "wagmi";

import {
  useInterchainTokenServiceDeployInterchainToken,
  useInterchainTokenServiceDeployRemoteTokens,
  useInterchainTokenServiceWrites,
} from "~/lib/contract/hooks/useInterchainTokenService";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

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
    gas,
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
