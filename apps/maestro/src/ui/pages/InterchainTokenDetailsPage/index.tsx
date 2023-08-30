import { Alert } from "@axelarjs/ui";
import { unSluggify } from "@axelarjs/utils";
import type { FC } from "react";
import { useRouter } from "next/router";

import { isAddress } from "viem";

import { useChainFromRoute } from "~/lib/hooks";
import { useERC20TokenDetailsQuery } from "~/services/erc20/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import Page from "~/ui/layouts/Page";
import ConnectedInterchainTokensPage from "./ConnectedInterchainTokensPage";
import TokenDetailsSection from "./TokenDetailsSection";

export type InterchainTokensPageProps = {};

const InterchainTokensPage: FC<InterchainTokensPageProps> = () => {
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
