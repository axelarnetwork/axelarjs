import { encodeInterchainTokenServiceDeployAndRegisterRemoteStandardizedTokenData } from "@axelarjs/evm";
import { invariant, Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { useNetwork } from "wagmi";

import {
  useInterchainTokenServiceMulticall,
  usePrepareInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export function useRegisterRemoteStandardizedTokens(input: {
  chainIds: number[];
  tokenAddress: `0x${string}`;
  originChainId: number;
  deployerAddress: `0x${string}`;
}) {
  const { computed } = useEVMChainConfigsQuery();
  const { chain } = useNetwork();

  const destinationChains = useMemo(
    () =>
      input.chainIds
        .map((chainId) => computed.indexedByChainId[chainId])
        .filter(Boolean),
    [input.chainIds, computed.indexedByChainId]
  );

  const destinationChainIds = destinationChains.map((chain) => chain.id);

  const sourceChainId = useMemo(
    () =>
      Maybe.of(chain).mapOrNull(
        (chain) => computed.indexedByChainId[chain.id]?.id
      ),
    [chain, computed.indexedByChainId]
  );

  // 1. find the token deployment with the given tokenAddress and originChainId

  const { data: tokenDeployment } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  // 2. find the token deployment with the given tokenAddress and originChainId

  // 3. get the gas fees for the destination chains
  const { data: gasFees } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChainId ?? "0",
  });

  const multicallArgs = useMemo(() => {
    if (!tokenDeployment || !gasFees) return [];

    invariant(tokenDeployment.kind === "standardized", "invalid token kind");

    return destinationChainIds.map((chainId, i) =>
      encodeInterchainTokenServiceDeployAndRegisterRemoteStandardizedTokenData({
        salt: tokenDeployment.salt,
        name: tokenDeployment.tokenName,
        symbol: tokenDeployment.tokenSymbol,
        decimals: tokenDeployment.tokenDecimals,
        distributor: "0x", // remote tokens cannot be minted, so the distributor must be 0x
        operator: tokenDeployment.deployerAddress,
        destinationChain: chainId,
        gasValue: gasFees[i],
      })
    );
  }, [destinationChainIds, gasFees, tokenDeployment]);

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
