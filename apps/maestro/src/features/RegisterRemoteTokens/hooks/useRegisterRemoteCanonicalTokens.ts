import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { useMemo } from "react";

import { STELLAR_CHAIN_ID, SUI_CHAIN_ID } from "~/config/chains";
import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import type { DeployAndRegisterTransactionState as InterchainDeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import {
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useChainId } from "~/lib/hooks";
import { scaleGasValue } from "~/lib/utils/gas";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";
import {
  useRegisterRemoteInterchainTokenOnStellar,
  type RegisterRemoteInterchainTokenOnStellarInput,
} from "./useRegisterRemoteInterchainTokenOnStellar";
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
  const destinationChainNames = destinationChains.map(
    (chain) => chain.chain_name
  );

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
    gasMultiplier: 1.2,
  });

  const multicallArgs = useMemo(() => {
    if (!isValidEVMAddress(input.tokenAddress)) return [] as `0x${string}`[];
    if (!tokenDetails) return [] as `0x${string}`[];
    if (!gasFeesData) return [] as `0x${string}`[];
    if (tokenDetails.kind !== "canonical") return [] as `0x${string}`[];
    if (chainId === SUI_CHAIN_ID) return [] as `0x${string}`[];

    const hasLengthMatch =
      gasFeesData.gasFees.length === destinationChainIds.length;
    if (!hasLengthMatch) {
      throw new Error("Gas fees length does not match destination chains");
    }

    return destinationChainNames.map((destinationChain, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        {
          originalTokenAddress: tokenDetails.tokenAddress as `0x${string}`,
          destinationChain,
          gasValue: scaleGasValue(chainId, gasFeesData.gasFees[i].fee),
        }
      )
    );
  }, [tokenDetails, gasFeesData, chainId, input, destinationChainIds]);

  const totalGasFee = gasFeesData?.totalGasFee ?? 0n;

  const { data: config, error: simulationError } =
    useSimulateInterchainTokenFactoryMulticall({
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

  const statusUpdateAdapter = (
    status: InterchainDeployAndRegisterTransactionState
  ): void => {
    console.debug(
      "[useRegisterRemoteCanonicalTokens] Stellar transaction status update:",
      status
    );
  };

  const stellarInput: RegisterRemoteInterchainTokenOnStellarInput = {
    // for stellar remote canonical tokens we pass the token address as salt
    salt: tokenDetails?.tokenAddress || input.tokenAddress,
    destinationChainIds: destinationChainIds,
    gasValues: gasFeesData?.gasFees?.map((x) => x.fee) ?? [],
    isCanonical: true,
    onStatusUpdate: statusUpdateAdapter,
  };

  let writeContract = undefined;
  switch (chainId) {
    case SUI_CHAIN_ID:
      writeContract = () => registerRemoteInterchainTokenOnSui(suiInput);
      break;
    case STELLAR_CHAIN_ID:
      writeContract = () =>
        registerRemoteInterchainTokenOnStellar(stellarInput);
      break;
    default:
      if (config) {
        writeContract = () => mutation.writeContract(config.request);
      }
  }

  let writeContractAsync = undefined;
  switch (chainId) {
    case SUI_CHAIN_ID:
      writeContractAsync = () => registerRemoteInterchainTokenOnSui(suiInput);
      break;
    case STELLAR_CHAIN_ID:
      writeContractAsync = () =>
        registerRemoteInterchainTokenOnStellar(stellarInput);
      break;
    default:
      if (config) {
        writeContractAsync = () => mutation.writeContractAsync(config.request);
      }
  }

  return {
    ...mutation,
    simulationError,
    writeContract,
    writeContractAsync,
  };
}
