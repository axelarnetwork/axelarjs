import React from "react";

import clsx from "clsx";
import Head from "next/head";
import tw from "tailwind-styled-components";
import { useAccount } from "wagmi";

import ConnectWalletButton from "~/compounds/ConnectWalletButton";

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
            "place-items-center": !(mustBeConnected || isConnected),
          },
          className
        )}
        {...props}
      >
        {mustBeConnected && !isConnected ? (
          <ConnectWalletButton size="md" className="w-full max-w-sm" />
        ) : (
          <>{children}</>
        )}
      </section>
    </>
  );
};

export default Object.assign(Page, {
  Title: tw.h1`text-2xl font-bold`,
});
