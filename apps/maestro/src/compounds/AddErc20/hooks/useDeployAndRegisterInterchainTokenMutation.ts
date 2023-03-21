import { GasToken } from "@axelar-network/axelarjs-sdk";
import { constants } from "ethers";
import { useAccount, useMutation, useSigner } from "wagmi";

import { useEstimateGasFeeMultipleChains } from "~/lib/api/axelarjsSDK/hooks";
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
        sourceChainId,
        tokenName,
        tokenSymbol,
        decimals,
        destinationChainIds,
        onFinished,
        onStatusUpdate,
      } = input;

      const gasFees = useEstimateGasFeeMultipleChains({
        sourceChainId,
        destinationChainIds,
        sourceChainTokenSymbol: GasToken.ETH,
        gasMultipler: 1.5,
      });
      if (!gasFees?.data) return;
      console.log("gas fees", gasFees);

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
            gasFees.data
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
