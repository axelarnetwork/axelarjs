import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import { useChainId } from "wagmi";

import {
  useInterchainTokenServiceMulticall,
  usePrepareInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export type RegisterRemoteStandardizedTokensInput = {
  chainIds: number[];
  tokenAddress: `0x${string}`;
  originChainId: number;
  deployerAddress: `0x${string}`;
};

export default function useRegisterRemoteStandardizedTokens(
  input: RegisterRemoteStandardizedTokensInput
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

  const destinationChainIds = destinationChains.map((chain) => chain.id);

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
    if (!tokenDeployment || !gasFees || tokenDeployment.kind !== "standardized")
      return [];

    return destinationChainIds.map((chainId, i) =>
      // encode InterchainTokenService DeployAndRegisterRemoteStandardizedTokenData
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        salt: tokenDeployment.salt,
        originalChainName: sourceChain?.name ?? "",
        distributor: "0x", // remote tokens cannot be minted, so the distributor must be 0x
        destinationChain: chainId,
        gasValue: gasFees[i],
      })
    );
  }, [destinationChainIds, gasFees, sourceChain?.name, tokenDeployment]);

  const totalGasFee = useMemo(
    () => gasFees?.reduce((a, b) => a + b, BigInt(0)) ?? BigInt(0),
    [gasFees]
  );

  const { config } = usePrepareInterchainTokenServiceMulticall({
    value: totalGasFee,
    args: [multicallArgs],
  });

  return useInterchainTokenServiceMulticall(config);
}
