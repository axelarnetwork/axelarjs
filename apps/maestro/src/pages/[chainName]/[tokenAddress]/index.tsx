import type { EVMChainConfig } from "@axelarjs/api";
import type { GMPTxStatus } from "@axelarjs/api/gmp";
import {
  Alert,
  Button,
  CopyToClipboardButton,
  LinkButton,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, type FC } from "react";
import { useRouter } from "next/router";

import { ExternalLink, InfoIcon } from "lucide-react";
import { isEmpty, partition, without } from "rambda";
import { isAddress } from "viem";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import type { TokenInfo } from "~/features/InterchainTokenList/types";
import { RegisterCanonicalToken } from "~/features/RegisterCanonicalToken/RegisterCanonicalToken";
import { RegisterRemoteTokens } from "~/features/RegisterRemoteTokens";
import Page from "~/layouts/Page";
import { useChainFromRoute } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useERC20TokenDetailsQuery } from "~/services/erc20/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

const InterchainTokensPage = () => {
  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: `0x${string}`;
  };

  const routeChain = useChainFromRoute();

  const {
    data: interchainToken,
    isLoading,
    isError,
  } = useInterchainTokensQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  const { data: tokenDetails } = useERC20TokenDetailsQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  if (!isAddress(tokenAddress)) {
    return <Alert status="error">Invalid token address</Alert>;
  }

  return (
    <Page
      pageTitle={`Interchain Tokens - ${unSluggify(chainName)}`}
      className="!flex flex-1 flex-col gap-12 md:gap-16"
      isLoading={isLoading && !isError}
      loadingMessage="loading interchain token..."
    >
      {tokenDetails && interchainToken.chain && (
        <TokenDetailsSection
          chain={interchainToken.chain}
          tokenAddress={tokenAddress}
          decimals={tokenDetails.decimals}
          name={tokenDetails.name}
          symbol={tokenDetails.symbol}
          tokenId={interchainToken?.tokenId as `0x${string}`}
        />
      )}
      {routeChain && tokenDetails && (
        <>
          <ConnectedInterchainTokensPage
            chainId={routeChain?.id}
            tokenAddress={tokenAddress}
            tokenName={tokenDetails.name}
            tokenSymbol={tokenDetails.symbol}
            decimals={tokenDetails.decimals}
            tokenId={interchainToken.tokenId}
          />
        </>
      )}
    </Page>
  );
};

export default InterchainTokensPage;

type ConnectedInterchainTokensPageProps = {
  chainId: number;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  tokenId?: `0x${string}` | null;
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {
    data: interchainToken,
    refetch: refetchInterchainToken,
    error: interchainTokenError,
    isLoading: isInterchainTokenLoading,
  } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  const { data: tokenDetails, error: tokenDetailsError } =
    trpc.erc20.getERC20TokenDetails.useQuery({
      chainId: props.chainId,
      tokenAddress: props.tokenAddress,
    });

  const [sessionState, setSessionState] = useSessionStorageState<{
    deployTokensTxHash: `0x${string}` | null;
    selectedChainIds: number[];
  }>(`@maestro/interchain-token-page/${props.chainId}/${props.tokenAddress}`, {
    deployTokensTxHash: null,
    selectedChainIds: [],
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
      .filter(([_, { status }]) => status === "executed")
      .map(([chainId, _]) => chainId);
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

    refetchInterchainToken();
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

              {originToken?.chainId === chain?.id && originToken?.kind ? (
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
                      switchNetworkAsync?.(originToken.chainId);
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

type TokenDetailsSectionProps = {
  name: string;
  symbol: string;
  tokenId?: `0x${string}`;
  chain: EVMChainConfig;
  tokenAddress: `0x${string}`;
  decimals: number;
};

const TokenDetailsSection: FC<TokenDetailsSectionProps> = (props) => {
  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-2xl font-bold">
          <span className="hidden sm:inline">Interchain Token </span>
          {Boolean(props.name && props.symbol) && (
            <>
              <span className="hidden sm:inline">&middot;</span>
              <span className="text-primary text-base">{props.name}</span>{" "}
              <span className="text-base opacity-50">({props.symbol})</span>
            </>
          )}
        </div>
        {props.tokenId && (
          <LinkButton
            className="flex items-center gap-2 text-base"
            href={`${props.chain.explorer.url}/token/${props.tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <ChainIcon
              src={props.chain.image}
              alt={props.chain.name}
              size="sm"
            />
            View token
            <span className="hidden sm:inline">
              on {props.chain.explorer.name}
            </span>
            <ExternalLink className="h-4 w-4 translate-x-1" />
          </LinkButton>
        )}
      </div>
      <ul className="grid gap-1.5">
        {[
          ["Name", props.name],
          ["Symbol", props.symbol],
          ["Decimals", props.decimals],
          [
            "Token Address",
            <CopyToClipboardButton
              key="token-address"
              size="xs"
              variant="ghost"
              copyText={props.tokenAddress}
            >
              {maskAddress(props.tokenAddress)}
            </CopyToClipboardButton>,
          ],
          ...(props?.tokenId
            ? [
                [
                  "Token ID",
                  <div key="token-id" className="flex items-center">
                    <CopyToClipboardButton
                      size="xs"
                      variant="ghost"
                      copyText={props.tokenId}
                    >
                      {maskAddress(props.tokenId)}
                    </CopyToClipboardButton>
                    <Tooltip
                      tip="TokeId is a common key used to identify an interchain token across all chains"
                      variant="info"
                      position="bottom"
                    >
                      <InfoIcon className="text-info h-[1em] w-[1em]" />
                    </Tooltip>
                  </div>,
                ],
              ]
            : []),
        ]
          .filter(([, value]) => Boolean(value))
          .map(([label, value]) => (
            <li key={String(label)} className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{label}: </span>
              <span className="opacity-60">{value}</span>
            </li>
          ))}
      </ul>
    </section>
  );
};
