import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Alert, Button, cn, Tooltip } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, type FC } from "react";

import { concat, isEmpty, map, partition, uniq, without } from "rambda";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";

import CanonicalTokenDeployment from "~/features/CanonicalTokenDeployment";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import type { TokenInfo } from "~/features/InterchainTokenList/types";
import { RegisterRemoteTokens } from "~/features/RegisterRemoteTokens";
import { useTransactionsContainer } from "~/features/Transactions";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useGetTransactionsStatusesOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";
import BigNumberText from "~/ui/components/BigNumberText";
import ConnectWalletButton from "~/ui/compounds/ConnectWalletButton";

type ConnectedInterchainTokensPageProps = {
  chainId: number;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  tokenId?: `0x${string}` | null;
};

type InterchainTokenDetailsPageSessionStorageProps = {
  chainId: number;
  tokenAddress: `0x${string}`;
};

export const getInterchainTokenDetailsPageSessionStorageKey = (
  props: InterchainTokenDetailsPageSessionStorageProps,
  version = 1
) =>
  `@maestro/interchain-tokens/${props.chainId}/${props.tokenAddress}/v${version}`;

export type InterchainTokenDetailsPageState = {
  deployTokensTxHashes: `0x${string}`[];
  selectedChainIds: number[];
};

export function persistTokenDeploymentTxHash(
  tokenAddress: `0x${string}`,
  chainId: number,
  deployTokensTxHash: `0x${string}`,
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

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const {
    data: interchainToken,
    refetch: refetchInterchainToken,
    error: interchainTokenError,
    isLoading: isInterchainTokenLoading,
  } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
  });

  const { data: tokenDetails, error: tokenDetailsError } =
    trpc.erc20.getERC20TokenDetails.useQuery({
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
          } as TokenInfo)
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

  const { computed } = useEVMChainConfigsQuery();
  const { switchNetworkAsync } = useSwitchNetwork();

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
      setSessionState((draft) => {
        draft.deployTokensTxHashes = [];
        draft.selectedChainIds = [];
      });
    }
  }, [hasFetchedStatuses, setSessionState, statuses, statusesByChain]);

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
      isInterchainTokenLoading
    ) {
      return;
    }

    if (remoteChainsExecuted.length === destinationChainIds.length) {
      setSessionState((draft) => {
        draft.deployTokensTxHashes = [];
        draft.selectedChainIds = [];
      });
    }

    refetchInterchainToken().catch(() => {
      logger.error("Failed to refetch interchain token");
    });
  }, [
    address,
    remoteChainsExecuted,
    destinationChainIds,
    interchainToken.tokenId,
    props.chainId,
    props.tokenAddress,
    refetchInterchainToken,
    isInterchainTokenLoading,
    setSessionState,
  ]);

  const { data: gasFees, isLoading: isGasPriceQueryLoading } =
    useEstimateGasFeeMultipleChainsQuery({
      sourceChainId: interchainToken?.chain?.id ?? "",
      destinationChainIds,
      gasLimit: 1_000_000,
      gasMultipler: 1.5,
    });

  const originToken = useMemo(
    () => interchainToken.matchingTokens?.find((x) => x.isOriginToken),
    [interchainToken]
  );

  const runninChainIds = useMemo(
    () =>
      Object.entries(statusesByChain).map(
        ([axelarChainId]) => computed.indexedById[axelarChainId]?.chain_id
      ),
    [computed.indexedById, statusesByChain]
  );

  const nonRunningSelectedChainIds = sessionState.selectedChainIds.filter(
    (x) => !runninChainIds.includes(x)
  );

  const isReadOnly =
    !interchainToken.wasDeployedByAccount ||
    !address ||
    isGasPriceQueryLoading ||
    !hasFetchedStatuses;

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
          const gmpInfo = token.chain?.id
            ? statusesByChain[token.chain.id]
            : undefined;

          const isSelected = nonRunningSelectedChainIds.includes(
            token.chainId ?? 0
          );

          return {
            ...token,
            isSelected,
            isRegistered: false,
            deploymentStatus: gmpInfo?.status,
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

  const [, { addTransaction }] = useTransactionsContainer();

  const footerContent = (
    <>
      {
        <div
          className={cn(
            "bg-base-300 grid w-full items-center gap-2 rounded-xl p-4 md:flex md:justify-between md:p-2",
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
                  decimals={18}
                  localeOptions={{
                    style: "decimal",
                    maximumFractionDigits: 4,
                  }}
                >
                  {gasFees.reduce((a, b) => a + b, 0n)}
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
              originChainId={originToken?.chainId}
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
              variant="accent"
              onClick={() => {
                if (originToken) {
                  switchNetworkAsync?.(originToken.chainId).catch(() => {
                    logger.error("Failed to switch network");
                  });
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
        <Alert status="error">{tokenDetailsError.message}</Alert>
      )}

      {interchainTokenError && tokenDetails && (
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
            <ConnectWalletButton className="w-full" size="md">
              Connect wallet to register this token
            </ConnectWalletButton>
          )}
        </div>
      )}
      <InterchainTokenList title="Registered Chains" tokens={registered} />
      <InterchainTokenList
        title="Unregistered Chains"
        listClassName="grid-cols-2 sm:grid-cols-3"
        tokens={unregisteredTokens}
        onToggleSelection={
          isReadOnly
            ? undefined
            : (chainId) => {
                setSessionState((draft) => {
                  draft.selectedChainIds = draft.selectedChainIds.includes(
                    chainId
                  )
                    ? without([chainId], draft.selectedChainIds)
                    : draft.selectedChainIds.concat(chainId);
                });
              }
        }
        footer={footerContent}
      />
    </div>
  );
};

export default ConnectedInterchainTokensPage;
