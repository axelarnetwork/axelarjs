import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import { zeroAddress } from "viem";
import { useChainId } from "wagmi";

import {
  useInterchainTokenFactoryMulticall,
  usePrepareInterchainTokenFactoryMulticall,
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
  input: RegisterRemoteInterchainTokensInput
) {
  const { computed } = useEVMChainConfigsQuery();
  const chainId = useChainId();

  const destinationChains = useMemo(
    () =>
      input.chainIds
        .map((chainId) => computed.indexedByChainId[chainId])
        .filter(Boolean),
    [input.chainIds, computed.indexedByChainId]
  );

  const destinationChainIds = destinationChains.map(
    (chain) => chain.chain_name
  );

  const sourceChain = useMemo(
    () => computed.indexedByChainId[chainId],
    [chainId, computed.indexedByChainId]
  );

  const { data: tokenDeployment } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFees } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChain?.id ?? "0",
  });

  const multicallArgs = useMemo(() => {
    if (!tokenDeployment || !gasFees || tokenDeployment.kind !== "interchain")
      return [];

    return destinationChainIds.map((chainId, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        salt: tokenDeployment.salt,
        originalChainName: sourceChain?.chain_name ?? "",
        minter: tokenDeployment.originalMinterAddress ?? zeroAddress,
        destinationChain: chainId,
        gasValue: gasFees[i],
      })
    );
  }, [destinationChainIds, gasFees, sourceChain?.chain_name, tokenDeployment]);

  const totalGasFee = useMemo(
    () => gasFees?.reduce((a, b) => a + b, 0n) ?? 0n,
    [gasFees]
  );

  const { config } = usePrepareInterchainTokenFactoryMulticall({
    value: totalGasFee,
    args: [multicallArgs],
    enabled: multicallArgs.length > 0,
  });

  return useInterchainTokenFactoryMulticall(config);
}
