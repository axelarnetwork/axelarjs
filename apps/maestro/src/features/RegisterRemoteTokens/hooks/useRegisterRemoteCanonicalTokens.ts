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

  const { data: tokenDetails } = useInterchainTokenDetailsQuery({
    chainId: input.originChainId,
    tokenAddress: input.tokenAddress,
  });

  const { data: gasFees } = useEstimateGasFeeMultipleChainsQuery({
    destinationChainIds,
    sourceChainId: sourceChain?.id ?? "0",
  });

  const multicallArgs = useMemo(() => {
    if (!tokenDetails || !gasFees || tokenDetails.kind !== "canonical")
      return [];

    return destinationChainIds.map((axelarChainId, i) => {
      const gasValue = gasFees[i];

      return INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        {
          originalChain: sourceChain?.id ?? "0x",
          originalTokenAddress: tokenDetails.tokenAddress,
          destinationChain: axelarChainId,
          gasValue,
        }
      );
    });
  }, [destinationChainIds, gasFees, sourceChain?.id, tokenDetails]);

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
