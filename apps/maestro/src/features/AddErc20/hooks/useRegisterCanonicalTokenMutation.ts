import { encodeInterchainTokenServiceRegisterCanonicalTokenData } from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { useNetwork, useWaitForTransaction } from "wagmi";

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

const DEFAULT_INPUT: UseRegisterCanonicalTokenInput = {
  sourceChainId: "",
  tokenAddress: "0x",
  expectedTokenId: "0x",
  tokenName: "",
  tokenSymbol: "",
  decimals: -1,
};

type UseRegisterCanonicalTokenConfig = {
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
};

export function useRegisterCanonicalTokenMutation(
  config: UseRegisterCanonicalTokenConfig,
  input: UseRegisterCanonicalTokenInput
) {
  const inputRef = useRef<UseRegisterCanonicalTokenInput>(DEFAULT_INPUT);
  const { chain } = useNetwork();

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
      if (!multicall.data || !chain) {
        return;
      }

      setRecordDeploymentArgs({
        kind: "canonical",
        tokenId: inputRef.current.expectedTokenId,
        tokenAddress: inputRef.current.tokenAddress,
        originChainId: chain.id,
        deploymentTxHash: multicall.data.hash,
        tokenName: inputRef.current.tokenName,
        tokenSymbol: inputRef.current.tokenSymbol,
        tokenDecimals: inputRef.current.decimals,
        originAxelarChainId: inputRef.current.sourceChainId,
        remoteTokens: [],
      });

      config.onFinished?.();
    },
  });

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        recordDeploymentAsync(recordDeploymentArgs).then(() => {
          onStatusUpdate({
            type: "deployed",
            tokenAddress: recordDeploymentArgs.tokenAddress,
            txHash: recordDeploymentArgs.deploymentTxHash,
          });
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordDeploymentArgs]
  );

  return multicall;
}
