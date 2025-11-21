import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Alert, Button, cn, Tooltip } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useSession } from "next-auth/react";

import { concat, isEmpty, map, partition, uniq, without } from "rambda";

import {
  CHAINS_WITHOUT_DEPLOYMENT,
  EVM_CHAIN_IDS_WITH_NON_DETERMINISTIC_TOKEN_ADDRESS,
  SUI_CHAIN_ID,
} from "~/config/chains";
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
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
} from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { ChainStatus } from "~/server/routers/gmp/getTransactionStatusOnDestinationChains";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
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
  // axelarscan returns chainId in lowercase
  const deploymentStatus = chainId
    ? statusesByChain[chainId?.toLowerCase()]
    : undefined;

  if (!deploymentStatus) {
    return undefined;
  }

  return deploymentStatus.lastHop
    ? deploymentStatus
    : { ...deploymentStatus, status: "pending" };
}

const useIsAuthenticated = () => {
  const { data: session, status: sessionStatus } = useSession();
  return {
    isAuthenticated: sessionStatus === "authenticated" && !!session?.address,
    session,
    sessionStatus,
  };
};

type InterchainToken = NonNullable<
  Awaited<ReturnType<typeof useInterchainTokensQuery>>
>["data"];

interface UseUpdateRemoteSuiProps {
  interchainToken: InterchainToken;
  tokenId: string | null;
  tokenAddress: string;
  onSuccess: VoidFunction;
}

const useUpdateRemoteSui = ({
  interchainToken,
  tokenId,
  tokenAddress,
  onSuccess,
}: UseUpdateRemoteSuiProps) => {
  const { isAuthenticated } = useIsAuthenticated();

  const { mutateAsync: updateSuiAddresses } =
    trpc.interchainToken.updateSuiRemoteTokenAddresses.useMutation();

  const [isAlreadyUpdatingRemoteSui, setAlreadyUpdatingRemoteSui] =
    useState(false);

  // Update Sui remote token addresses
  // the address is wrong on the Sui chain on deployment because it's the EVM address,
  // we wait for the tx to be executed then we update the address on the Sui chain
  useEffect(() => {
    if (!isAuthenticated) return;

    const suiChain = interchainToken?.matchingTokens?.find((x) =>
      x.chain?.id.includes("sui")
    );

    if (
      !isAlreadyUpdatingRemoteSui &&
      suiChain &&
      interchainToken?.matchingTokens?.some(
        (x) =>
          x.chain?.id === suiChain?.chain?.id &&
          x.tokenAddress === tokenAddress &&
          x.isRegistered
      ) &&
      tokenId
    ) {
      setAlreadyUpdatingRemoteSui(true);
      updateSuiAddresses({
        tokenId,
      })
        .then(() => {
          setAlreadyUpdatingRemoteSui(false);
          onSuccess();
        })
        .catch(() => {
          setTimeout(() => {
            setAlreadyUpdatingRemoteSui(false);
          }, 5000); // space requests while waiting for the tx to be executed and data to be available on sui chain
        });
    }
  }, [
    isAuthenticated,
    interchainToken?.matchingTokens,
    isAlreadyUpdatingRemoteSui,
    tokenAddress,
    tokenId,
    updateSuiAddresses,
    onSuccess,
  ]);
};

interface UseUpdateRemoteStellarProps {
  interchainToken: InterchainToken;
  tokenId: string | null;
  tokenAddress: string;
  onSuccess: VoidFunction;
}

const useUpdateRemoteStellar = ({
  interchainToken,
  tokenId,
  tokenAddress,
  onSuccess,
}: UseUpdateRemoteStellarProps) => {
  const { isAuthenticated } = useIsAuthenticated();

  const [isAlreadyUpdatingRemoteStellar, setAlreadyUpdatingRemoteStellar] =
    useState(false);

  const { mutateAsync: updateStellarAddresses } =
    trpc.interchainToken.updateStellarRemoteTokenAddresses.useMutation();

  // Update Stellar remote token addresses
  // the address is wrong on the Stellar chain on deployment because it's the EVM address,
  // we wait for the tx to be executed then we update the address on the Stellar chain
  useEffect(() => {
    if (!isAuthenticated) return;

    const stellarChain = interchainToken?.matchingTokens?.find((x) =>
      x.chain?.id.includes("stellar")
    );

    if (
      !isAlreadyUpdatingRemoteStellar &&
      stellarChain &&
      interchainToken?.matchingTokens?.some(
        (x) =>
          x.chain?.id === stellarChain?.chain?.id &&
          x.tokenAddress === tokenAddress &&
          x.isRegistered
      ) &&
      tokenId
    ) {
      setAlreadyUpdatingRemoteStellar(true);
      updateStellarAddresses({
        tokenId,
      })
        .then(() => {
          setAlreadyUpdatingRemoteStellar(false);
          onSuccess();
        })
        .catch(() => {
          setTimeout(() => {
            setAlreadyUpdatingRemoteStellar(false);
          }, 5000); // space requests while waiting for the tx to be executed and data to be available on stellar chain
        });
    }
  }, [
    isAuthenticated,
    interchainToken?.matchingTokens,
    isAlreadyUpdatingRemoteStellar,
    tokenAddress,
    tokenId,
    onSuccess,
    updateStellarAddresses,
  ]);
};

interface UseUpdateRemoteRegisteredEVMProps {
  chainId: number;
  interchainToken: InterchainToken;
  tokenId: string | null;
  tokenAddress: string;
  onSuccess: VoidFunction;
}

const useUpdateRemoteEVM = ({
  chainId,
  interchainToken,
  tokenId,
  tokenAddress,
  onSuccess,
}: UseUpdateRemoteRegisteredEVMProps) => {
  const { isAuthenticated } = useIsAuthenticated();

  const { mutateAsync: updateEVMRemoteTokenAddress } =
    trpc.interchainToken.updateEVMRemoteTokenAddress.useMutation();

  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const setChainUpdateStatus = useCallback(
    (chainId: string | undefined, status: boolean) => {
      setIsUpdating((prev) => ({ ...prev, [chainId ?? ""]: status }));
    },
    []
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    // also, update the address for the EVM chains that have a non-deterministic token address
    interchainToken?.matchingTokens?.forEach((x) => {
      const updateToken = () => {
        if (isUpdating[x.chain?.id ?? ""] || !tokenId) {
          return;
        }

        setChainUpdateStatus(x.chain?.id, true);
        updateEVMRemoteTokenAddress({
          tokenId,
          axelarChainId: x.chain?.id,
        })
          .then(() => {
            setChainUpdateStatus(x.chain?.id, false);
            onSuccess();
          })
          .catch(() => {
            setTimeout(() => {
              setChainUpdateStatus(x.chain?.id, false);
            }, 5000);
          });
      };

      // check if the EVM token address is the same as sui, which is wrong
      // NOTE: maybe also check that the destination chain is actually an EVM chain
      const shouldUpdateSui =
        chainId === SUI_CHAIN_ID &&
        !x.chain?.id.includes("sui") &&
        x.tokenAddress === tokenAddress;

      if (shouldUpdateSui) {
        updateToken();
        return;
      }

      // only handle registered tokens
      if (!x.isRegistered) {
        return;
      }

      const isSourceEVMNonDeterministic =
        EVM_CHAIN_IDS_WITH_NON_DETERMINISTIC_TOKEN_ADDRESS.includes(chainId);
      const isDestinationEVMNonDeterministic =
        EVM_CHAIN_IDS_WITH_NON_DETERMINISTIC_TOKEN_ADDRESS.includes(
          x.chain?.chain_id
        );

      // 1. If source chain is non-deterministic, update matchingTokens where the addresses match
      // 2. If source chain is deterministic, update matchingTokens where the addresses match AND the destination chain is non-deterministic
      const shouldUpdateToken = isSourceEVMNonDeterministic
        ? x.tokenAddress === tokenAddress && x.chain?.chain_id !== chainId
        : x.tokenAddress === tokenAddress && isDestinationEVMNonDeterministic;

      if (shouldUpdateToken) {
        updateToken();
        return;
      }
    });
  }, [
    isAuthenticated,
    interchainToken?.matchingTokens,
    chainId,
    tokenAddress,
    tokenId,
    updateEVMRemoteTokenAddress,
    isUpdating,
    onSuccess,
    setChainUpdateStatus,
  ]);
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { isAuthenticated } = useIsAuthenticated();
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
  } = trpc.nativeTokens.getNativeTokenDetails.useQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const [sessionState, setSessionState] = useInterchainTokenDetailsPageState({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const [registered, unregisteredUnfiltered] = Maybe.of(interchainToken?.matchingTokens)
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

  // There are some chains where we cannot remote deploy to
  // Thus, we need to remove these chains from the `unregistered` object.
  const unregistered = unregisteredUnfiltered.filter((token) => !CHAINS_WITHOUT_DEPLOYMENT.includes(token.chainId));

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
      void utils.nativeTokens.getNativeTokenDetails.invalidate();
    }
  }, [
    isInterchainTokenFetching,
    isTokenDetailsFetching,
    utils.nativeTokens.getNativeTokenDetails,
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
    if (isAuthenticated) {
      recoverMessageId();
    }
  }, [recoverMessageId, isAuthenticated]);

  useUpdateRemoteSui({
    interchainToken,
    tokenId: props.tokenId ?? null,
    tokenAddress: props.tokenAddress,
    onSuccess: refetchPageData,
  });

  useUpdateRemoteStellar({
    interchainToken,
    tokenId: props.tokenId ?? null,
    tokenAddress: props.tokenAddress,
    onSuccess: refetchPageData,
  });

  useUpdateRemoteEVM({
    chainId: props.chainId,
    interchainToken,
    tokenId: props.tokenId ?? null,
    tokenAddress: props.tokenAddress,
    onSuccess: refetchPageData,
  });

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
      // gasMultiplier: 1.1,
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
