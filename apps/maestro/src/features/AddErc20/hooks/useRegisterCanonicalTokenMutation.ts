import { encodeInterchainTokenServiceRegisterCanonicalTokenData } from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";

import { useChainId, useWaitForTransaction } from "wagmi";

import {
  useInterchainTokenServiceMulticall,
  usePrepareInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { trpc } from "~/lib/trpc";
import type { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseRegisterCanonicalTokenInput = {
  sourceChainId: string;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  expectedTokenId: `0x${string}`;
};

export type UseRegisterCanonicalTokenConfig = {
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
};

export function useRegisterCanonicalTokenMutation(
  config: UseRegisterCanonicalTokenConfig,
  input: UseRegisterCanonicalTokenInput
) {
  const chainId = useChainId();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput | null>(null);

  const multicallArgs = useMemo(
    () => [
      encodeInterchainTokenServiceRegisterCanonicalTokenData({
        tokenAddress: input.tokenAddress,
      }),
    ],
    [input.tokenAddress]
  );

  const prepared = usePrepareInterchainTokenServiceMulticall({
    args: [multicallArgs],
  });

  const multicall = useInterchainTokenServiceMulticall(prepared.config);

  useWaitForTransaction({
    hash: multicall.data?.hash,
    confirmations: 8,
    onSuccess() {
      if (!multicall.data) {
        return;
      }

      setRecordDeploymentArgs({
        kind: "canonical",
        tokenId: input.expectedTokenId,
        tokenAddress: input.tokenAddress,
        chainId: chainId,
        deploymentTxHash: multicall.data.hash,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        remoteTokens: [],
      });

      config.onFinished?.();
    },
  });

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        recordDeploymentAsync(recordDeploymentArgs)
          .then(() => {
            onStatusUpdate({
              type: "deployed",
              tokenAddress: recordDeploymentArgs.tokenAddress,
              txHash: recordDeploymentArgs.deploymentTxHash,
            });
          })
          .catch(() => {
            onStatusUpdate({
              type: "idle",
            });
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordDeploymentArgs]
  );

  return multicall;
}
