import { useAccount, useMutation, useSigner } from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseRegisterInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useRegisterOriginTokenMutation() {
  const signer = useSigner();

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  return useMutation(async (input: UseRegisterInterchainTokenInput) => {
    if (!(signer && tokenLinker && address)) return;

    try {
      //register tokens
      const registerTokensTx = await tokenLinker.registerOriginToken(
        input.tokenAddress
      );

      const txDone = await registerTokensTx.wait(1);
      console.log("txDone", txDone);

      if (input.onStatusUpdate)
        input.onStatusUpdate({
          type: "deployed",
          txHash: txDone.transactionHash as `0x${string}`,
          tokenAddress: input.tokenAddress,
        });

      if (input.onFinished) input.onFinished();
    } catch (e) {
      console.log("something went wrong", e);
      if (input.onStatusUpdate) input.onStatusUpdate({ type: "idle" });
      return;
    }
  });
}
