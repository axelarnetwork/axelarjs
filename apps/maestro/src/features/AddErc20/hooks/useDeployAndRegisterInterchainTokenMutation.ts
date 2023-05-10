import { BigNumber } from "@ethersproject/bignumber";
import { hexlify, hexZeroPad, Logger } from "ethers/lib/utils";
import {
  useAccount,
  useMutation,
  UserRejectedRequestError,
  useSigner,
} from "wagmi";

import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";
import { getTokenDeployedEventFromTxReceipt } from "~/lib/utils/findContractEvent";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: BigNumber[];
  amountToMint?: BigNumber;
  onFinished?: () => void;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
};

export function useDeployAndRegisterInterchainTokenMutation() {
  const signer = useSigner();

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!(signer && tokenLinker && address)) {
        return;
      }

      try {
        //deploy and register tokens
        const salt = hexZeroPad(hexlify(0), 32) as `0x${string}`;
        const value = input.gasFees.reduce(
          (a, b) => a.add(BigNumber.from(b)),
          BigNumber.from(0)
        );
        const deployAndRegisterTokensTx =
          await tokenLinker.deployInterchainToken(
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            input.amountToMint || BigNumber.from(0),
            address,
            salt,
            input.destinationChainIds,
            input.gasFees,
            { value }
          );

        const txDone = await deployAndRegisterTokensTx.wait(1);

        if (input.onStatusUpdate) {
          input.onStatusUpdate({
            type: "deployed",
            txHash: txDone.transactionHash as `0x${string}`,
            tokenAddress: getTokenDeployedEventFromTxReceipt(
              txDone
            ) as `0x${string}`,
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
              throw new UserRejectedRequestError(
                "User rejected the transaction"
              );
            default:
              throw new Error("Transaction reverted by EVM");
          }
        }

        return;
      }
    }
  );
}
