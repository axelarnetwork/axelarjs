import type { EVMChainConfig } from "@axelarjs/api";
import type { GMPTxStatus } from "@axelarjs/api/gmp";
import {
  Alert,
  Button,
  CopyToClipboardButton,
  LinkButton,
  toast,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useRouter } from "next/router";

import { ExternalLink, InfoIcon } from "lucide-react";
import { partition, without } from "rambda";
import { isAddress, TransactionExecutionError } from "viem";
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import Page from "~/layouts/Page";
import { useInterchainTokenServiceRegisterCanonicalToken } from "~/lib/contracts/InterchainTokenService.hooks";
import { useChainFromRoute } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChains } from "~/services/axelarjsSDK/hooks";
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
      {routeChain && (
        <>
          <ConnectedInterchainTokensPage
            chainId={routeChain?.id}
            tokenAddress={tokenAddress}
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
};

const RegisterOriginTokenButton = ({
  address = "0x0" as `0x${string}`,
  chainName = "Axelar",
  onSuccess = () => {},
}) => {
  const [txState, setTxState] = useTransactionState();

  const { writeAsync, data } = useInterchainTokenServiceRegisterCanonicalToken({
    value: BigInt(0),
  });

  useWaitForTransaction({
    hash: data?.hash,
    confirmations: 8,
    async onSuccess(receipt) {
      onSuccess();

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Token registered successfully");
    },
  });

  const handleSubmitTransaction = useCallback(async () => {
    setTxState({
      status: "awaiting_approval",
    });

    try {
      const result = await writeAsync({ args: [address] });

      setTxState({
        status: "submitted",
        hash: result.hash,
      });
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction reverted: ${error.cause.shortMessage}`);
        logger.error("Failed to register origin token:", error.cause);
        setTxState({
          status: "idle",
        });
        return;
      }

      setTxState({
        status: "reverted",
        error: error as Error,
      });
    }
  }, [address, setTxState, writeAsync]);

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Registering token...";
      case "reverted":
        return "Transaction failed";
      default:
        return `Register origin token on ${chainName}`;
    }
  }, [txState, chainName]);

  return (
    <Button
      length="block"
      onClick={handleSubmitTransaction}
      loading={
        txState.status === "awaiting_approval" || txState.status === "submitted"
      }
    >
      {buttonChildren}
    </Button>
  );
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {
    data: interchainToken,
    refetch,
    error: interchainTokenError,
  } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  const { data: tokenDetails, error: tokenDetailsError } =
    trpc.erc20.getERC20TokenDetails.useQuery({
      chainId: props.chainId,
      tokenAddress: props.tokenAddress,
    });

  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([]);

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

  const [deployTokensTxHash, setDeployTokensTxHash] = useState<`0x${string}`>();

  const targetDeploymentChains = useMemo(() => {
    return selectedChainIds
      .map((x) => unregistered.find((y) => y.chainId === x)?.chain.id)
      .filter(Boolean) as string[];
  }, [selectedChainIds, unregistered]);

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash: deployTokensTxHash,
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

  const deployedTokens = useMemo(() => {
    return Object.entries(statusesByChain)
      .filter(([_, { status }]) => status === "executed")
      .map(([chainId, _]) => chainId);
  }, [statusesByChain]);

  useEffect(() => {
    if (targetDeploymentChains.length === 0 || deployedTokens.length === 0) {
      return;
    }

    if (deployedTokens.length === targetDeploymentChains.length) {
      setSelectedChainIds([]);
      setDeployTokensTxHash(undefined);

      console.log("deployedTokens", deployedTokens);
      refetch();
    }
  }, [
    address,
    deployedTokens,
    targetDeploymentChains,
    interchainToken.tokenId,
    props.chainId,
    props.tokenAddress,
    refetch,
  ]);

  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
  } = useEstimateGasFeeMultipleChains({
    sourceChainId: interchainToken?.chain?.id ?? "",
    destinationChainIds: targetDeploymentChains,
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  const handleDeployRemoteTokens = useCallback(async () => {
    if (!(props.chainId && interchainToken?.tokenId && gasFees)) {
      return;
    }

    // await deployRemoteTokens({
    //   destinationChainIds: targetDeploymentChains,
    //   tokenAddress: props.tokenAddress,
    //   tokenId: interchainToken.tokenId as `0x${string}`,
    //   gasFees,
    //   onStatusUpdate(status) {
    //     if (status.type === "deployed") {
    //       setDeployTokensTxHash(status.txHash);
    //     }
    //   },
    // });
  }, [props.chainId, interchainToken?.tokenId, gasFees]);

  const originToken = useMemo(
    () => interchainToken.matchingTokens?.find((x) => x.isOriginToken),
    [interchainToken]
  );

  const { switchNetworkAsync } = useSwitchNetwork();

  return (
    <div className="flex flex-col gap-8 md:relative">
      {interchainTokenError && tokenDetailsError && (
        <Alert status="error">{tokenDetailsError.message}</Alert>
      )}

      {interchainTokenError && tokenDetails && (
        <div className="mx-auto w-full max-w-md">
          {address ? (
            <RegisterOriginTokenButton
              address={props.tokenAddress}
              chainName={interchainToken.chain?.name}
              onSuccess={refetch}
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
        tokens={registered}
      />
      <InterchainTokenList
        title="Unregistered interchain tokens"
        listClassName="grid-cols-2 sm:grid-cols-3"
        tokens={unregistered.map((token) => {
          const gmpInfo = token.chain?.id
            ? statusesByChain[token.chain.id]
            : undefined;

          return {
            ...token,
            isSelected: selectedChainIds.includes(token.chainId),
            isRegistered: false,
            deploymentStatus: gmpInfo?.status,
            deploymentTxHash: Maybe.of(gmpInfo).mapOrUndefined(
              ({ txHash, logIndex }) => `${txHash}:${logIndex}` as const
            ),
          };
        })}
        onToggleSelection={(chainId) => {
          if (deployTokensTxHash) {
            return;
          }
          setSelectedChainIds((selected) =>
            selected.includes(chainId)
              ? without([chainId], selected)
              : selected.concat(chainId)
          );
        }}
        footer={
          !selectedChainIds.length ? undefined : (
            <div className="bg-base-300 grid w-full items-center gap-2 rounded-xl p-4 md:flex md:justify-between md:p-2">
              {isGasPriceQueryLoading && (
                <span className="md:ml-2">estimating gas fee... </span>
              )}
              {gasFees && interchainToken.chain && (
                <Tooltip
                  tip={`Estimated gas fee for deploying token on ${
                    selectedChainIds.length
                  } additional chain${selectedChainIds.length > 1 ? "s" : ""}`}
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
              {selectedChainIds.length > 0 && !deployTokensTxHash && (
                <>
                  {originToken?.chainId === chain?.id ? (
                    <Button
                      variant="primary"
                      onClick={handleDeployRemoteTokens}
                      disabled={isGasPriceQueryLoading || isGasPriceQueryError}
                      // loading={isDeploying}
                    >
                      Register token on {selectedChainIds.length} additional
                      chain
                      {selectedChainIds.length > 1 ? "s" : ""}
                    </Button>
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
                      {selectedChainIds.length > 1 ? "s" : ""}
                    </Button>
                  )}
                </>
              )}

              {deployTokensTxHash && (
                <LinkButton
                  variant="accent"
                  outline
                  href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${deployTokensTxHash}`}
                  className="flex items-center gap-2"
                  target="_blank"
                >
                  View on Axelarscan {maskAddress(deployTokensTxHash)}{" "}
                  <ExternalLink className="h-4 w-4" />
                </LinkButton>
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
