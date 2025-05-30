import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useState } from "react";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
} from "~/config/env";
import { useBalance } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { toNumericString } from "~/lib/utils/bigint";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import {
  useChainInfoQuery,
  useEstimateGasFeeQuery,
} from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useNativeTokenDetailsQuery } from "~/services/nativeTokens/hooks";
import { useTransactionsContainer } from "../Transactions";
import { useInterchainTokenServiceTransferMutation } from "./hooks/useInterchainTokenServiceTransferMutation";
import { useInterchainTransferMutation } from "./hooks/useInterchainTransferMutation";

type ChainConfig = EVMChainConfig | VMChainConfig;

export function useSendInterchainTokenState(props: {
  tokenAddress: string;
  originTokenAddress?: `0x${string}`;
  originTokenChainId?: number;
  tokenId: `0x${string}`;
  sourceChain: ChainConfig;
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

  const [, { addTransaction }] = useTransactionsContainer();

  const balance = useBalance();

  const nativeTokenSymbol = getNativeToken(props.sourceChain.id.toLowerCase());

  const { data: gas } = useEstimateGasFeeQuery({
    sourceChainId: props.sourceChain.id,
    destinationChainId: selectedToChain?.id,
    sourceChainTokenSymbol: nativeTokenSymbol,
    gasMultiplier: "auto",
    gasLimit: NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  });

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
      isApprovalRequired
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
      isApprovalRequired,
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
      selectedToChain,
      eligibleTargetChains,
      tokenSymbol,
      gasFee: Maybe.of(gas).mapOrUndefined(toNumericString),
      nativeTokenSymbol,
      hasInsufficientGasBalance,
      estimatedWaitTimeInMinutes: Maybe.of(sourceChainInfo).mapOr(
        0,
        (x) => x.estimatedWaitTimeInMinutes
      ),
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
