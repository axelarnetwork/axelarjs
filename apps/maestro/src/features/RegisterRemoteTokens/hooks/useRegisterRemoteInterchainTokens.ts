import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import { zeroAddress } from "viem";
import { useChainId } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import {
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export type RegisterRemoteInterchainTokensInput = {
  chainIds: number[];
  tokenAddress: `0x${string}`;
  originChainId: number;
};

export default function useRegisterRemoteInterchainTokens(
  input: RegisterRemoteInterchainTokensInput
) {

  const { combinedComputed } = useAllChainConfigsQuery();

  const chainId = useChainId();

  const destinationChains = useMemo(
    () =>
      input.chainIds
        .map((chainId) => combinedComputed.indexedByChainId[chainId])
        .filter(Boolean),
    [input.chainIds, combinedComputed.indexedByChainId]
  );

  const destinationChainIds = destinationChains.map(
    (chain) => chain.chain_name
  );

  const sourceChain = useMemo(
    () => combinedComputed.indexedByChainId[chainId],
    [chainId, combinedComputed.indexedByChainId]
  );

  const { data: tokenDeployment } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFeesData } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChain?.id ?? "0",
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
    gasLimit: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
    gasMultiplier: "auto",
  });

  const multicallArgs = useMemo(() => {
    if (
      !tokenDeployment ||
      !gasFeesData ||
      tokenDeployment.kind !== "interchain"
    )
      return [];

    return destinationChainIds.map((chainId, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        salt: tokenDeployment.salt,
        originalChainName: "",
        minter: tokenDeployment.originalMinterAddress ?? zeroAddress,
        destinationChain: chainId,
        gasValue: gasFeesData.gasFees[i].fee,
      })
    );
  }, [destinationChainIds, gasFeesData, tokenDeployment]);

  const totalGasFee = gasFeesData?.totalGasFee ?? 0n;

  const { data: config } = useSimulateInterchainTokenFactoryMulticall({
    value: totalGasFee,
    args: [multicallArgs],
    query: {
      enabled: multicallArgs.length > 0,
    },
  });

  const mutation = useWriteInterchainTokenFactoryMulticall();

  return {
    ...mutation,
    writeContract: () => {
      if (!config) return;

      return mutation.writeContract(config.request);
    },
    writeContractAsync: async () => {
      if (!config) return;

      return await mutation.writeContractAsync(config.request);
    },
  };
}
