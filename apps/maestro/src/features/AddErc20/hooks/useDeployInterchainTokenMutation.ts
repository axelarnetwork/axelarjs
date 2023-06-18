import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";

import {
  ContractFunctionRevertedError,
  TransactionExecutionError,
  UserRejectedRequestError,
} from "viem";
import {
  useAccount,
  useMutation,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { watchContractEvent } from "wagmi/actions";

import { useInterchainTokenServiceDeployInterchainToken } from "~/lib/contract/hooks/useInterchainTokenService";
import { hexlify, hexZeroPad } from "~/lib/utils/hex";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

const INTERCHAIN_TOKEN_SERVICE_ADDRESS = String(
  process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
) as `0x${string}`;

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: bigint[];
};

export function useDeployInterchainTokenMutation(config: {
  value: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const signer = useWalletClient();

  const { address } = useAccount();

  const {
    writeAsync: deployInterchainTokenAsync,
    data: deployInterchainTokenResult,
  } = useInterchainTokenServiceDeployInterchainToken({
    address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
    value: config.value,
  });

  let currentInput: UseDeployAndRegisterInterchainTokenInput = {
    sourceChainId: "",
    tokenName: "",
    tokenSymbol: "",
    decimals: 0,
    destinationChainIds: [],
    gasFees: [],
  };

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const unwatch = watchContractEvent(
    {
      address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
      eventName: "TokenDeployed",
      abi: INTERCHAIN_TOKEN_SERVICE_ABI,
    },
    (logs) => {
      const log = logs.find(
        (log) =>
          Boolean(log.args?.tokenAddress) &&
          log?.args.decimals === currentInput.decimals &&
          log?.args.name === currentInput.tokenName &&
          log?.args.symbol === currentInput.tokenSymbol &&
          log?.args.owner === address
      );

      if (!log) {
        return;
      }

      unwatch();

      onStatusUpdate({
        type: "deployed",
        tokenAddress: log.args?.tokenAddress as `0x${string}`,
        txHash: deployInterchainTokenResult?.hash as `0x${string}`,
      });
    }
  );

  useWaitForTransaction({
    hash: deployInterchainTokenResult?.hash,
    confirmations: 10,
    onSuccess() {
      if (!deployInterchainTokenResult) {
        return;
      }
      config.onFinished?.();
    },
  });

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!(signer && address)) {
        return;
      }

      currentInput = input;

      try {
        //deploy and register tokens
        const salt = hexZeroPad(
          hexlify(Math.floor(Math.random() * 1_000_000_000)),
          32
        ) as `0x${string}`;

        onStatusUpdate({
          type: "pending_approval",
        });

        const tx = await deployInterchainTokenAsync({
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

        onStatusUpdate({
          type: "deploying",
          txHash: tx.hash,
        });
      } catch (e) {
        onStatusUpdate({ type: "idle" });

        if (e instanceof TransactionExecutionError) {
          throw e;
        }
        if (e instanceof UserRejectedRequestError) {
          throw new Error("User rejected the transaction");
        }

        if (e instanceof ContractFunctionRevertedError) {
          throw new Error("Transaction reverted by EVM");
        }

        return;
      }
    }
  );
}
