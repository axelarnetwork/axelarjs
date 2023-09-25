import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Alert, Button, Tooltip } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, type FC } from "react";

import { isEmpty, partition, without } from "rambda";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";

import { InterchainTokenList } from "~/features/InterchainTokenList";
import type { TokenInfo } from "~/features/InterchainTokenList/types";
import { RegisterCanonicalToken } from "~/features/RegisterCanonicalToken/RegisterCanonicalToken";
import { RegisterRemoteTokens } from "~/features/RegisterRemoteTokens";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
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
  props: InterchainTokenDetailsPageSessionStorageProps
) => `@maestro/interchain-tokens/${props.chainId}/${props.tokenAddress}`;

export function useInterchainTokenDetailsPageState(
  props: InterchainTokenDetailsPageSessionStorageProps
) {
  return useSessionStorageState<{
    deployTokensTxHash: `0x${string}` | null;
    selectedChainIds: number[];
  }>(getInterchainTokenDetailsPageSessionStorageKey(props), {
    deployTokensTxHash: null,
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

  const [registered, unregistered] = Maybe.of(
    interchainToken?.matchingTokens?.map((x) => ({
      ...x,
      decimals: Number(tokenDetails?.decimals),
      tokenId: x.tokenId as `0x${string}`,
      tokenAddress: x.tokenAddress as `0x${string}`,
    }))
  ).mapOr(
    [[], []],
    partition((x) => x.isRegistered)
  );

  const targetDeploymentChains = useMemo(() => {
    return sessionState.selectedChainIds
      .map(
        (x) =>
          (interchainToken?.matchingTokens ?? []).find((y) => y.chainId === x)
            ?.chain.id
      )
      .filter(Boolean) as string[];
  }, [interchainToken?.matchingTokens, sessionState.selectedChainIds]);

  const { data: statuses, isSuccess: hasFetchedStatuses } =
    useGetTransactionStatusOnDestinationChainsQuery({
      txHash: sessionState.deployTokensTxHash ?? undefined,
    });

  const statusesByChain = useMemo(() => {
    return (
      statuses ??
      targetDeploymentChains.reduce(
        (acc, chainId) => ({
          ...acc,
          [chainId]: "pending" as const,
        }),
        {} as Record<string, "pending" | GMPTxStatus>
      )
    );
  }, [statuses, targetDeploymentChains]);

  // reset state when all txs are executed or errored
  useEffect(() => {
    if (!hasFetchedStatuses || !statusesByChain || isEmpty(statusesByChain))
      return;

    if (
      Object.values(statusesByChain).every(
        ({ status }) => status === "executed" || status === "error"
      )
    ) {
      setSessionState((draft) => {
        draft.deployTokensTxHash = null;
        draft.selectedChainIds = [];
      });
    }
  }, [hasFetchedStatuses, setSessionState, statuses, statusesByChain]);

  const remoteChainsExecuted = useMemo(() => {
    return Object.entries(statusesByChain)
      .filter(([, { status }]) => status === "executed")
      .map(([chainId]) => chainId);
  }, [statusesByChain]);

  useEffect(() => {
    if (
      targetDeploymentChains.length === 0 ||
      remoteChainsExecuted.length === 0 ||
      isInterchainTokenLoading
    ) {
      return;
    }

    if (remoteChainsExecuted.length === targetDeploymentChains.length) {
      setSessionState((draft) => {
        draft.deployTokensTxHash = null;
        draft.selectedChainIds = [];
      });
    }

    refetchInterchainToken().catch(() => {
      logger.error("Failed to refetch interchain token");
    });
  }, [
    address,
    remoteChainsExecuted,
    targetDeploymentChains,
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
      destinationChainIds: targetDeploymentChains,
      gasLimit: 1_000_000,
      gasMultipler: 3,
    });

  const originToken = useMemo(
    () => interchainToken.matchingTokens?.find((x) => x.isOriginToken),
    [interchainToken]
  );

  const { switchNetworkAsync } = useSwitchNetwork();

  const isReadOnly = !interchainToken.wasDeployedByAccount || !address;

  const shouldRenderFooter =
    !isReadOnly && sessionState.selectedChainIds.length > 0;

  return (
    <div className="flex flex-col gap-8 md:relative">
      {interchainTokenError && tokenDetailsError && (
        <Alert status="error">{tokenDetailsError.message}</Alert>
      )}

      {interchainTokenError && tokenDetails && (
        <div className="mx-auto w-full max-w-md">
          {address ? (
            <RegisterCanonicalToken
              address={props.tokenAddress}
              chainName={interchainToken.chain?.name}
              tokenName={props.tokenName}
              tokenSymbol={props.tokenSymbol}
              decimals={props.decimals}
              onSuccess={refetchInterchainToken}
            />
          ) : (
            <ConnectWalletButton className="w-full" size="md">
              Connect wallet to register this token
            </ConnectWalletButton>
          )}
        </div>
      )}
      <InterchainTokenList
        title="Registered interchain tokens"
        tokens={registered as TokenInfo[]}
      />
      <InterchainTokenList
        title="Unregistered interchain tokens"
        listClassName="grid-cols-2 sm:grid-cols-3"
        tokens={unregistered
          .filter((x) => {
            // filter out tokens that are already registered on the current chain
            return x.chain && !remoteChainsExecuted.includes(x.chain.id);
          })
          .map((token) => {
            const gmpInfo = token.chain?.id
              ? statusesByChain[token.chain.id]
              : undefined;

            return {
              ...token,
              isSelected: sessionState.selectedChainIds.includes(token.chainId),
              isRegistered: false,
              deploymentStatus: gmpInfo?.status,
              deploymentTxHash: Maybe.of(gmpInfo).mapOrUndefined(
                ({ txHash, logIndex }) => `${txHash}:${logIndex}` as const
              ),
            } as TokenInfo;
          })}
        onToggleSelection={
          isReadOnly
            ? undefined
            : (chainId) => {
                if (sessionState.deployTokensTxHash) {
                  return;
                }

                setSessionState((draft) => {
                  draft.selectedChainIds = draft.selectedChainIds.includes(
                    chainId
                  )
                    ? without([chainId], draft.selectedChainIds)
                    : draft.selectedChainIds.concat(chainId);
                });
              }
        }
        footer={
          shouldRenderFooter && (
            <div className="bg-base-300 grid w-full items-center gap-2 rounded-xl p-4 md:flex md:justify-between md:p-2">
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
                      {gasFees.reduce((a, b) => a + b)}
                    </BigNumberText>{" "}
                    {getNativeToken(interchainToken.chain.id)}
                  </div>
                </Tooltip>
              )}

              {originToken?.chainId === chainId && originToken?.kind ? (
                <RegisterRemoteTokens
                  deploymentKind={originToken.kind}
                  chainIds={sessionState.selectedChainIds}
                  tokenAddress={props.tokenAddress}
                  originChainId={originToken?.chainId}
                  existingTxHash={sessionState.deployTokensTxHash}
                  onTxStateChange={(txState) => {
                    if (txState.status === "submitted") {
                      setSessionState((draft) => {
                        draft.deployTokensTxHash = txState.hash;
                      });
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
          )
        }
      />
    </div>
  );
};

export default ConnectedInterchainTokensPage;
