import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";

import { useAccount, useWaitForTransaction } from "wagmi";

import {
  useInterchainTokenFactoryMulticall,
  usePrepareInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { trpc } from "~/lib/trpc";
import type { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import type { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment.state";

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
  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const account = useAccount();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const multicallArgs = useMemo(
    () => [
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.registerCanonicalInterchainToken.data({
        tokenAddress: input.tokenAddress,
      }),
    ],
    [input.tokenAddress]
  );

  const prepared = usePrepareInterchainTokenFactoryMulticall({
    args: [multicallArgs],
    enabled: multicallArgs.length > 0,
  });

  const multicall = useInterchainTokenFactoryMulticall(prepared.config);

  useWaitForTransaction({
    hash: multicall.data?.hash,
    onSuccess() {
      if (!multicall.data) {
        console.error(
          "useRegisterCanonicalTokenMutation: unable to setRecordDeploymentArgs",
          {
            multicall,
          }
        );
        return;
      }

      setRecordDeploymentArgs({
        kind: "canonical",
        tokenId: input.expectedTokenId,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        axelarChainId: input.sourceChainId,
        tokenAddress: input.tokenAddress,
        tokenDecimals: input.decimals,
        deployerAddress: account.address as `0x${string}`,
        deploymentMessageId: `${multicall.data.hash}-0`,
        destinationAxelarChainIds: [],
      });

      config.onFinished?.();
    },
  });

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        recordDeploymentAsync(recordDeploymentArgs)
          .then(() => {
            const { hash: txHash } = decodeDeploymentMessageId(
              recordDeploymentArgs.deploymentMessageId as DeploymentMessageId
            );

            onStatusUpdate({
              type: "deployed",
              tokenAddress: recordDeploymentArgs.tokenAddress as `0x${string}`,
              txHash,
            });
          })
          .catch((e) => {
            console.error(
              "useRegisterCanonicalTokenMutation: unable to record tx",
              e
            );
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
