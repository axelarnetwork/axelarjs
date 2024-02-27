import { ThemeProvider } from "@axelarjs/ui";
import { Toaster } from "@axelarjs/ui/toaster";
import { useEffect, useState, type FC } from "react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Cabin } from "next/font/google";
import Script from "next/script";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "~/lib/polyfills";
import "~/styles/globals.css";

import { NEXT_PUBLIC_GA_MEASUREMENT_ID } from "~/config/env";
import { queryClient as wagmiQueryClient } from "~/config/wagmi";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import MainLayout from "~/ui/layouts/MainLayout";
import NProgressBar from "~/ui/layouts/NProgressBar";

const fontSans = Cabin({ subsets: ["latin"] });

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
          }
        `}
      </style>

      <GoogleAnalytics measurementId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      <NProgressBar />

      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider>
            <WagmiConfigPropvider>
              {!isSSR && (
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              )}
              <ReactQueryDevtools />
              <Toaster />
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
