import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { trpc } from "~/lib/trpc";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import Page from "~/ui/layouts/Page";

const TokenDetailsRedirectPage = () => {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading interchain token..."
  );
  const [errorMessage, setErrorMessage] = useState("");

  const { combinedComputed, isLoading: isLoadingChains } =
    useAllChainConfigsQuery();

  const { tokenId } = router.query;

  const { data: interchainToken, isLoading: isLoadingToken } =
    trpc.interchainToken.getInterchainTokenByTokenId.useQuery({
      tokenId: tokenId as string,
    });

  const isLoading = isLoadingToken || isLoadingChains;

  useEffect(() => {
    if (!interchainToken) {
      if (!isLoading) {
        setErrorMessage("Interchain token not found");
      }
      return;
    }

    const wagmiChain = combinedComputed.wagmiChains.find(
      (c) => c.axelarChainId === interchainToken.axelarChainId
    );

    setLoadingMessage("Redirecting...");

    if (!wagmiChain) {
      setErrorMessage("Axelar chain not found");
      return;
    }

    router
      .push(
        `/${wagmiChain.axelarChainName.toLowerCase()}/${
          interchainToken.tokenAddress
        }`
      )
      .catch(() => {
        setErrorMessage("Error redirecting to token details page");
      });
  }, [
    combinedComputed.indexedById,
    combinedComputed.wagmiChains,
    interchainToken,
    isLoading,
    router,
  ]);

  return (
    <Page isLoading={isLoading} loadingMessage={loadingMessage}>
      {!interchainToken && !isLoading && (
        <div className="grid place-items-center">{errorMessage}</div>
      )}
    </Page>
  );
};

export default TokenDetailsRedirectPage;
