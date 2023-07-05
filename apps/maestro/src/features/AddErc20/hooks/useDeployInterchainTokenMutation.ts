import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { throttle } from "@axelarjs/utils";
import { useMemo } from "react";

import { TransactionExecutionError } from "viem";
import {
  useAccount,
  useMutation,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { watchContractEvent } from "wagmi/actions";

import {
  useInterchainTokenServiceDeployAndRegisterStandardizedToken,
  // useInterchainTokenServiceGetCustomTokenId,
  // useInterchainTokenServiceGetStandardizedTokenAddress,
  // useInterchainTokenServiceGetTokenManagerAddress,
  // useInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { logger } from "~/lib/logger";
import { hexlify, hexZeroPad } from "~/lib/utils/hex";
// import { isValidEVMAddress } from "~/lib/utils/isValidEVMAddress";
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
  cap?: bigint;
  mintTo?: `0x${string}`;
};

export function useDeployInterchainTokenMutation(config: {
  value: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const signer = useWalletClient();

  const { address } = useAccount();

  const salt = useMemo(
    () =>
      hexZeroPad(
        hexlify(Math.floor(Math.random() * 1_000_000_000)),
        32
      ) as `0x${string}`,
    []
  );

  // const { data: tokenId } = useInterchainTokenServiceGetCustomTokenId({
  //   args: [address as `0x${string}`, salt],
  //   enabled: address && isValidEVMAddress(address),
  // });

  // const { data: tokenAddress } =
  //   useInterchainTokenServiceGetStandardizedTokenAddress({
  //     args: [tokenId as `0x${string}`],
  //     enabled: Boolean(tokenId),
  //   });

  // const { data: tokenManagerAddress } =
  //   useInterchainTokenServiceGetTokenManagerAddress({
  //     enabled: Boolean(tokenId),
  //   });

  const { writeAsync: deplyAndRegisterAsync, data: deployAndRegisterResult } =
    useInterchainTokenServiceDeployAndRegisterStandardizedToken({
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
    cap: BigInt(0),
    mintTo: `0x000`,
  };

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const unwatch = watchContractEvent(
    {
      address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
      eventName: "StandardizedTokenDeployed",
      abi: INTERCHAIN_TOKEN_SERVICE_ABI,
    },
    (logs) => {
      const log = logs.find(
        (log) =>
          Boolean(log.args?.tokenId) &&
          log?.args.decimals === currentInput.decimals &&
          log?.args.name === currentInput.tokenName &&
          log?.args.symbol === currentInput.tokenSymbol &&
          log?.args.mintTo === address
      );

      if (!log) {
        return;
      }

      unwatch();

      const tokenAddress = `0x${log.args?.tokenId}`;

      onStatusUpdate({
        type: "deployed",
        tokenAddress: tokenAddress as `0x${string}`,
        txHash: deployAndRegisterResult?.hash as `0x${string}`,
      });
    }
  );

  useWaitForTransaction({
    hash: deployAndRegisterResult?.hash,
    confirmations: 8,
    onSuccess() {
      if (!deployAndRegisterResult) {
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

      onStatusUpdate({
        type: "pending_approval",
      });
      try {
        const tx = await deplyAndRegisterAsync({
          args: [
            salt,
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            input.cap ?? BigInt(0),
            input.mintTo ?? address,
          ],
        });
        if (tx?.hash) {
          onStatusUpdate({
            type: "deploying",
            txHash: tx.hash,
          });
        }
      } catch (error) {
        onStatusUpdate({
          type: "idle",
        });
        if (error instanceof TransactionExecutionError) {
          toast.error(`Transaction failed: ${error.cause.shortMessage}`);

          logger.error("Failed to deploy interchain token", error.cause);
        }
      }
    }
  );
}
