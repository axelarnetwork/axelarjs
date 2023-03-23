import { FC, useEffect, useState } from "react";

import { ThemeProvider } from "@axelarjs/ui";
import { Cabin } from "@next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "~/styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/config/wagmi";
import MainLayout from "~/layouts/MainLayout";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";

const fontSans = Cabin({ subsets: ["latin"] });

logger.configure({
  env:
    process.env.NODE_ENV === "development" ||
    ["preview", "development"].includes(String(process.env.VERCEL_ENV))
      ? "development"
      : "production",
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // indicate whether the app is rendered on the server
  const [isSSR, setIsSSR] = useState(true);

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
      <NextNProgress />
      {!isSSR && (
        <>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <WagmiConfigPropvider>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </WagmiConfigPropvider>
              <ReactQueryDevtools />
            </ThemeProvider>
          </QueryClientProvider>
        </>
      )}
    </>
  );
};

export default trpc.withTRPC(App);
