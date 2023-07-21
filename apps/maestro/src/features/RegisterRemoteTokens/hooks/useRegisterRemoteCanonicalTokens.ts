import { encodeInterchainTokenServiceDeployRemoteCanonicalTokenData } from "@axelarjs/evm";
import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { useNetwork } from "wagmi";

import {
  useInterchainTokenServiceMulticall,
  usePrepareInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export type RegisterRemoteCanonicalTokensInput = {
  chainIds: number[];
  tokenAddress: `0x${string}`;
  originChainId: number;
  deployerAddress: `0x${string}`;
};

export default function useRegisterRemoteCanonicalTokens(
  input: RegisterRemoteCanonicalTokensInput
) {
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

  const { data: tokenDetails } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFees } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChainId ?? "0",
  });

  const multicallArgs = useMemo(() => {
    if (!tokenDetails || !gasFees || tokenDetails.kind !== "canonical")
      return [];

    return destinationChainIds.map((axelarChainId, i) => {
      const gasValue = gasFees[i];

      return encodeInterchainTokenServiceDeployRemoteCanonicalTokenData({
        tokenId: tokenDetails.tokenId,
        destinationChain: axelarChainId,
        gasValue,
      });
    });
  }, [destinationChainIds, gasFees, tokenDetails]);

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
