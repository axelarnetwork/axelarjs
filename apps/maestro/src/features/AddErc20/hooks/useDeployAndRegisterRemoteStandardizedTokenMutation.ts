import {
  encodeInterchainTokenServiceDeployAndRegisterRemoteStandardizedTokenData,
  encodeInterchainTokenServiceDeployAndRegisterStandardizedTokenData,
  encodeInterchainTokenServiceGetStandardizedTokenAddressArgs,
} from "@axelarjs/evm";
import { throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";

import { parseUnits } from "viem";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";

import { readInterchainTokenService } from "~/lib/contracts/InterchainTokenService.actions";
import {
  useInterchainTokenServiceGetCustomTokenId,
  useInterchainTokenServiceMulticall,
  useInterchainTokenServiceStandardizedTokenDeployedEvent,
  usePrepareInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { IntercahinTokenDetails } from "~/services/kv";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: bigint[];
  initialSupply?: bigint;
  deployerAddress?: `0x${string}`;
};

export function useDeployAndRegisterRemoteStandardizedTokenMutation(
  config: {
    value: bigint;
    salt: `0x${string}`;
    onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
    onFinished?: () => void;
  },
  input?: UseDeployAndRegisterInterchainTokenInput
) {
  const { address: deployerAddress } = useAccount();
  const { chain } = useNetwork();

  const { computed } = useEVMChainConfigsQuery();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<IntercahinTokenDetails | null>(null);

  const unwatch = useInterchainTokenServiceStandardizedTokenDeployedEvent({
    chainId: chain?.id ?? 0,
    listener: async (logs) => {
      const log = logs.find(
        ({ args }) =>
          Boolean(args?.tokenId) &&
          args.decimals === input?.decimals &&
          args.name === input?.tokenName &&
          args.symbol === input?.tokenSymbol &&
          args.mintTo === deployerAddress
      );

      if (!log) {
        return;
      }

      const tokenAddress = await readInterchainTokenService({
        functionName: "getStandardizedTokenAddress",
        args: encodeInterchainTokenServiceGetStandardizedTokenAddressArgs({
          tokenId: log.args?.tokenId as `0x${string}`,
        }),
      });

      const isNotReady =
        !chain ||
        !deployerAddress ||
        !log.args?.tokenId ||
        !input ||
        !log.transactionHash;

      if (isNotReady) {
        return;
      }

      unwatch?.();

      setRecordDeploymentArgs({
        kind: "standardized",
        salt: config.salt,
        tokenId: log.args?.tokenId as `0x${string}`,
        tokenAddress,
        deployerAddress,
        originChainId: chain.id,
        deploymentTxHash: log.transactionHash as `0x${string}`,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        originAxelarChainId: input.sourceChainId,
        remoteTokens: input.destinationChainIds.map((axelarChainId) => ({
          axelarChainId,
          chainId: computed.indexedById[axelarChainId]?.chain_id,
          address: tokenAddress,
          status: "pending",
          deplymentTxHash: log.transactionHash as `0x${string}`,
          // deploymentLogIndex is unknown at this point
        })),
      });
    },
  });

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        console.log("recordDeploymentArgs", recordDeploymentArgs);
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
      encodeInterchainTokenServiceDeployAndRegisterStandardizedTokenData({
        ...baseArgs,
        mintAmount: initialSupply,
        distributor: deployer,
      });

    if (!input.destinationChainIds.length) {
      return [deployTxData];
    }

    const registerTxData = input.destinationChainIds.map((chainId, i) =>
      encodeInterchainTokenServiceDeployAndRegisterRemoteStandardizedTokenData({
        ...baseArgs,
        distributor: "0x", // remote tokens cannot be minted, so the distributor must be 0x
        operator: deployer,
        destinationChain: chainId,
        gasValue: input.gasFees[i] ?? BigInt(0),
      })
    );

    return [deployTxData, ...registerTxData];
  }, [input, deployerAddress, config.salt]);

  const totalGasFee = useMemo(
    () => input?.gasFees?.reduce((a, b) => a + b, BigInt(0)) ?? BigInt(0),
    [input?.gasFees]
  );

  const prepareMulticall = usePrepareInterchainTokenServiceMulticall({
    value: totalGasFee,
    chainId: chain?.id ?? 0,
    args: [multicallArgs],
  });

  const multicall = useInterchainTokenServiceMulticall(prepareMulticall.config);

  useWaitForTransaction({
    hash: multicall?.data?.hash,
    confirmations: 8,
    onSuccess: () => {
      if (!multicall.data?.hash) {
        return;
      }

      onStatusUpdate({
        type: "deploying",
        txHash: multicall?.data?.hash,
      });
    },
  });

  return multicall;
}
