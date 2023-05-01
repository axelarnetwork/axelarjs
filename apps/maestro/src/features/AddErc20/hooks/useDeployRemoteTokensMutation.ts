import { BigNumber } from "ethers";
import { Logger } from "ethers/lib/utils.js";
import {
  useAccount,
  useMutation,
  UserRejectedRequestError,
  useSigner,
} from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployRemoteTokenInput = {
  tokenId: `0x${string}`;
  tokenAddress: `0x${string}`;
  destinationChainIds: string[];
  gasFees: BigNumber[];
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useDeployRemoteTokensMutation() {
  const signer = useSigner();

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  return useMutation(async (input: UseDeployRemoteTokenInput) => {
    if (!(signer && tokenLinker && address)) {
      return;
    }

    try {
      //deploy remote tokens
      const value = input.gasFees.reduce((a, b) => a.add(b), BigNumber.from(0));
      const deployRemoteTokensTx = await tokenLinker.deployRemoteTokens(
        input.tokenId,
        input.destinationChainIds,
        input.gasFees,
        { value }
      );

      const txDone = await deployRemoteTokensTx.wait(1);

      if (input.onStatusUpdate) {
        input.onStatusUpdate({
          type: "deployed",
          txHash: txDone.transactionHash as `0x${string}`,
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
            throw new UserRejectedRequestError("User rejected the transaction");
          default:
            throw new Error("Transaction reverted by EVM");
        }
      }

      return;
    }
  });
}
