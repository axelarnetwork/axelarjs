import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Alert, Button, cn, Tooltip } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";

import { concat, isEmpty, map, partition, uniq, without } from "rambda";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import CanonicalTokenDeployment from "~/features/CanonicalTokenDeployment";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import type { TokenInfo } from "~/features/InterchainTokenList/types";
import { RegisterRemoteTokens } from "~/features/RegisterRemoteTokens";
import { useTransactionsContainer } from "~/features/Transactions";
import {
  SUI_CHAIN_ID,
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
} from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { ChainStatus } from "~/server/routers/gmp/getTransactionStatusOnDestinationChains";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useGetTransactionsStatusesOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";
import BigNumberText from "~/ui/components/BigNumberText";
import ConnectWalletModal from "~/ui/compounds/ConnectWalletModal/ConnectWalletModal";

type ConnectedInterchainTokensPageProps = {
  chainId: number;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  tokenId?: string | null;
  deploymentMessageId: string | undefined;
};

type InterchainTokenDetailsPageSessionStorageProps = {
  chainId: number;
  tokenAddress: string;
};

export const getInterchainTokenDetailsPageSessionStorageKey = (
  props: InterchainTokenDetailsPageSessionStorageProps,
  version = 1
) =>
  `@maestro/interchain-tokens/${props.chainId}/${props.tokenAddress}/v${version}`;

export type InterchainTokenDetailsPageState = {
  deployTokensTxHashes: string[];
  selectedChainIds: number[];
};

export function persistTokenDeploymentTxHash(
  tokenAddress: string,
  chainId: number,
  deployTokensTxHash: string,
  selectedChainIds: number[]
) {
  const key = getInterchainTokenDetailsPageSessionStorageKey({
    tokenAddress,
    chainId,
  });

  const currentState = Maybe.of(sessionStorage.getItem(key)).mapOr(
    {},
    JSON.parse
  ) as Partial<InterchainTokenDetailsPageState>;

  const nextDeployTokensTxHashes = [deployTokensTxHash];

  const nextState: InterchainTokenDetailsPageState = {
    ...currentState,
    selectedChainIds: Maybe.of(currentState.selectedChainIds)
      .map(concat(selectedChainIds))
      .mapOr(selectedChainIds, uniq),
    deployTokensTxHashes: Maybe.of(currentState.deployTokensTxHashes)
      .map(concat(nextDeployTokensTxHashes))
      .mapOr(nextDeployTokensTxHashes, uniq),
  };

  sessionStorage.setItem(key, JSON.stringify(nextState));
}

export function useInterchainTokenDetailsPageState(
  props: InterchainTokenDetailsPageSessionStorageProps
) {
  const key = getInterchainTokenDetailsPageSessionStorageKey(props);
  return useSessionStorageState<InterchainTokenDetailsPageState>(key, {
    deployTokensTxHashes: [],
    selectedChainIds: [],
  });
}

function getDeploymentStatus(
  chainId: string | undefined,
  statusesByChain: Record<string, ChainStatus>
) {
  const deploymentStatus = chainId ? statusesByChain[chainId] : undefined;

  if (!deploymentStatus) {
    return undefined;
  }

  return deploymentStatus.lastHop
    ? deploymentStatus
    : { ...deploymentStatus, status: "pending" };
}

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const [isAlreadyUpdatingRemoteSui, setAlreadyUpdatingRemoteSui] =
    useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const {
    data: interchainToken,
    refetch: refetchInterchainToken,
    error: interchainTokenError,
    isFetching: isInterchainTokenFetching,
  } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const {
    data: tokenDetails,
    error: tokenDetailsError,
    isFetching: isTokenDetailsFetching,
  } = trpc.erc20.getERC20TokenDetails.useQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const [sessionState, setSessionState] = useInterchainTokenDetailsPageState({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const [registered, unregistered] = Maybe.of(interchainToken?.matchingTokens)
    .map(
      map(
        (token) =>
          ({
            ...token,
            decimals: Number(tokenDetails?.decimals),
            tokenId: token.tokenId as `0x${string}`,
            tokenAddress: token.tokenAddress as `0x${string}`,
          }) as TokenInfo
      )
    )
    .mapOr(
      [[], []],
      partition((x) => x.isRegistered)
    );

  const destinationChainIds = useMemo(
    () =>
      sessionState.selectedChainIds
        .map(
          (x) =>
            (interchainToken?.matchingTokens ?? []).find((y) => y.chainId === x)
              ?.chain.id
        )
        .filter(Boolean) as string[],
    [interchainToken?.matchingTokens, sessionState.selectedChainIds]
  );

  const { data: statuses, isSuccess: hasFetchedStatuses } =
    useGetTransactionsStatusesOnDestinationChainsQuery({
      txHashes: sessionState.deployTokensTxHashes,
    });

  const { switchChain } = useSwitchChain();
  const { combinedComputed } = useAllChainConfigsQuery();

  const statusesByChain = useMemo(() => {
    return (
      statuses ??
      destinationChainIds.reduce(
        (acc, chainId) => ({
          ...acc,
          [chainId]: "pending" as const,
        }),
        {} as Record<string, "pending" | GMPTxStatus>
      )
    );
  }, [statuses, destinationChainIds]);
  const utils = trpc.useUtils();
  const refetchPageData = useCallback(() => {
    if (!isInterchainTokenFetching && !isTokenDetailsFetching) {
      void utils.interchainToken.searchInterchainToken.invalidate();
      void utils.erc20.getERC20TokenDetails.invalidate();
    }
  }, [
    isInterchainTokenFetching,
    isTokenDetailsFetching,
    utils.erc20.getERC20TokenDetails,
    utils.interchainToken.searchInterchainToken,
  ]);

  // reset state when all txs are executed or errored
  useEffect(() => {
    if (!hasFetchedStatuses || !statusesByChain || isEmpty(statusesByChain)) {
      return;
    }

    if (
      Object.values(statusesByChain).every(
        ({ status }) => status === "executed" || status === "error"
      )
    ) {
      refetchPageData();
      setSessionState((draft) => {
        draft.deployTokensTxHashes = [];
        draft.selectedChainIds = [];
      });
    }
  }, [
    hasFetchedStatuses,
    setSessionState,
    statuses,
    refetchPageData,
    statusesByChain,
    sessionState,
  ]);

  const { mutateAsync, isPending, isSuccess } =
    trpc.interchainToken.recoverDeploymentMessageIdByTokenId.useMutation();

  // If the token does not have a deployment message id, try to
  // recover it and store it in the db then update the token details
  const recoverMessageId = useCallback(() => {
    if (
      !props.deploymentMessageId &&
      props.tokenId &&
      !isPending &&
      !isSuccess
    ) {
      void mutateAsync({ tokenId: props.tokenId }).then((result) => {
        if (result === "updated") {
          refetchPageData();
        }
      });
    }
  }, [
    isSuccess,
    isPending,
    mutateAsync,
    props.deploymentMessageId,
    props.tokenId,
    refetchPageData,
  ]);

  // Try to recover deployment message id if it's missing
  useEffect(() => {
    recoverMessageId();
  }, [recoverMessageId]);

  const { mutateAsync: updateSuiAddresses } =
    trpc.interchainToken.updateSuiRemoteTokenAddresses.useMutation();

  const { mutateAsync: updateEVMAddresses } =
    trpc.interchainToken.updateEVMRemoteTokenAddress.useMutation();

  // Update Sui remote token addresses
  // the address is wrong on the Sui chain on deployment because it's the EVM address,
  // we wait for the tx to be executed then we update the address on the Sui chain
  useEffect(() => {
    if (
      !isAlreadyUpdatingRemoteSui &&
      interchainToken?.matchingTokens?.some(
        (x) =>
          x.chain?.id.includes("sui") &&
          x.tokenAddress === props.tokenAddress &&
          x.isRegistered
      ) &&
      props.tokenId
    ) {
      setAlreadyUpdatingRemoteSui(true);
      updateSuiAddresses({ tokenId: props.tokenId })
        .then(() => {
          setAlreadyUpdatingRemoteSui(false);
          refetchPageData();
        })
        .catch(() => {
          setTimeout(() => {
            setAlreadyUpdatingRemoteSui(false);
          }, 5000); // space requests while waiting for the tx to be executed and data to be available on sui chain
        });
    }
  }, [
    interchainToken?.matchingTokens,
    isAlreadyUpdatingRemoteSui,
    props.tokenAddress,
    props.tokenId,
    updateSuiAddresses,
    refetchPageData,
  ]);

  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const setChainUpdateStatus = useCallback(
    (chainId: string | undefined, status: boolean) => {
      setIsUpdating((prev) => ({ ...prev, [chainId ?? ""]: status }));
    },
    []
  );

  useEffect(() => {
    interchainToken?.matchingTokens?.forEach((x) => {
      // check if the EVM token address is the same as sui, which is wrong
      if (
        props.chainId === SUI_CHAIN_ID &&
        !x.chain?.id.includes("sui") &&
        x.tokenAddress === props.tokenAddress &&
        !isUpdating[x.chain?.id ?? ""]
      ) {
        setChainUpdateStatus(x.chain?.id, true);
        updateEVMAddresses({
          tokenId: props?.tokenId as `0x${string}`,
          axelarChainId: x.chain?.id,
        })
          .then(() => {
            setChainUpdateStatus(x.chain?.id, false);
            refetchPageData();
          })
          .catch(() => {
            setTimeout(() => {
              setChainUpdateStatus(x.chain?.id, false);
            }, 5000);
          });
      }
    });
  }, [
    interchainToken?.matchingTokens,
    props.chainId,
    props.tokenAddress,
    props?.tokenId,
    updateEVMAddresses,
    isUpdating,
    refetchPageData,
    setChainUpdateStatus,
  ]);

  const remoteChainsExecuted = useMemo(
    () =>
      Object.entries(statusesByChain)
        .filter(([, { status }]) => status === "executed")
        .map(([chainId]) => chainId),
    [statusesByChain]
  );

  useEffect(() => {
    if (
      destinationChainIds.length === 0 ||
      remoteChainsExecuted.length === 0 ||
      isInterchainTokenFetching
    ) {
      return;
    }

    if (remoteChainsExecuted.length === destinationChainIds.length) {
      setSessionState((draft) => {
        draft.deployTokensTxHashes = [];
        draft.selectedChainIds = [];
      });
    }

    refetchPageData();
  }, [
    address,
    refetchPageData,
    remoteChainsExecuted,
    destinationChainIds,
    interchainToken.tokenId,
    props.chainId,
    props.tokenAddress,
    refetchInterchainToken,
    isInterchainTokenFetching,
    setSessionState,
  ]);

  const userGasBalance = useBalance();

  const { data: gasFees, isLoading: isGasPriceQueryLoading } =
    useEstimateGasFeeMultipleChainsQuery({
      sourceChainId: interchainToken?.chain?.id ?? "",
      destinationChainIds,
      executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
      gasLimit: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
      gasMultiplier: "auto",
    });

  const originToken = useMemo(
    () => interchainToken.matchingTokens?.find((x) => x.isOriginToken),
    [interchainToken]
  );

  const runningChainIds = useMemo(
    () =>
      Object.entries(statusesByChain).map(
        ([axelarChainId]) =>
          combinedComputed.indexedById[axelarChainId]?.chain_id
      ),
    [combinedComputed.indexedById, statusesByChain]
  );

  const nonRunningSelectedChainIds = sessionState.selectedChainIds.filter(
    (x) => !runningChainIds.includes(x)
  );

  const isRestrictedToDeployer =
    interchainToken.kind === "interchain" &&
    !interchainToken.wasDeployedByAccount;

  const isReadOnly =
    isRestrictedToDeployer ||
    !address ||
    isGasPriceQueryLoading ||
    (!!sessionState.deployTokensTxHashes.length && !hasFetchedStatuses);

  const shouldRenderFooter =
    !isReadOnly && nonRunningSelectedChainIds.length > 0;

  const unregisteredTokens = useMemo(
    () =>
      unregistered
        .filter(
          (x) =>
            // filter out tokens that are already registered on the current chain
            x.chain && !remoteChainsExecuted.includes(x.chain.id)
        )
        .map((token) => {
          const gmpInfo = Maybe.of(token.chain?.id).mapOrUndefined((id) =>
            getDeploymentStatus(id, statusesByChain)
          );

          const isSelected = nonRunningSelectedChainIds.includes(token.chainId);

          return {
            ...token,
            isSelected,
            isRegistered: false,
            deploymentStatus: gmpInfo?.status ?? undefined,
            deploymentTxHash: Maybe.of(gmpInfo).mapOrUndefined(
              ({ txHash, logIndex }) => `${txHash}:${logIndex}` as const
            ),
          } as TokenInfo;
        }),
    [
      unregistered,
      remoteChainsExecuted,
      statusesByChain,
      nonRunningSelectedChainIds,
    ]
  );

  const [idleUnregisteredTokens, pendingUnregisteredTokens] = partition(
    (x) => !x.deploymentStatus,
    unregisteredTokens
  );

  const [, { addTransaction }] = useTransactionsContainer();

  const footerContent = (
    <>
      {
        <div
          className={cn(
            "grid w-full items-center gap-2 rounded-xl bg-base-300 p-4 md:flex md:justify-between md:p-2",
            {
              "pointer-events-none opacity-0": !shouldRenderFooter,
            }
          )}
        >
          {isGasPriceQueryLoading && (
            <span className="md:ml-2">estimating gas fee... </span>
          )}
          {gasFees && interchainToken.chain && (
            <Tooltip
              tip={`Estimated gas fee for deploying token on ${
                sessionState.selectedChainIds.length
              } additional chain${
                sessionState.selectedChainIds.length > 1 ? "s" : ""
              }`}
            >
              <div className="flex items-center justify-end gap-1 text-sm md:ml-2">
                ≈{" "}
                <BigNumberText
                  decimals={userGasBalance?.decimals || 18}
                  localeOptions={{
                    style: "decimal",
                    maximumFractionDigits: 4,
                  }}
                >
                  {gasFees.totalGasFee}
                </BigNumberText>{" "}
                {getNativeToken(interchainToken.chain.id)}
              </div>
            </Tooltip>
          )}
          {originToken?.chainId === chainId ? (
            <RegisterRemoteTokens
              deploymentKind={originToken.kind}
              chainIds={nonRunningSelectedChainIds}
              tokenAddress={props.tokenAddress}
              userGasBalance={userGasBalance}
              gasFees={gasFees?.gasFees.map((x) => x.fee) ?? []}
              originChainId={originToken?.chainId}
              originChain={originToken.chain}
              onTxStateChange={(txState) => {
                switch (txState.status) {
                  case "submitted":
                    setSessionState((draft) => {
                      draft.deployTokensTxHashes = uniq([
                        ...draft.deployTokensTxHashes,
                        txState.hash,
                      ]);
                    });
                    addTransaction({
                      status: "submitted",
                      hash: txState.hash,
                      chainId: originToken.chainId,
                      txType: "INTERCHAIN_DEPLOYMENT",
                    });
                    break;
                  case "confirmed":
                    setSessionState((draft) => {
                      draft.selectedChainIds = [];
                    });
                    break;
                  default:
                    break;
                }
              }}
            />
          ) : (
            <Button
              $variant="accent"
              onClick={() => {
                if (originToken) {
                  switchChain?.({ chainId: originToken.chainId });
                }
              }}
            >
              Switch to {originToken?.chain.name} to register token
              {sessionState.selectedChainIds.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      }
    </>
  );

  return (
    <div className="flex flex-col gap-8 md:relative">
      {interchainTokenError && tokenDetailsError && (
        <Alert $status="error">{tokenDetailsError.message}</Alert>
      )}
      {(interchainTokenError || !props.deploymentMessageId) && tokenDetails && (
        <div className="mx-auto w-full max-w-md">
          {address ? (
            <CanonicalTokenDeployment
              tokenDetails={{
                tokenAddress: props.tokenAddress,
                tokenName: props.tokenName,
                tokenSymbol: props.tokenSymbol,
                tokenDecimals: props.decimals,
              }}
            />
          ) : (
            <ConnectWalletModal>
              Connect wallet to register this token
            </ConnectWalletModal>
          )}
        </div>
      )}
      {props.deploymentMessageId && (
        <>
          <Alert $status={"success"} className="mb-5">
            Anyone can send tokens to/from any of your deployed chains using the
            link of this portal. Share with your community!
          </Alert>
          <InterchainTokenList title="Registered Chains" tokens={registered} />
          {pendingUnregisteredTokens.length > 0 && (
            <InterchainTokenList
              title="Pending Chains"
              listClassName="grid-cols-2 sm:grid-cols-3"
              tokens={pendingUnregisteredTokens}
            />
          )}
          {idleUnregisteredTokens.length > 0 && (
            <InterchainTokenList
              title="Unregistered Chains"
              listClassName="grid-cols-2 sm:grid-cols-3"
              tokens={idleUnregisteredTokens}
              onToggleSelection={
                isReadOnly
                  ? undefined
                  : (chainId) => {
                      setSessionState((draft) => {
                        draft.selectedChainIds =
                          draft.selectedChainIds.includes(chainId)
                            ? without([chainId], draft.selectedChainIds)
                            : draft.selectedChainIds.concat(chainId);
                      });
                    }
              }
              footer={footerContent}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ConnectedInterchainTokensPage;
