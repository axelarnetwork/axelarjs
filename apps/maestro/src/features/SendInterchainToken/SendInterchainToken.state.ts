import type { EVMChainConfig } from "@axelarjs/api";
import { useMemo, useState } from "react";

import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useInterchainTransferMutation } from "./hooks/useInterchainTransferMutation";
import { useTokenManagerSendTokenMutation } from "./hooks/useTokenManagerSendTokenMutation";

export function useSendInterchainTokenState(props: {
  tokenAddress: `0x${string}`;
  originTokenAddress?: `0x${string}`;
  originTokenChainId?: number;
  tokenId: `0x${string}`;
  sourceChain: EVMChainConfig;
  kind: "canonical" | "interchain";
  isModalOpen?: boolean;
}) {
  const { computed } = useEVMChainConfigsQuery();

  const { data: interchainToken } = useInterchainTokensQuery({
    tokenAddress: props.tokenAddress,
    chainId: props.sourceChain.chain_id,
  });

  const { data: originInterchainToken } = useInterchainTokensQuery({
    tokenAddress: props.originTokenAddress,
    chainId: props.originTokenChainId,
  });

  const referenceToken = useMemo(
    () =>
      props.kind === "canonical" ? originInterchainToken : interchainToken,
    [interchainToken, originInterchainToken, props.kind]
  );

  const [isModalOpen, setIsModalOpen] = useState(props.isModalOpen ?? false);
  const [toChainId, selectToChain] = useState(5);

  const eligibleTargetChains = useMemo(() => {
    return (referenceToken?.matchingTokens ?? [])
      .filter((x) => x.isRegistered && x.chainId !== props.sourceChain.chain_id)
      .map((x) => computed.indexedByChainId[x.chainId ?? 0]);
  }, [
    referenceToken?.matchingTokens,
    props.sourceChain.chain_id,
    computed.indexedByChainId,
  ]);

  const selectedToChain = useMemo(
    () =>
      eligibleTargetChains.find((c) => c.chain_id === toChainId) ??
      eligibleTargetChains[0],

    [toChainId, eligibleTargetChains]
  );

  const {
    mutateAsync: interchainTransferAsync,
    isLoading: isInterchainTransferSending,
    txState: interchainTransferTxState,
    reset: resetInterchainTransferTxState,
  } = useInterchainTransferMutation({
    tokenAddress: props.tokenAddress,
    destinationChainName: selectedToChain?.chain_name,
    sourceChainName: props.sourceChain.chain_name,
  });

  const {
    mutateAsync: tokenManagerSendTokenAsync,
    isLoading: isTokenManagerSending,
    txState: tokenManagerTxState,
    reset: resetTokenManagerTxState,
  } = useTokenManagerSendTokenMutation({
    tokenAddress: props.tokenAddress,
    tokenId: props.tokenId,
    destinationChainName: selectedToChain?.chain_name,
    sourceChainName: props.sourceChain.chain_name,
  });

  const trpcContext = trpc.useUtils();

  const refetchBalances = () =>
    trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();

  const resetTxState = () => {
    resetInterchainTransferTxState();
    resetTokenManagerTxState();
  };

  const { sendTokenAsync, isSending, txState } = useMemo(
    () =>
      props.kind === "canonical"
        ? {
            sendTokenAsync: tokenManagerSendTokenAsync,
            isSending: isTokenManagerSending,
            txState: tokenManagerTxState,
          }
        : {
            sendTokenAsync: interchainTransferAsync,
            isSending: isInterchainTransferSending,
            txState: interchainTransferTxState,
          },
    [
      props.kind,
      tokenManagerSendTokenAsync,
      isTokenManagerSending,
      tokenManagerTxState,
      interchainTransferAsync,
      interchainTransferTxState,
      isInterchainTransferSending,
    ]
  );

  return [
    {
      isModalOpen,
      txState,
      isSending,
      selectedToChain,
      eligibleTargetChains,
    },
    {
      setIsModalOpen,
      resetTxState,
      sendTokenAsync,
      selectToChain,
      refetchBalances,
    },
  ] as const;
}

export type UseSendInterchainTokenState = ReturnType<
  typeof useSendInterchainTokenState
>;

export type State = UseSendInterchainTokenState[0];
export type Actions = UseSendInterchainTokenState[1];
