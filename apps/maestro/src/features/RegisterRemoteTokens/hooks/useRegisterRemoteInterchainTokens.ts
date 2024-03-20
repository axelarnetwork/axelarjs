import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import { zeroAddress } from "viem";
import { useChainId } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT } from "~/config/env";
import {
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export type RegisterRemoteInterchainTokensInput = {
  chainIds: number[];
  tokenAddress: `0x${string}`;
  originChainId: number;
};

export default function useRegisterRemoteInterchainTokens(
  input: RegisterRemoteInterchainTokensInput,
) {
  const { computed } = useEVMChainConfigsQuery();
  const chainId = useChainId();

  const destinationChains = useMemo(
    () =>
      input.chainIds
        .map((chainId) => computed.indexedByChainId[chainId])
        .filter(Boolean),
    [input.chainIds, computed.indexedByChainId],
  );

  const destinationChainIds = destinationChains.map(
    (chain) => chain.chain_name,
  );

  const sourceChain = useMemo(
    () => computed.indexedByChainId[chainId],
    [chainId, computed.indexedByChainId],
  );

  const { data: tokenDeployment } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFeesData } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChain?.id ?? "0",
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
        originalChainName: sourceChain?.chain_name ?? "",
        minter: tokenDeployment.originalMinterAddress ?? zeroAddress,
        destinationChain: chainId,
        gasValue: gasFeesData.gasFees[i].fee,
      }),
    );
  }, [
    destinationChainIds,
    gasFeesData,
    sourceChain?.chain_name,
    tokenDeployment,
  ]);

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
