import React, { useMemo } from "react";

import { Button } from "@axelarjs/ui";
import clsx from "clsx";
import Head from "next/head";
import tw from "tailwind-styled-components";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import ConnectWalletButton from "~/compounds/ConnectWalletButton";
import { useChainFromRoute } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

type PageState = "loading" | "connected" | "disconnected" | "network-mismatch";

type Props = JSX.IntrinsicElements["section"] & {
  pageTitle?: string;
  pageDescription?: string;
  mustBeConnected?: boolean;
};

const Page = ({
  pageTitle,
  pageDescription,
  mustBeConnected,
  className,
  children,
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

    if (!evmChain) {
      return "loading";
    }

    if (chainFromRoute && evmChain?.chain_id !== chainFromRoute.id) {
      return "network-mismatch";
    }

    return "connected";
  }, [evmChain, mustBeConnected, isConnected, chainFromRoute]);

  const pageContent = useMemo(() => {
    switch (pageState) {
      case "loading":
        return <div>Loading...</div>;
      case "disconnected":
        return (
          <ConnectWalletButton size="md" length="block" className="max-w-md" />
        );
      case "network-mismatch":
        return (
          <div className="grid w-full place-items-center gap-2">
            <div className="text-2xl font-semibold">
              You are connected to <span>{evmChain?.name}</span>
            </div>
            <Button
              color="primary"
              length="block"
              className="max-w-md"
              onClick={() => switchNetworkAsync?.(evmChainFromRoute?.chain_id)}
            >
              Switch to {evmChainFromRoute?.name}
            </Button>
          </div>
        );
      case "connected":
        return children;
    }
  }, [
    pageState,
    evmChain?.name,
    evmChainFromRoute?.name,
    evmChainFromRoute?.chain_id,
    children,
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

      <section
        className={clsx(
          "grid flex-1",
          {
            "place-items-center": isExceptionalState,
          },
          className
        )}
        {...props}
      >
        {pageContent}
      </section>
    </>
  );
};

export default Object.assign(Page, {
  Title: tw.h1`text-2xl font-bold`,
});
