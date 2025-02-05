import {
  INTERCHAIN_TOKEN_FACTORY_ENCODERS,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";
import { invariant, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { zeroAddress, type TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import useDeployToken from "~/features/suiHooks/useDeployToken";
import {
  useReadInterchainTokenFactoryInterchainTokenId,
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useReadInterchainTokenServiceInterchainTokenAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { useAccount, useChainId } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import type { EstimateGasFeeMultipleChainsOutput } from "~/server/routers/axelarjsSDK";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment.state";

export interface UseDeployAndRegisterInterchainTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  remoteDeploymentGasFees?: EstimateGasFeeMultipleChainsOutput;
  initialSupply?: bigint;
  salt: `0x${string}`;
  minterAddress?: string;
}

export interface UseDeployAndRegisterRemoteInterchainTokenConfig {
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}

export function useDeployAndRegisterRemoteInterchainTokenMutation(
  config: UseDeployAndRegisterRemoteInterchainTokenConfig,
  input?: UseDeployAndRegisterInterchainTokenInput
) {
  const { address: deployerAddress } = useAccount();
  const chainId = useChainId();
  const { deployToken } = useDeployToken();
  const { combinedComputed } = useAllChainConfigsQuery();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const { mutateAsync: getDestinationTxHashAndAddress } =
    trpc.gmp.getDestinationChainTxHashAndAddress.useMutation();
  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const { data: tokenId } = useReadInterchainTokenFactoryInterchainTokenId({
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenId.args({
      salt: input?.salt as `0x${string}`,
      deployer: deployerAddress,
    }),
    query: {
      enabled:
        input?.salt && deployerAddress && isValidEVMAddress(deployerAddress),
    },
  });

  const { data: tokenAddress } =
    useReadInterchainTokenServiceInterchainTokenAddress({
      args: INTERCHAIN_TOKEN_SERVICE_ENCODERS.interchainTokenAddress.args({
        tokenId: tokenId as `0x${string}`,
      }),
      query: {
        enabled: Boolean(tokenId),
      },
    });

  const { destinationChainNames } = useMemo(() => {
    const index = combinedComputed.indexedById;
    const originalChain = index[input?.sourceChainId ?? chainId];
    const originalChainName = originalChain?.chain_name ?? "Unknown";

    return {
      originalChainName,
      destinationChainNames:
        input?.destinationChainIds.map(
          (destinationChainId) =>
            index[destinationChainId]?.chain_name ?? "Unknown"
        ) ?? [],
    };
  }, [
    chainId,
    input?.destinationChainIds,
    input?.sourceChainId,
    combinedComputed.indexedById,
  ]);

  const multicallArgs = useMemo(() => {
    if (!input || !tokenId) {
      return [];
    }

    const minter = input?.minterAddress ?? zeroAddress;
    const commonArgs = {
      minter: minter as `0x${string}`,
      salt: input.salt,
    };

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployInterchainToken.data({
        ...commonArgs,
        initialSupply: input.initialSupply || 0n,
        name: input.tokenName,
        symbol: input.tokenSymbol,
        decimals: input.decimals,
      });

    if (!input.destinationChainIds.length) {
      // early return case, no remote chains
      return [deployTxData];
    }

    const registerTxData = destinationChainNames.map((destinationChain, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        ...commonArgs,
        originalChainName: "",
        destinationChain,
        gasValue: input.remoteDeploymentGasFees?.gasFees?.[i].fee ?? 0n,
      })
    );

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, destinationChainNames]);

  const totalGasFee = input?.remoteDeploymentGasFees?.totalGasFee ?? 0n;
  const isMutationReady =
    multicallArgs.length > 0 &&
    // enable if there are no remote chains or if there are remote chains and the total gas fee is greater than 0
    (!destinationChainNames.length || totalGasFee > 0n);
  const { data: prepareMulticall } = useSimulateInterchainTokenFactoryMulticall(
    {
      chainId,
      value: totalGasFee,
      args: [multicallArgs],
      query: {
        enabled: isMutationReady,
      },
    }
  );
  const multicall = useWriteInterchainTokenFactoryMulticall();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: multicall?.data,
  });

  const onReceipt = useCallback(
    ({
      transactionHash: txHash,
      transactionIndex: txIndex,
    }: TransactionReceipt) => {
      if (!txHash || !tokenAddress || !tokenId || !deployerAddress || !input) {
        console.error(
          "useDeployAndRegisterRemoteInterchainTokenMutation: unable to setRecordDeploymentArgs",
          {
            txHash,
            tokenAddress,
            tokenId,
            deployerAddress,
            input,
          }
        );
        return;
      }

      setRecordDeploymentArgs({
        kind: "interchain",
        deploymentMessageId: `${txHash}-${txIndex}`,
        tokenId: tokenId as string,
        tokenAddress,
        deployerAddress,
        salt: input.salt,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        originalMinterAddress: input.minterAddress,
        destinationAxelarChainIds: input.destinationChainIds,
        tokenManagerAddress: "",
      });
    },
    [deployerAddress, input, tokenAddress, tokenId]
  );

  useEffect(
    () => {
      if (receipt) {
        onReceipt(receipt);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        recordDeploymentAsync(recordDeploymentArgs)
          .then(() => {
            const tx = decodeDeploymentMessageId(
              recordDeploymentArgs.deploymentMessageId as DeploymentMessageId
            );
            onStatusUpdate({
              type: "deployed",
              tokenAddress: recordDeploymentArgs.tokenAddress as `0x${string}`,
              txHash: tx.hash,
            });
          })
          .catch((e: Error) => {
            console.error(
              "useDeployAndRegisterRemoteInterchainTokenMutation: unable to record tx",
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

  const recordDeploymentDraft = useCallback(async () => {
    if (!input || !tokenId || !deployerAddress || !tokenAddress) {
      return;
    }

    return await recordDeploymentAsync({
      kind: "interchain",
      tokenId: tokenId as string,
      deployerAddress,
      tokenAddress,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      tokenDecimals: input.decimals,
      axelarChainId: input.sourceChainId,
      salt: input.salt,
      originalMinterAddress: input.minterAddress,
      destinationAxelarChainIds: input.destinationChainIds,
      deploymentMessageId: "",
      tokenManagerAddress: "",
    });
  }, [deployerAddress, input, recordDeploymentAsync, tokenAddress, tokenId]);

  const writeAsync = useCallback(async () => {
    const SUI_CHAIN_ID = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;

    await recordDeploymentDraft();
    if (chainId === SUI_CHAIN_ID && input) {
      const result = await deployToken({
        initialSupply: input.initialSupply as bigint,
        symbol: input.tokenSymbol,
        name: input.tokenName,
        decimals: input.decimals,
        destinationChainIds: input.destinationChainIds,
      });

      if (result?.digest && result.deploymentMessageId) {
        const token: any = result?.events?.[0]?.parsedJson;

        const { destinationTxHash, destinationChainAddress: address } =
          await getDestinationTxHashAndAddress({
            deploymentMessageId: result.deploymentMessageId,
            chainIds: input.destinationChainIds,
            tokenId: token.token_id?.id,
          });

        setRecordDeploymentArgs({
          kind: "interchain",
          deploymentMessageId: result.deploymentMessageId,
          tokenId: token.token_id?.id,
          tokenAddress: address,
          tokenManagerAddress: result.tokenManagerAddress,
          deployerAddress,
          salt: input.salt,
          tokenName: input.tokenName,
          tokenSymbol: input.tokenSymbol,
          tokenDecimals: input.decimals,
          axelarChainId: input.sourceChainId,
          originalMinterAddress: input.minterAddress,
          destinationAxelarChainIds: input.destinationChainIds,
          destinationTxHash: destinationTxHash,
        });

        return {
          ...result,
          destinationTxHash: destinationTxHash,
          destinationTokenAddress: tokenAddress,
        };
      }
    } else {
      invariant(
        prepareMulticall?.request !== undefined,
        "useDeployAndRegisterRemoteInterchainTokenMutation: prepareMulticall?.request is not defined"
      );

      return await multicall.writeContractAsync(prepareMulticall.request);
    }
  }, [
    chainId,
    deployToken,
    deployerAddress,
    input,
    multicall,
    prepareMulticall?.request,
    recordDeploymentDraft,
    getDestinationTxHashAndAddress,
  ]);

  const write = useCallback(() => {
    invariant(
      prepareMulticall?.request !== undefined,
      "useDeployAndRegisterRemoteInterchainTokenMutation: prepareMulticall?.request is not defined"
    );

    recordDeploymentDraft()
      .then(() => multicall.writeContract(prepareMulticall.request))
      .catch((e: Error) => {
        console.error(
          "useDeployAndRegisterRemoteInterchainTokenMutation: unable to record tx",
          e
        );
        onStatusUpdate({
          type: "idle",
        });
      });
  }, [
    multicall,
    onStatusUpdate,
    prepareMulticall?.request,
    recordDeploymentDraft,
  ]);

  return { ...multicall, writeAsync, write };
}
