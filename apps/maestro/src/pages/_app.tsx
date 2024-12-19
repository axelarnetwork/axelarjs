import { ThemeProvider } from "@axelarjs/ui";
import { Toaster } from "@axelarjs/ui/toaster";
import { useEffect, useState, type FC } from "react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Cabin } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "@mysten/dapp-kit/dist/index.css";
import "~/lib/polyfills";
import "~/styles/globals.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";

import { NEXT_PUBLIC_GA_MEASUREMENT_ID } from "~/config/env";
import { queryClient as wagmiQueryClient } from "~/config/wagmi";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import MainLayout from "~/ui/layouts/MainLayout";
import NProgressBar from "~/ui/layouts/NProgressBar";

import "@tanstack/react-query";

// type NetworkEnv = "mainnet" | "testnet" | "devnet" | "localnet";

const networks = {
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

const fontSans = Cabin({ subsets: ["latin"] });
const clashGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/ClashGrotesk-Extralight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashGrotesk-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashGrotesk-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashGrotesk-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashGrotesk-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashGrotesk-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-grotesk",
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // indicate whether the app is rendered on the server
  const [isSSR, setIsSSR] = useState(true);
  const [queryClient] = useState(() => wagmiQueryClient);

  // set isSSR to false on the first client-side render
  useEffect(() => setIsSSR(false), []);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
            --font-clash-grotesk: ${clashGrotesk.style.fontFamily};
          }
        `}
      </style>

      <GoogleAnalytics measurementId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      <NProgressBar />

      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider>
            <WagmiConfigPropvider>
              <SuiClientProvider
                networks={networks}
                network={
                  process.env.NEXT_PUBLIC_NETWORK_ENV === "mainnet"
                    ? "mainnet"
                    : "testnet"
                }
              >
                <WalletProvider autoConnect>
                  {!isSSR && (
                    <MainLayout>
                      <Component {...pageProps} />
                    </MainLayout>
                  )}
                  <ReactQueryDevtools />
                  <Toaster />
                </WalletProvider>
              </SuiClientProvider>
            </WagmiConfigPropvider>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
};

export default trpc.withTRPC(App);

logger.configure({
  env:
    process.env.NODE_ENV === "development" ||
    ["preview", "development"].includes(String(process.env.VERCEL_ENV))
      ? "development"
      : "production",
});

const GoogleAnalytics = ({ measurementId = "" }) => {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${measurementId}');
      `}
      </Script>
    </>
  );
};
