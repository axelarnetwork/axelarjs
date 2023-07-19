import { encodeInterchainTokenServiceDeployRemoteCanonicalTokenData } from "@axelarjs/evm";
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

export function useRegisterRemoteCanonicalTokens(input: {
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

  const { data: tokenDeployment } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFees } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChainId ?? "0",
  });

  const multicallArgs = useMemo(() => {
    if (!tokenDeployment || !gasFees) return [];

    invariant(tokenDeployment.kind === "canonical", "invalid token kind");

    return destinationChainIds.map((axelarChainId, i) => {
      const gasFee = gasFees[i];

      return encodeInterchainTokenServiceDeployRemoteCanonicalTokenData({
        tokenId: tokenDeployment.tokenId,
        destinationChain: axelarChainId,
        gasValue: gasFee,
      });
    });
  }, [destinationChainIds, gasFees, tokenDeployment]);

  const totalGasFee = useMemo(
    () =>
      gasFees?.reduce((acc, gasFee) => acc + gasFee, BigInt(0)) ?? BigInt(0),
    [gasFees]
  );
  const { config } = usePrepareInterchainTokenServiceMulticall({
    value: totalGasFee,
    args: [multicallArgs],
  });

  return useInterchainTokenServiceMulticall(config);
}
