import { useRef, useState } from "react";

import { InterchainTokenServiceClient } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { hexlify, hexZeroPad, Logger } from "ethers/lib/utils";
import {
  useAccount,
  useMutation,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { watchContractEvent } from "wagmi/actions";

import { useInterchainTokenServiceDeployInterchainToken } from "~/lib/contract/hooks/useInterchainTokenService";

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

  const [input, setInput] = useState<UseDeployAndRegisterInterchainTokenInput>({
    sourceChainId: "",
    tokenName: "",
    tokenSymbol: "",
    decimals: 0,
    destinationChainIds: [],
    gasFees: [],
  });

  const deployedRef = useRef(false);

  const unwatch = watchContractEvent(
    {
      address: String(
        process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
      ) as `0x${string}`,
      eventName: "TokenDeployed",
      abi: InterchainTokenServiceClient.ABI,
    },
    (logs) => {
      const log = logs.find(
        (log) =>
          Boolean(log.args?.tokenAddress) &&
          log?.args.decimals === input.decimals &&
          log?.args.name === input.tokenName &&
          log?.args.symbol === input.tokenSymbol &&
          log?.args.owner === address
      );

      if (!log || deployedRef.current) {
        return;
      }

      unwatch();

      deployedRef.current = true;

      console.log("onStatusUpdate", {
        type: "deployed",
        tokenAddress: log.args?.tokenAddress as `0x${string}`,
        txHash: deployInterchainTokenResult?.hash as `0x${string}`,
      });

      config.onStatusUpdate?.({
        type: "deployed",
        tokenAddress: log.args?.tokenAddress as `0x${string}`,
        txHash: deployInterchainTokenResult?.hash as `0x${string}`,
      });
    }
  );

  useWaitForTransaction({
    hash: deployInterchainTokenResult?.hash,
    onSuccess(receipt) {
      if (!deployInterchainTokenResult) {
        return;
      }

      console.log("onSuccess", { receipt });

      toast.success("Token deployed");
    },
  });

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!(signer && address)) {
        return;
      }

      setInput(input);

      try {
        //deploy and register tokens
        const salt = hexZeroPad(
          hexlify(Math.floor(Math.random() * 1_000_000_000)),
          32
        ) as `0x${string}`;

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
