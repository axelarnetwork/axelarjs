import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { Maybe, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { reduce } from "rambda";
import { parseUnits, zeroAddress } from "viem";
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
import type { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment.state";

export interface UseDeployAndRegisterInterchainTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  remoteDeploymentGasFees: bigint[];
  initialSupply?: bigint;
  salt: `0x${string}`;
  minterAddress?: `0x${string}`;
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

  const { computed } = useEVMChainConfigsQuery();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const { data: tokenId } = useInterchainTokenFactoryInterchainTokenId({
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenId.args({
      salt: input?.salt as `0x${string}`,
      deployer: deployerAddress as `0x${string}`,
    }),
    enabled:
      input?.salt && deployerAddress && isValidEVMAddress(deployerAddress),
  });

  const { data: tokenAddress } =
    useInterchainTokenFactoryInterchainTokenAddress({
      args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenAddress.args({
        salt: input?.salt as `0x${string}`,
        deployer: deployerAddress as `0x${string}`,
      }),
      enabled: Boolean(tokenId && input?.salt && deployerAddress),
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

  const withDecimals = useCallback(
    (value: bigint) => parseUnits(String(value), input?.decimals ?? 0),
    [input?.decimals]
  );

  const multicallArgs = useMemo(() => {
    if (!input || !tokenId) {
      return [];
    }

    const initialSupply = Maybe.of(input.initialSupply).mapOr(0n, withDecimals);

    const commonArgs = {
      minter: input?.minterAddress ?? zeroAddress,
      salt: input.salt,
    };

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployInterchainToken.data({
        ...commonArgs,
        initialSupply,
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
        originalChainName,
        destinationChain,
        gasValue: input.remoteDeploymentGasFees[i] ?? 0n,
      })
    );

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, withDecimals, destinationChainNames, originalChainName]);

  const totalGasFee = useMemo(() => {
    const remoteDeploymentsGas = Maybe.of(input?.remoteDeploymentGasFees).mapOr(
      0n,
      reduce((a, b) => a + b, 0n)
    );

    // the total gas fee is the sum of the remote deployments gas fee,
    // the remote transfers gas fee and the origin transfer gas fee
    return remoteDeploymentsGas;
  }, [input?.remoteDeploymentGasFees]);

  const prepareMulticall = usePrepareInterchainTokenFactoryMulticall({
    chainId,
    value: totalGasFee,
    args: [multicallArgs],
    enabled: multicallArgs.length > 0 && totalGasFee > 0n,
  });

  const multicall = useInterchainTokenFactoryMulticall(prepareMulticall.config);

  useWaitForTransaction({
    hash: multicall?.data?.hash,
    onSuccess: () => {
      const txHash = multicall?.data?.hash;

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
        salt: input.salt,
        tokenId,
        tokenAddress,
        deployerAddress,
        deploymentMessageId: `${txHash}-0`,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        originalMinterAddress: input.minterAddress,
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
          .catch((e) => {
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

  return multicall;
}
