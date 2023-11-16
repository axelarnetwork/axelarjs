import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";

import { parseUnits } from "viem";
import { useAccount, useChainId, useWaitForTransaction } from "wagmi";

import {
  useInterchainTokenFactoryInterchainTokenAddress,
  useInterchainTokenFactoryInterchainTokenId,
  useInterchainTokenFactoryMulticall,
  usePrepareInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export interface UseDeployAndRegisterInterchainTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: bigint[];
  initialSupply?: bigint;
  deployerAddress?: `0x${string}`;
}

export interface UseDeployAndRegisterRemoteInterchainTokenConfig {
  value: bigint;
  salt: `0x${string}`;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}

export function useDeployAndRegisterRemoteInterchainTokenMutation(
  config: UseDeployAndRegisterRemoteInterchainTokenConfig,
  input?: UseDeployAndRegisterInterchainTokenInput
) {
  const { address: deployerAddress } = useAccount();
  const chainId = useChainId();

  const { computed } = useEVMChainConfigsQuery();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const { data: tokenId } = useInterchainTokenFactoryInterchainTokenId({
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenId.args({
      salt: config.salt,
      deployer: deployerAddress as `0x${string}`,
    }),
    enabled: deployerAddress && isValidEVMAddress(deployerAddress),
  });

  const { data: tokenAddress } =
    useInterchainTokenFactoryInterchainTokenAddress({
      args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenAddress.args({
        salt: config.salt,
        deployer: deployerAddress as `0x${string}`,
      }),
      enabled: Boolean(tokenId),
    });

  const { originalChainName, destinationChainNames } = useMemo(() => {
    const index = computed.indexedById;
    const originalChainName =
      index[input?.sourceChainId ?? chainId]?.chain_name ?? "Unknown";

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
    computed.indexedById,
    input?.destinationChainIds,
    input?.sourceChainId,
  ]);

  const multicallArgs = useMemo(() => {
    const deployer = input?.deployerAddress ?? deployerAddress;

    if (!input || !deployer) {
      return [];
    }

    const initialSupply = input.initialSupply
      ? parseUnits(String(input.initialSupply), input.decimals)
      : BigInt(0);

    const baseArgs = {
      salt: config.salt,
      name: input.tokenName,
      symbol: input.tokenSymbol,
      decimals: input.decimals,
    };

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployInterchainToken.data({
        ...baseArgs,
        mintAmount: initialSupply,
        distributor: deployer,
      });

    if (!input.destinationChainIds.length) {
      return [deployTxData];
    }

    const registerTxData = destinationChainNames.map((destinationChain, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        originalChainName,
        destinationChain,
        gasValue: input.gasFees[i] ?? BigInt(0),
        distributor: deployer,
        salt: config.salt,
      })
    );

    return [deployTxData, ...registerTxData];
  }, [
    input,
    deployerAddress,
    config.salt,
    destinationChainNames,
    originalChainName,
  ]);

  const totalGasFee = useMemo(
    () => input?.gasFees?.reduce((a, b) => a + b, BigInt(0)) ?? BigInt(0),
    [input?.gasFees]
  );

  const prepareMulticall = usePrepareInterchainTokenFactoryMulticall({
    value: totalGasFee,
    chainId: chainId,
    args: [multicallArgs],
  });

  console.log({ prepareMulticall });

  const multicall = useInterchainTokenFactoryMulticall(prepareMulticall.config);

  useWaitForTransaction({
    hash: multicall?.data?.hash,
    confirmations: 8,
    onSuccess: () => {
      const txHash = multicall?.data?.hash;

      if (!txHash || !tokenAddress || !tokenId || !deployerAddress || !input) {
        return;
      }

      setRecordDeploymentArgs({
        kind: "interchain",
        salt: config.salt,
        tokenId,
        tokenAddress,
        deployerAddress,
        deploymentMessageId: `${txHash}-0`,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        originalDistributorAddress: deployerAddress,
        destinationAxelarChainIds: input.destinationChainIds,
      });
    },
  });

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
