import { ThemeProvider } from "@axelarjs/ui";
import { Toaster } from "@axelarjs/ui/toaster";
import { useState, type FC } from "react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Cabin } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "@mysten/dapp-kit/dist/index.css";
import "~/lib/polyfills";
import "~/styles/globals.css";

import { SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";

import { NEXT_PUBLIC_GA_MEASUREMENT_ID } from "~/config/env";
import { queryClient as wagmiQueryClient } from "~/config/wagmi";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import MainLayout from "~/ui/layouts/MainLayout";
import NProgressBar from "~/ui/layouts/NProgressBar";

import "@tanstack/react-query";

import { SUI_RPC_URLS } from "@axelarjs/core";

import { AuthProvider } from "~/contexts/AuthContext";

// Dynamically import wallet providers with ssr disabled
const StellarWalletProviderClient = dynamic(
  () =>
    import("~/lib/providers/StellarWalletKitProvider").then(
      (mod) => mod.StellarWalletKitProvider
    ),
  { ssr: false }
);

const SuiWalletProviderClient = dynamic(
  () =>
    import("@mysten/dapp-kit").then((mod) => ({
      default: ({ children }: { children: React.ReactNode }) => (
        <mod.WalletProvider
          autoConnect
          preferredWallets={["Suiet", "Sui Wallet"]}
        >
          {children}
        </mod.WalletProvider>
      ),
    })),
  { ssr: false }
);

const networks = {
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: SUI_RPC_URLS.testnet },
  mainnet: { url: SUI_RPC_URLS.mainnet },
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
  const [queryClient] = useState(() => wagmiQueryClient);

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
                <StellarWalletProviderClient>
                  <SuiWalletProviderClient>
                    <AuthProvider>
                      <MainLayout>
                        <Component {...pageProps} />
                      </MainLayout>
                      <ReactQueryDevtools />
                      <Toaster />
                    </AuthProvider>
                  </SuiWalletProviderClient>
                </StellarWalletProviderClient>
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
