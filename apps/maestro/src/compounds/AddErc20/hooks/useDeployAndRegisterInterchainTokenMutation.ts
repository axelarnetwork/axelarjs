import { BigNumber, ethers } from "ethers";
import { useAccount, useMutation, useSigner } from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";
import { getTokenDeployedEventFromTxReceipt } from "~/utils/findContractEvent";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

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

export function useDeployAndRegisterInterchainTokenMutation() {
  // mutationInput: UseDeployAndRegisterInterchainTokenInput
  const signer = useSigner();

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  // const { config, error } = usePrepareContractWrite({
  //   address: String(
  //     process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
  //   ) as `0x${string}`,
  //   abi: InterchainTokenLinker.abi,
  //   functionName: "deployInterchainToken",
  //   args: [
  //     mutationInput.tokenName,
  //     mutationInput.tokenSymbol,
  //     mutationInput.decimals,
  //     address as `0x${string}`,
  //     ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32) as `0x${string}`,
  //     mutationInput.destinationChainIds,
  //     mutationInput.gasFees,
  //   ],
  // });

  // const { writeAsync } = useContractWrite(config);

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
        const salt = ethers.utils.hexZeroPad(
          ethers.utils.hexlify(0),
          32
        ) as `0x${string}`;
        console.log("deploying contract", signer, tokenLinker);
        console.log(
          "params",
          tokenName,
          tokenSymbol,
          decimals,
          address,
          salt,
          destinationChainIds,
          gasFees
        );
        // const deployAndRegisterTokensTx = await writeAsync();
        const value = gasFees.reduce(
          (a, b) => a.add(BigNumber.from(b)),
          BigNumber.from(0)
        );
        const deployAndRegisterTokensTx =
          await tokenLinker.deployInterchainToken(
            tokenName,
            tokenSymbol,
            decimals,
            BigNumber.from("1000000000000000000000000"),
            address,
            salt,
            destinationChainIds,
            gasFees,
            { value }
          );

        if (onStatusUpdate)
          onStatusUpdate({
            type: "deploying",
            txHash: deployAndRegisterTokensTx.hash,
          });

        const deployAndRegisterTokensTxDone =
          await deployAndRegisterTokensTx.wait(1);
        console.log(
          "deployAndRegisterTokensTxDone",
          deployAndRegisterTokensTxDone
        );

        const deployedTokenAddress = getTokenDeployedEventFromTxReceipt(
          deployAndRegisterTokensTxDone
        );
        console.log("deployedTokenAddress", deployedTokenAddress);

        if (onFinished) onFinished();
      } catch (e) {
        console.log("something went wrong", e);
        if (onStatusUpdate) onStatusUpdate({ type: "idle" });
        return;
      }
    }
  );
}
