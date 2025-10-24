import { INTERCHAIN_TOKEN_SERVICE_ENCODERS } from "@axelarjs/evm";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useState } from "react";

import { HEDERA_CHAIN_ID, XRPL_CHAIN_ID, XRPL_EVM_CHAIN_ID } from "~/config/chains";
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
import { xrplScaleGas } from "~/lib/utils/xrpl";

// Chains that should force using Interchain Token Service path
const CHAINS_REQUIRING_TOKEN_SERVICE = [HEDERA_CHAIN_ID];
const TOKEN_MANAGER_SPENDER_CHAINS = [HEDERA_CHAIN_ID];
const CHAINS_GAS_FEE_DECIMALS = {
  [HEDERA_CHAIN_ID]: 18,
};
const CHAINS_PAYING_GAS_WITH_BRIDGED_TOKEN = [XRPL_CHAIN_ID];

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

  const XRPL_EVM_XRP_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const shouldUseTokenService =
    CHAINS_REQUIRING_TOKEN_SERVICE.includes(props.sourceChain.chain_id) ||
    isApprovalRequired ||
    (props.sourceChain.chain_id === XRPL_EVM_CHAIN_ID && props.tokenAddress === XRPL_EVM_XRP_ADDRESS);

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
  const isXRPLChain = props.sourceChain.chain_id == XRPL_CHAIN_ID;

  const payWithToken = CHAINS_PAYING_GAS_WITH_BRIDGED_TOKEN.includes(props.sourceChain.chain_id);

  let sourceChainTokenSymbol;
  if (isXRPLChain) {
    // on xrpl, we can only pay for gas with the token that is transferred
    // we will need the "prettySymbol" value of that token though
    sourceChainTokenSymbol = tokenSymbol;
  } else {
    // in all other cases, use the native token of the chain
    sourceChainTokenSymbol = nativeTokenSymbol;
  }

  // eslint-disable-next-line prefer-const
  let { data: gas, isLoading: isGasLoading, isFetching: isGasFetching } = useEstimateGasFeeQuery({
    sourceChainId: props.sourceChain.id,
    destinationChainId: selectedToChain?.id,
    sourceChainTokenSymbol,
    gasLimit: NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
    gasMultiplier: "auto",
  });
  // TODO: Remove custom overrides before merging to main. For testing purposes, this is left here intentionally. 
  if (tokenDetails?.symbol === "FOO" && isXRPLChain && process.env.NEXT_PUBLIC_NETWORK_ENV === "testnet") {
    gas = 10_000_000_000_000_000_000n;
  }

  let gasFeeDecimals =
          CHAINS_GAS_FEE_DECIMALS[props.sourceChain.chain_id] ||
          props.sourceChain.native_token.decimals;

  if (isXRPLChain) {
    // when XRPL is the source chain, we have to remap the return value of the estimate gas fee query to the "actual" decimals
    ({gas, gasFeeDecimals} = xrplScaleGas(sourceChainTokenSymbol === nativeTokenSymbol, tokenDetails?.decimals, gas, gasFeeDecimals));
  }

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
    if (payWithToken) {
      return false; // don't check here
    }
    return gas > balance.value;
  }, [balance, gas, payWithToken]);

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
      payWithToken, // whether to pay with the bridged token or with the native token
      gasRaw: gas, // the actual gas value, as a BigInt
      gasFee: Maybe.of(gas).mapOrUndefined((gasValue) => {
        return toNumericString(gasValue, gasFeeDecimals);
      }), // just for displaying the value
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
