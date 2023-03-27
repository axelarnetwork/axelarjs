import React, { useMemo } from "react";

import { Button } from "@axelarjs/ui";
import clsx from "clsx";
import Head from "next/head";
import tw from "tailwind-styled-components";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import ConnectWalletButton from "~/compounds/ConnectWalletButton";
import { useChainFromRoute } from "~/lib/hooks";

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

  const pageState = useMemo<PageState>(() => {
    if (!chain) {
      return "loading";
    }

    if (!mustBeConnected) {
      return "connected";
    }

    if (!isConnected) {
      return "disconnected";
    }

    if (chainFromRoute && chain?.id !== chainFromRoute.id) {
      return "network-mismatch";
    }

    return "connected";
  }, [chain, mustBeConnected, isConnected, chainFromRoute]);

  const pageContent = useMemo(() => {
    switch (pageState) {
      case "loading":
        return <div>Loading...</div>;
      case "disconnected":
        return <ConnectWalletButton />;
      case "network-mismatch":
        return (
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold">
              You are connected to {chain?.name}
            </h1>

            <Button
              color="primary"
              length="block"
              onClick={() => switchNetworkAsync?.(chainFromRoute?.id)}
            >
              Switch to {chainFromRoute?.name}
            </Button>
          </div>
        );
      case "connected":
        return children;
    }
  }, [
    chain?.name,
    chainFromRoute?.id,
    chainFromRoute?.name,
    children,
    pageState,
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
