import { hexlify, hexZeroPad, Logger } from "ethers/lib/utils";
import {
  useAccount,
  useMutation,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";

import { useInterchainTokenServiceDeployInterchainToken } from "~/lib/contract/hooks/useInterchainTokenService";
import { getTokenDeployedEventFromTxReceipt } from "~/lib/utils/findContractEvent";

import { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: bigint[];
};

export function useDeployInterchainTokenMutation(config: {
  gas: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const signer = useWalletClient();

  const { address } = useAccount();

  const {
    writeAsync: deployInterchainTokenAsync,
    data: deployInterchainTokenResult,
  } = useInterchainTokenServiceDeployInterchainToken({
    address: String(
      process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
    ) as `0x${string}`,
    gas: config.gas,
  });

  useWaitForTransaction({
    hash: deployInterchainTokenResult?.hash,
    onSuccess(receipt) {
      if (!deployInterchainTokenResult) {
        return;
      }

      if (config.onStatusUpdate) {
        config.onStatusUpdate({
          type: "deployed",
          txHash: deployInterchainTokenResult.hash,
          tokenAddress: getTokenDeployedEventFromTxReceipt(
            receipt
          ) as `0x${string}`,
        });
      }
    },
  });

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!(signer && address)) {
        return;
      }

      try {
        //deploy and register tokens
        const salt = hexZeroPad(hexlify(0), 32) as `0x${string}`;

        await deployInterchainTokenAsync({
          args: [
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            address,
            salt,
            input.destinationChainIds,
            input.gasFees,
          ],
        });

        if (config.onFinished) {
          config.onFinished();
        }
      } catch (e) {
        if (config.onStatusUpdate) {
          config.onStatusUpdate({ type: "idle" });
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
    }
  );
}
