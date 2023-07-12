import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { invariant, Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { encodeFunctionData } from "viem";
import { useMutation, useNetwork } from "wagmi";

import { useInterchainTokenServiceMulticall } from "~/lib/contracts/InterchainTokenService.hooks";
import { useEstimateGasFeeMultipleChains } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

// ideas:
// have the salt encrypted on kv
// then request the decrypting of the salt by providing a signed message
// the user can then use the salt to generate the token address

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
    deployerAddress: input.deployerAddress,
  });

  // 2. find the token deployment with the given tokenAddress and originChainId

  // 3. get the gas fees for the destination chains
  const { data: gasFees } = useEstimateGasFeeMultipleChains({
    destinationChainIds,
    sourceChainId: sourceChainId ?? "0",
  });
  const { writeAsync: multicallAsync } = useInterchainTokenServiceMulticall();

  const totalGasFee = useMemo(
    () =>
      gasFees?.reduce((acc, gasFee) => acc + gasFee, BigInt(0)) ?? BigInt(0),
    [gasFees]
  );

  return useMutation(async () => {
    invariant(tokenDeployment, "token deployment not found");
    invariant(gasFees, "gas fees not found");

    const registerTxData = destinationChainIds.map((chainId, i) => {
      const gasFee = gasFees[i];
      const args = [
        tokenDeployment.salt,
        tokenDeployment.tokenName,
        tokenDeployment.tokenSymbol,
        tokenDeployment.tokenDecimals,
        "0x",
        tokenDeployment.deployerAddress,
        chainId,
        gasFee,
      ] as const;

      return encodeFunctionData({
        functionName: "deployAndRegisterRemoteStandardizedToken",
        args: args,
        abi: INTERCHAIN_TOKEN_SERVICE_ABI,
      });
    });

    await multicallAsync({
      value: totalGasFee,
      args: [registerTxData],
    });
  });
}
