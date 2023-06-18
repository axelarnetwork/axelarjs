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

import { ExternalLink } from "lucide-react";
import { partition, without } from "rambda";
import { isAddress } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { useDeployRemoteTokensMutation } from "~/features/AddErc20/hooks/useDeployRemoteTokensMutation";
import { InterchainTokenList } from "~/features/InterchainTokenList";
import Page from "~/layouts/Page";
import { useInterchainTokenServiceRegisterOriginToken } from "~/lib/contract/hooks/useInterchainTokenService";
import { useChainFromRoute } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransaction";
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
      {tokenDetails && (
        <section className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 text-2xl font-bold">
              <span className="hidden sm:inline">Interchain Token </span>
              {Boolean(tokenDetails.name && tokenDetails.symbol) && (
                <>
                  <span className="hidden sm:inline">&middot;</span>
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
                View token
                <span className="hidden sm:inline">
                  {" "}
                  on {interchainToken.chain.explorer.name}
                </span>
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

const INTERCHAIN_TOKEN_SERVICE_ADDRESS = String(
  process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
) as `0x${string}`;

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

  const { writeAsync, data } = useInterchainTokenServiceRegisterOriginToken({
    address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  });

  useWaitForTransaction({
    hash: data?.hash,
    confirmations: 10,
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
      setTxState({
        status: "reverted",
        error: error as Error,
      });
    }
  }, [address, setTxState, writeAsync]);

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "awaiting_approval":
        return "Approve transaction";
      case "submitted":
        return "Waiting for confirmation...";
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
    sourceChainId: interchainToken.chain.id,
    destinationChainIds: targetDeploymentChains,
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  const { mutateAsync: deployRemoteTokens, isLoading: isDeploying } =
    useDeployRemoteTokensMutation(
      gasFees?.reduce((acc, x) => acc + x, BigInt(0)) ?? BigInt(0)
    );

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
        <div className="mx-auto w-full max-w-md">
          {address ? (
            <RegisterOriginTokenButton
              address={props.tokenAddress}
              chainName={interchainToken.chain.name}
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
                      {gasFees.reduce((a, b) => a + b)}
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
