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
import { SUI_CHAIN_ID, useChainId } from "~/lib/hooks";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";
import { useRegisterRemoteInterchainTokenOnSui } from "./useRegisterRemoteInterchainTokenOnSui";

export type RegisterRemoteCanonicalTokensInput = {
  chainIds: number[];
  tokenAddress: string;
  originChainId: number;
  deployerAddress: `0x${string}`;
};

export default function useRegisterRemoteCanonicalTokens(
  input: RegisterRemoteCanonicalTokensInput
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

  const { data: tokenDetails } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFeesData } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChain?.id ?? "0",
    gasLimit: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  });

  const multicallArgs = useMemo(() => {
    if (
      !isValidEVMAddress(input.tokenAddress) || // This is only used for EVM chains
      !tokenDetails ||
      !gasFeesData ||
      tokenDetails.kind !== "canonical" ||
      chainId === SUI_CHAIN_ID
    )
      return [];

    return destinationChainIds.map((axelarChainId, i) => {
      const gasValue = gasFeesData.gasFees[i].fee;

      return INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        {
          originalTokenAddress: tokenDetails.tokenAddress as `0x${string}`,
          destinationChain: axelarChainId,
          gasValue,
        }
      );
    });
  }, [tokenDetails, gasFeesData, chainId, input, destinationChainIds]);

  const totalGasFee = gasFeesData?.totalGasFee ?? 0n;

  const { data: config } = useSimulateInterchainTokenFactoryMulticall({
    value: totalGasFee,
    args: [multicallArgs],
    query: {
      enabled: multicallArgs.length > 0 && totalGasFee > 0n,
    },
  });

  const mutation = useWriteInterchainTokenFactoryMulticall();

  const { registerRemoteInterchainToken } =
    useRegisterRemoteInterchainTokenOnSui();

  const suiInput = {
    axelarChainIds: destinationChainIds,
    originChainId: input.originChainId,
    coinType: input.tokenAddress,
    symbol: tokenDetails?.tokenSymbol ?? "",
    gasValues: gasFeesData?.gasFees?.map((x) => x.fee) ?? [],
    tokenManagerType: tokenDetails?.tokenManagerType as
      | "lock_unlock"
      | "mint_burn",
  };
  return {
    ...mutation,
    writeContract: () => {
      if (chainId === SUI_CHAIN_ID) {
        return registerRemoteInterchainToken(suiInput);
      }
      if (!config) return;
      return mutation.writeContract(config.request);
    },
    writeContractAsync: async () => {
      if (chainId === SUI_CHAIN_ID) {
        return registerRemoteInterchainToken(suiInput);
      }
      if (!config) return;
      return await mutation.writeContractAsync(config.request);
    },
  };
}
