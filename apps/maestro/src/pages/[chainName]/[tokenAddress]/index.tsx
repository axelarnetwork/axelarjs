import { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  CopyToClipboardButton,
  LinkButton,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils.js";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { partition, without } from "rambda";
import { useAccount } from "wagmi";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import { useDeployRemoteTokensMutation } from "~/compounds/AddErc20/hooks/useDeployRemoteTokensMutation";
import { InterchainTokenList } from "~/compounds/InterchainTokenList";
import Page from "~/layouts/Page";
import { useChainFromRoute } from "~/lib/hooks";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useEstimateGasFeeMultipleChains } from "~/services/axelarjsSDK/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";
import { GMPStatus } from "~/services/gmp/types";

const InterchainTokensPage = () => {
  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: string;
  };

  const routeChain = useChainFromRoute();

  const { data: interchainToken, isLoading } = useInterchainTokensQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  if (!isAddress(tokenAddress)) {
    return <div>Invalid token address</div>;
  }

  return (
    <Page
      mustBeConnected
      pageTitle={`Interchain Tokens - ${unSluggify(chainName)}`}
      className="!flex flex-1 flex-col gap-12 md:gap-16"
      isLoading={isLoading}
    >
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Interchain Token</h2>
          <div className="flex items-center">
            {interchainToken?.tokenAddress && (
              <CopyToClipboardButton
                copyText={tokenAddress}
                size="sm"
                ghost={true}
              >
                Token Address: {maskAddress(tokenAddress)}
              </CopyToClipboardButton>
            )}
            {interchainToken.tokenId && (
              <Tooltip
                tip={
                  "Token ID is an internal identifier used to correlate all instances of an ERC-20 token across all supported chains"
                }
                position="bottom"
              >
                <CopyToClipboardButton
                  copyText={interchainToken.tokenId}
                  size="sm"
                  ghost={true}
                >
                  Token ID: {maskAddress(interchainToken.tokenId)}
                </CopyToClipboardButton>{" "}
              </Tooltip>
            )}
          </div>
        </div>
      </section>
      {routeChain && (
        <ConnectedInterchainTokensPage
          chainId={routeChain?.id}
          tokenAddress={tokenAddress}
        />
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
  const { data: interchainToken, refetch } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
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
        {} as Record<string, "pending" | GMPStatus>
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
                  disabled={
                    isGasPriceQueryLoading ||
                    isGasPriceQueryError ||
                    Boolean(deployTokensTxHash)
                  }
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
                  View on axelarscan {maskAddress(deployTokensTxHash)}{" "}
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
