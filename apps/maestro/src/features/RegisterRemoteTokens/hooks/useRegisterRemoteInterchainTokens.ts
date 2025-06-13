import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import {
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { STELLAR_CHAIN_ID, SUI_CHAIN_ID, useChainId } from "~/lib/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";
import { useRegisterRemoteInterchainTokenOnStellar } from "./useRegisterRemoteInterchainTokenOnStellar";
import { useRegisterRemoteInterchainTokenOnSui } from "./useRegisterRemoteInterchainTokenOnSui";

export type RegisterRemoteInterchainTokensInput = {
  chainIds: number[];
  tokenAddress: string;
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

  const destinationChainIds = destinationChains.map((chain) => chain.id);

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
      tokenDeployment.kind !== "interchain" ||
      chainId === SUI_CHAIN_ID
    )
      return [];

    return destinationChainIds.map((chainId, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        salt: tokenDeployment.salt,
        destinationChain: chainId,
        gasValue: gasFeesData.gasFees[i].fee,
      })
    );
  }, [destinationChainIds, gasFeesData, tokenDeployment, chainId]);

  const totalGasFee = gasFeesData?.totalGasFee ?? 0n;

  const { data: config } = useSimulateInterchainTokenFactoryMulticall({
    value: totalGasFee,
    args: [multicallArgs],
    query: {
      enabled: chainId !== SUI_CHAIN_ID && multicallArgs.length > 0,
    },
  });

  const mutation = useWriteInterchainTokenFactoryMulticall();

  const { registerRemoteInterchainToken: registerRemoteInterchainTokenOnSui } =
    useRegisterRemoteInterchainTokenOnSui();

  const {
    registerRemoteInterchainToken: registerRemoteInterchainTokenOnStellar,
  } = useRegisterRemoteInterchainTokenOnStellar();

  if (!tokenDeployment) return;

  const suiInput = {
    axelarChainIds: destinationChainIds,
    originChainId: input.originChainId,
    coinType: input.tokenAddress,
    symbol: tokenDeployment.tokenSymbol,
    gasValues: gasFeesData?.gasFees?.map((x) => x.fee) ?? [],
    tokenManagerType: tokenDeployment.tokenManagerType as
      | "lock_unlock"
      | "mint_burn",
  };

  const stellarInput = {
    salt: input.tokenAddress,
    destinationChainIds,
    gasValues: gasFeesData?.gasFees?.map((x) => x.fee) ?? [],
    isCanonical: true,
  };

  return {
    ...mutation,
    writeContract: () => {
      if (chainId === SUI_CHAIN_ID) {
        return registerRemoteInterchainTokenOnSui(suiInput);
      }

      if (chainId === STELLAR_CHAIN_ID) {
        return registerRemoteInterchainTokenOnStellar(stellarInput);
      }

      if (!config) return;

      return mutation.writeContract(config.request);
    },
    writeContractAsync: async () => {
      if (chainId === SUI_CHAIN_ID) {
        return registerRemoteInterchainTokenOnSui(suiInput);
      }

      if (chainId === STELLAR_CHAIN_ID) {
        return registerRemoteInterchainTokenOnStellar(stellarInput);
      }

      if (!config) return;

      return await mutation.writeContractAsync(config.request);
    },
  };
}
