import { BigNumber, constants } from "ethers";
import { useAccount, useMutation, useSigner } from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployAndRegisterInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
};

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: BigNumber[];
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useDeployAndRegisterInterchainTokenMutation(
  config: UseDeployAndRegisterInterchainTokenConfig
) {
  const signer = useSigner();

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!signer || !tokenLinker || !address) return;

      const {
        tokenName,
        tokenSymbol,
        decimals,
        destinationChainIds,
        gasFees,
        onFinished,
        onStatusUpdate,
      } = input;

      try {
        //deploy and register tokens
        const deployAndRegisterTokensTx =
          await tokenLinker.deployInterchainToken(
            tokenName,
            tokenSymbol,
            decimals,
            address,
            constants.AddressZero,
            destinationChainIds,
            gasFees
          );

        if (onStatusUpdate)
          onStatusUpdate({
            type: "deploying",
            txHash: deployAndRegisterTokensTx.hash,
          });

        await deployAndRegisterTokensTx.wait(1);

        if (onFinished) onFinished();
      } catch (e) {
        if (onStatusUpdate) onStatusUpdate({ type: "idle" });
        return;
      }
    }
  );
}
