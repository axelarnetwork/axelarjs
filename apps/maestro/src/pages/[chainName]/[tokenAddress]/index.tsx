import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { GMPTxStatus } from "@axelarjs/api";
import {
  Alert,
  Button,
  CopyToClipboardButton,
  LinkButton,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "ethers/lib/utils";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { partition, without } from "rambda";
import { useAccount } from "wagmi";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import AddErc20 from "~/features/AddErc20";
import { useDeployRemoteTokensMutation } from "~/features/AddErc20/hooks/useDeployRemoteTokensMutation";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import Page from "~/layouts/Page";
import { useChainFromRoute } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChains } from "~/services/axelarjsSDK/hooks";
import {
  useGetERC20TokenDetailsQuery,
  useGetTransactionStatusOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

const InterchainTokensPage = () => {
  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: string;
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

  const { data: tokenDetails } = useGetERC20TokenDetailsQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  if (!isAddress(tokenAddress)) {
    return <Alert status="error">Invalid token address</Alert>;
  }

  return (
    <Page
      mustBeConnected
      pageTitle={`Interchain Tokens - ${unSluggify(chainName)}`}
      className="!flex flex-1 flex-col gap-12 md:gap-16"
      isLoading={isLoading && !isError}
      loadingMessage="loading interchain token..."
    >
      {tokenDetails && (
        <section className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold">
              Interchain Token{" "}
              {Boolean(tokenDetails.name && tokenDetails.symbol) && (
                <>
                  <span>&middot;</span>
                  <span className="text-primary text-base">
                    {tokenDetails.name}
                  </span>{" "}
                  <span className="text-base opacity-50">
                    ({tokenDetails.symbol})
                  </span>
                </>
              )}
            </div>
            {interchainToken?.tokenId && (
              <LinkButton
                className="flex items-center gap-2 text-base"
                href={`${interchainToken.chain.explorer.url}/token/${tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                <ChainIcon
                  src={interchainToken.chain.image}
                  alt={interchainToken.chain.name}
                  size="sm"
                />
                View token on {interchainToken.chain.explorer.name}
                <ExternalLink className="h-4 w-4 translate-x-1" />
              </LinkButton>
            )}
          </div>
          <ul className="grid gap-1.5">
            {[
              ["Name", tokenDetails.name],
              ["Symbol", tokenDetails.symbol],
              ["Decimals", tokenDetails.decimals],
              [
                "Token Address",
                <CopyToClipboardButton
                  key="token-address"
                  size="xs"
                  ghost
                  copyText={tokenAddress}
                >
                  {maskAddress(tokenAddress)}
                </CopyToClipboardButton>,
              ],
              ...(interchainToken?.tokenId
                ? [
                    [
                      "Token ID",
                      <CopyToClipboardButton
                        key="token-id"
                        size="xs"
                        ghost
                        copyText={interchainToken.tokenId}
                      >
                        {maskAddress(interchainToken.tokenId)}
                      </CopyToClipboardButton>,
                    ],
                  ]
                : []),
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <li
                  key={String(label)}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="font-semibold">{label}: </span>
                  <span className="opacity-60">{value}</span>
                </li>
              ))}
          </ul>
        </section>
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

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { address } = useAccount();
  const {
    data: interchainToken,
    refetch,
    error: interchainTokenError,
  } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  const { data: tokenDetails, error: tokenDetailsError } =
    trpc.gmp.getERC20TokenDetails.useQuery({
      chainId: props.chainId,
      tokenAddress: props.tokenAddress,
    });

  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([]);

  const [registered, unregistered] = Maybe.of(
    interchainToken?.matchingTokens
  ).mapOr(
    [[], []],
    partition((x) => x.isRegistered)
  );

  const [deployTokensTxHash, setDeployTokensTxHash] = useState<`0x${string}`>();

  const { mutateAsync: deployRemoteTokens, isLoading: isDeploying } =
    useDeployRemoteTokensMutation();

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
      .filter(([_, status]) => status === "executed")
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
    sourceChainId: interchainToken.chain.id,
    destinationChainIds: targetDeploymentChains,
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  const handleDeployRemoteTokens = useCallback(async () => {
    if (!(props.chainId && interchainToken?.tokenId && gasFees)) {
      return;
    }

    await deployRemoteTokens({
      destinationChainIds: targetDeploymentChains,
      tokenAddress: props.tokenAddress,
      tokenId: interchainToken.tokenId,
      gasFees,
      onStatusUpdate(status) {
        if (status.type === "deployed") {
          setDeployTokensTxHash(status.txHash);
        }
      },
    });
  }, [
    props.chainId,
    props.tokenAddress,
    interchainToken.tokenId,
    gasFees,
    deployRemoteTokens,
    targetDeploymentChains,
  ]);

  return (
    <div className="flex flex-col gap-8 md:relative">
      {interchainTokenError && tokenDetailsError && (
        <Alert status="error">{tokenDetailsError.message}</Alert>
      )}

      {interchainTokenError && tokenDetails && (
        <AddErc20
          trigger={
            <div className="mx-auto w-full max-w-md">
              <Button length="block">
                Register token on {interchainToken.chain.name}
              </Button>
            </div>
          }
          tokenDetails={{
            tokenAddress: props.tokenAddress,
            tokenDecimals: tokenDetails.decimals,
            tokenName: tokenDetails.name,
            tokenSymbol: tokenDetails.symbol,
            amountToMint: 0,
          }}
        />
      )}
      <InterchainTokenList
        title="Registered interchain tokens"
        tokens={registered}
      />
      <InterchainTokenList
        title="Unregistered interchain tokens"
        tokens={unregistered.map((token) => ({
          ...token,
          isSelected: selectedChainIds.includes(token.chainId),
          isRegistered: false,
          deploymentStatus:
            deployTokensTxHash && token.chain?.id
              ? statusesByChain[token.chain.id]
              : undefined,
        }))}
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
            <div className="bg-base-300 flex w-full items-center justify-between rounded-xl p-2 pl-4">
              {isGasPriceQueryLoading && <span>estimating gas fee... </span>}
              {gasFees && (
                <Tooltip
                  tip={`Estimated gas fee for deploying token on ${
                    selectedChainIds.length
                  } additional chain${selectedChainIds.length > 1 ? "s" : ""}`}
                >
                  <div className="flex items-center gap-1 text-sm">
                    ≈{" "}
                    <BigNumberText
                      decimals={18}
                      localeOptions={{
                        style: "decimal",
                        maximumFractionDigits: 4,
                      }}
                    >
                      {gasFees.reduce(
                        (acc, x) => acc.add(x),
                        BigNumber.from(0)
                      )}
                    </BigNumberText>{" "}
                    {getNativeToken(interchainToken.chain.id)}
                  </div>
                </Tooltip>
              )}
              {selectedChainIds.length > 0 && !deployTokensTxHash ? (
                <Button
                  color="accent"
                  onClick={handleDeployRemoteTokens}
                  disabled={isGasPriceQueryLoading || isGasPriceQueryError}
                  loading={isDeploying}
                >
                  Deploy token on {selectedChainIds.length} additional chain
                  {selectedChainIds.length > 1 ? "s" : ""}
                </Button>
              ) : undefined}
              {deployTokensTxHash && (
                <LinkButton
                  color="accent"
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
