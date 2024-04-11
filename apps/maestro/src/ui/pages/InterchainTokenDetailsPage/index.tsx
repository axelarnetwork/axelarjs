import { Alert } from "@axelarjs/ui";
import type { FC } from "react";
import { useRouter } from "next/router";

import { isAddress } from "viem";

import { useChainFromRoute } from "~/lib/hooks";
import { getPrefilledClaimOwnershipFormLink } from "~/lib/utils/gform";
import { useERC20TokenDetailsQuery } from "~/services/erc20/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import Page from "~/ui/layouts/Page";
import ConnectedInterchainTokensPage from "./ConnectedInterchainTokensPage";
import TokenDetailsSection from "./TokenDetailsSection";

const InterchainTokensPage: FC = () => {
  const { tokenAddress } = useRouter().query as {
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
    tokenAddress,
  });

  const { data: tokenDetails } = useERC20TokenDetailsQuery({
    chainId: routeChain?.id,
    tokenAddress,
  });

  if (!isAddress(tokenAddress)) {
    return <Alert $status="error">Invalid token address</Alert>;
  }

  const chainNames =
    interchainToken?.matchingTokens
      ?.filter((token) => token.isRegistered)
      ?.map((token) => token.axelarChainId) || [];

  return (
    <Page
      pageTitle={`Interchain Tokens - ${routeChain?.name}`}
      contentClassName="!flex flex-1 flex-col gap-12 md:gap-16"
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
          wasDeployedByAccount={interchainToken.wasDeployedByAccount}
          tokenId={interchainToken?.tokenId}
          tokenManagerAddress={interchainToken?.tokenManagerAddress}
          kind={interchainToken?.kind}
          claimOwnershipFormLink={getPrefilledClaimOwnershipFormLink(
            interchainToken.chain.name,
            chainNames,
            "Interchain Token Service (ITS)",
            tokenAddress
          )}
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
