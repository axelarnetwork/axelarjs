import { BigNumber } from "ethers";
import { hexlify, hexZeroPad } from "ethers/lib/utils";
import { useAccount, useMutation, useSigner } from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";
import { getTokenDeployedEventFromTxReceipt } from "~/lib/utils/findContractEvent";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployRemoteTokenInput = {
  tokenId: `0x${string}`;
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
    if (!(signer && tokenLinker && address)) return;

    try {
      //deploy and register tokens
      const salt = hexZeroPad(hexlify(0), 32) as `0x${string}`;
      const value = input.gasFees.reduce(
        (a, b) => a.add(BigNumber.from(b)),
        BigNumber.from(0)
      );
      const deployRemoteTokensTx = await tokenLinker.deployRemoteTokens(
        input.tokenId,
        input.destinationChainIds,
        input.gasFees,
        { value }
      );

      const txDone = await deployRemoteTokensTx.wait(1);
      console.log("deployRemoteTokensTxDone", txDone);

      if (input.onStatusUpdate)
        input.onStatusUpdate({
          type: "deployed",
          txHash: txDone.transactionHash as `0x${string}`,
          tokenAddress: "0x", //todo
        });

      if (input.onFinished) input.onFinished();
    } catch (e) {
      console.log("something went wrong", e);
      if (input.onStatusUpdate) input.onStatusUpdate({ type: "idle" });
      return;
    }
  });
}
