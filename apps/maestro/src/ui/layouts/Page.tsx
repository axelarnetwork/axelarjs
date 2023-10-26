import { Badge, Button, Clamp } from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import { cn } from "@axelarjs/ui/utils";
import { sluggify } from "@axelarjs/utils";
import { useCallback, useMemo, type ComponentProps } from "react";
import { GridLoader } from "react-spinners";
import Head from "next/head";
import { useRouter } from "next/router";

import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import RecentTransactions from "~/features/RecentTransactions/RecentTransactions";
import SearchInterchainToken from "~/features/SearchInterchainToken";
import { useChainFromRoute } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import ConnectWalletButton from "../compounds/ConnectWalletButton/ConnectWalletButton";

type PageState =
  | "loading"
  | "connected"
  | "disconnected"
  | "network-mismatch"
  | "unsupported-network";

interface Props extends ComponentProps<typeof Clamp> {
  pageTitle?: string;
  pageDescription?: string;
  mustBeConnected?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
}

const Page = ({
  pageTitle,
  pageDescription,
  mustBeConnected,
  className,
  children,
  isLoading,
  loadingMessage,
  ...props
}: Props) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const chainFromRoute = useChainFromRoute();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: evmChains } = useEVMChainConfigsQuery();

  const evmChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === chain?.id),
    [chain, evmChains]
  );

  const evmChainFromRoute = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === chainFromRoute?.id),
    [chainFromRoute, evmChains]
  );

  const pageState = useMemo<PageState>(() => {
    if (!mustBeConnected) {
      return "connected";
    }

    if (!isConnected) {
      return "disconnected";
    }

    if (chain && evmChains.length && !evmChain) {
      return "unsupported-network";
    }

    if (!evmChain) {
      return "loading";
    }

    if (chainFromRoute && evmChain?.chain_id !== chainFromRoute.id) {
      return "network-mismatch";
    }

    return "connected";
  }, [
    mustBeConnected,
    isConnected,
    chain,
    evmChains.length,
    evmChain,
    chainFromRoute,
  ]);

  const router = useRouter();

  const handleTokenFound = useCallback(
    async (result: {
      tokenAddress: string;
      tokenId?: string;
      chainName?: string;
    }) => {
      if (!result?.chainName) {
        return;
      }
      await router.push(
        `/${sluggify(result.chainName)}/${result?.tokenAddress}`
      );
    },
    [router]
  );

  const pageContent = useMemo(() => {
    switch (pageState) {
      case "loading":
        return <div>Loading...</div>;
      case "disconnected":
        return mustBeConnected ? (
          <div className="grid w-full flex-1 place-items-center">
            <div className="grid w-full flex-1 place-items-center">
              <SearchInterchainToken onTokenFound={handleTokenFound} />
              <div className="divider w-full max-w-lg">OR</div>
              <ConnectWalletButton className="w-full max-w-md" size="md" />
            </div>
            <section className="my-10 space-y-4">
              <div className="text-center text-xl font-bold">
                RECENT INTERCHAIN TRANSACTIONS
              </div>
              <RecentTransactions />
            </section>
          </div>
        ) : (
          children
        );
      case "unsupported-network":
        return (
          <div className="grid w-full flex-1 place-items-center">
            <div className="grid w-full place-items-center gap-4">
              <div className="grid gap-1 text-center text-xl font-semibold">
                <div>
                  You&apos;re connected to chain <Badge>{chain?.id}</Badge>{" "}
                  which is not a supported{" "}
                  <Badge>{process.env.NEXT_PUBLIC_NETWORK_ENV}</Badge> network.
                </div>
                <div>
                  Select a valid{" "}
                  <Badge>{process.env.NEXT_PUBLIC_NETWORK_ENV}</Badge> network
                  in your wallet.
                </div>
              </div>
            </div>
          </div>
        );
      case "network-mismatch":
        return !evmChain ? null : (
          <div className="grid w-full flex-1 place-items-center">
            <div className="grid w-full place-items-center gap-4">
              <div className="flex items-center gap-1 text-xl font-semibold">
                {`You're currently connected to ${evmChain.name} `}
                <ChainIcon
                  size="md"
                  src={String(evmChain.image)}
                  alt={evmChain.name}
                />
              </div>
              <Button
                variant="primary"
                length="block"
                className="max-w-md"
                onClick={() =>
                  switchNetworkAsync?.(evmChainFromRoute?.chain_id)
                }
              >
                Switch to {evmChainFromRoute?.name}
              </Button>
            </div>
          </div>
        );
      case "connected":
        return children;
    }
  }, [
    pageState,
    mustBeConnected,
    handleTokenFound,
    children,
    chain?.id,
    evmChain,
    evmChainFromRoute?.name,
    evmChainFromRoute?.chain_id,
    switchNetworkAsync,
  ]);

  const isExceptionalState = pageState !== "connected";

  return (
    <>
      <Head>
        {pageTitle && <title>{pageTitle}</title>}
        {pageDescription && (
          <meta name="description" content={pageDescription} />
        )}
      </Head>
      <Clamp
        $as="section"
        // id needed for the hero cta smooth scroll
        id="main-content"
        className={cn(
          "mt-20 grid min-h-[80dvh] flex-1 px-4 xl:px-2 2xl:px-0",
          {
            "place-items-center": isExceptionalState,
          },
          className
        )}
        {...props}
      >
        {pageContent}
      </Clamp>
      {isLoading && (
        <div className="absolute inset-0 grid place-items-center bg-black/20 backdrop-blur-sm">
          <div className="grid place-items-center gap-12 text-center">
            <GridLoader
              color="var(--primary)"
              className="animate-pulse [animation-duration:3s]"
            />
            <span>{loadingMessage || "loading page data..."}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Object.assign(Page, {
  Title: tw.h1`text-2xl font-bold`,
});
