import { INTERCHAIN_TOKEN_SERVICE_ENCODERS } from "@axelarjs/evm";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useState } from "react";

import { HEDERA_CHAIN_ID } from "~/config/chains";
import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
} from "~/config/env";
import { useReadInterchainTokenServiceTokenManagerAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import { useBalance } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { toNumericString } from "~/lib/utils/bigint";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { ITSChainConfig } from "~/server/chainConfig";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import {
  useChainInfoQuery,
  useEstimateGasFeeQuery,
} from "~/services/axelarjsSDK/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useNativeTokenDetailsQuery } from "~/services/nativeTokens/hooks";
import { useTransactionsContainer } from "../Transactions";
import { useInterchainTokenServiceTransferMutation } from "./hooks/useInterchainTokenServiceTransferMutation";
import { useInterchainTransferMutation } from "./hooks/useInterchainTransferMutation";

// Chains that should force using Interchain Token Service path
const CHAINS_REQUIRING_TOKEN_SERVICE = [HEDERA_CHAIN_ID];
const TOKEN_MANAGER_SPENDER_CHAINS = [HEDERA_CHAIN_ID];
const CHAINS_GAS_FEE_DECIMALS = {
  [HEDERA_CHAIN_ID]: 18,
};

export function useSendInterchainTokenState(props: {
  tokenAddress: string;
  originTokenAddress?: `0x${string}`;
  originTokenChainId?: number;
  tokenId: `0x${string}`;
  sourceChain: ITSChainConfig;
  kind: "canonical" | "interchain";
  isModalOpen?: boolean;
  destinationAddress?: string;
}) {
  const { combinedComputed } = useAllChainConfigsQuery();

  // Only query ERC20 details for EVM chains
  const { data: tokenDetails } = useNativeTokenDetailsQuery({
    chainId: props.sourceChain.chain_id,
    tokenAddress: props.tokenAddress,
  });

  const { data: interchainToken } = useInterchainTokensQuery({
    tokenAddress: props.tokenAddress,
    chainId: props.sourceChain.chain_id,
  });

  const { data: originInterchainToken } = useInterchainTokensQuery({
    tokenAddress: props.originTokenAddress,
    chainId: props.originTokenChainId,
  });

  const isApprovalRequired = useMemo(
    () =>
      props.kind === "canonical" &&
      props.sourceChain.chain_type === "evm" &&
      interchainToken.chainId !== undefined &&
      interchainToken.chainId === props.originTokenChainId,
    [
      interchainToken.chainId,
      props.kind,
      props.originTokenChainId,
      props.sourceChain.chain_type,
    ]
  );

  const shouldUseTokenService =
    CHAINS_REQUIRING_TOKEN_SERVICE.includes(props.sourceChain.chain_id) ||
    isApprovalRequired;

  const [isModalOpen, setIsModalOpen] = useState(props.isModalOpen ?? false);
  const [toChainId, selectToChain] = useState(5);

  const tokenSymbol = tokenDetails?.symbol;

  const { data: sourceChainInfo } = useChainInfoQuery({
    axelarChainId: props.sourceChain.id,
  });

  const eligibleTargetChains = useMemo(() => {
    const matchingTokens = originInterchainToken?.matchingTokens ?? [];

    return matchingTokens
      .filter((x) => x.isRegistered && x.chainId !== props.sourceChain.chain_id)
      .map((x) => combinedComputed.indexedByChainId[x.chainId ?? 0])
      .filter(Boolean);
  }, [
    originInterchainToken?.matchingTokens,
    props.sourceChain.chain_id,
    combinedComputed.indexedByChainId,
  ]);

  const selectedToChain = useMemo(
    () =>
      eligibleTargetChains.find((c) => c.chain_id === toChainId) ??
      eligibleTargetChains[0],
    [toChainId, eligibleTargetChains]
  );

  const selectedToMatchingToken = useMemo(() => {
    const matchingTokens = originInterchainToken?.matchingTokens ?? [];
    const chainId = selectedToChain?.chain_id;
    return matchingTokens.find((x) => x.chainId === chainId);
  }, [originInterchainToken?.matchingTokens, selectedToChain?.chain_id]);

  const [, { addTransaction }] = useTransactionsContainer();

  const balance = useBalance();

  const nativeTokenSymbol = getNativeToken(props.sourceChain.id.toLowerCase());

  const {
    data: gas,
    isLoading: isGasLoading,
    isFetching: isGasFetching,
  } = useEstimateGasFeeQuery({
    sourceChainId: props.sourceChain.id,
    destinationChainId: selectedToChain?.id,
    sourceChainTokenSymbol: nativeTokenSymbol,
    gasLimit: NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
    gasMultiplier: "auto",
  });

  // Compute spender address for approvals
  const { data: tokenManagerAddress } =
    useReadInterchainTokenServiceTokenManagerAddress({
      args: INTERCHAIN_TOKEN_SERVICE_ENCODERS.tokenManagerAddress.args({
        tokenId: props.tokenId,
      }),
      query: {
        enabled: TOKEN_MANAGER_SPENDER_CHAINS.includes(
          props.sourceChain.chain_id
        ),
      },
    });

  const spenderAddress = useMemo<`0x${string}` | undefined>(() => {
    const useTokenManagerAsSpender =
      TOKEN_MANAGER_SPENDER_CHAINS.includes(props.sourceChain.chain_id) &&
      props.kind === "interchain";
    if (useTokenManagerAsSpender) {
      return tokenManagerAddress;
    }
    return NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS;
  }, [props.sourceChain.chain_id, props.kind, tokenManagerAddress]);

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !gas) {
      return false;
    }
    return gas > balance.value;
  }, [balance, gas]);

  const {
    mutateAsync: interchainTransferAsync,
    isPending: isInterchainTransferSending,
    txState: interchainTransferTxState,
    reset: resetInterchainTransferTxState,
  } = useInterchainTransferMutation({
    tokenAddress: props.tokenAddress,
    destinationChainName: selectedToChain?.id,
    sourceChainName: props.sourceChain.id,
    gas,
    tokenId: props.tokenId,
    destinationAddress: props.destinationAddress,
  });

  const {
    mutateAsync: tokenServiceSendTokenAsync,
    isPending: isTokenServiceTransfering,
    txState: tokenServiceTxState,
    reset: resetTokenServiceTxState,
  } = useInterchainTokenServiceTransferMutation({
    tokenAddress: props.tokenAddress,
    tokenId: props.tokenId,
    destinationChainName: selectedToChain?.id,
    sourceChainName: props.sourceChain.id,
    destinationAddress: props.destinationAddress,
    gas,
    spenderAddress,
  });

  const trpcContext = trpc.useUtils();

  const refetchBalances = () =>
    trpcContext.interchainToken.getInterchainTokenBalanceForOwner.refetch();

  const resetTxState = () => {
    resetInterchainTransferTxState();
    resetTokenServiceTxState();
  };

  const { sendTokenAsync, isSending, txState } = useMemo(
    () =>
      shouldUseTokenService
        ? {
            sendTokenAsync: tokenServiceSendTokenAsync,
            isSending: isTokenServiceTransfering,
            txState: tokenServiceTxState,
          }
        : {
            sendTokenAsync: interchainTransferAsync,
            isSending: isInterchainTransferSending,
            txState: interchainTransferTxState,
          },
    [
      shouldUseTokenService,
      tokenServiceSendTokenAsync,
      isTokenServiceTransfering,
      tokenServiceTxState,
      interchainTransferAsync,
      isInterchainTransferSending,
      interchainTransferTxState,
    ]
  );

  return [
    {
      isModalOpen,
      txState,
      isSending,
      isEstimatingGas: isGasLoading || isGasFetching,
      selectedToChain,
      eligibleTargetChains,
      tokenSymbol,
      gasFee: Maybe.of(gas).mapOrUndefined((gasValue) => {
        const decimals =
          CHAINS_GAS_FEE_DECIMALS[props.sourceChain.chain_id] ||
          props.sourceChain.native_token.decimals;
        return toNumericString(gasValue, decimals);
      }),
      nativeTokenSymbol,
      hasInsufficientGasBalance,
      estimatedWaitTimeInMinutes: Maybe.of(sourceChainInfo).mapOr(
        0,
        (x) => x.estimatedWaitTimeInMinutes
      ),
      destinationTokenAddress: selectedToMatchingToken?.tokenAddress as
        | `0x${string}`
        | undefined,
    },
    {
      setIsModalOpen,
      resetTxState,
      sendTokenAsync,
      selectToChain,
      refetchBalances,
      trackTransaction: addTransaction,
    },
  ] as const;
}

export type UseSendInterchainTokenState = ReturnType<
  typeof useSendInterchainTokenState
>;
export type State = UseSendInterchainTokenState[0];
export type Actions = UseSendInterchainTokenState[1];
