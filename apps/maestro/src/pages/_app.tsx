import { useEffect, useState, type FC } from "react";

import { ThemeProvider, Toaster } from "@axelarjs/ui";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { Cabin } from "next/font/google";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "~/styles/globals.css";

import { queryClient as wagmiQueryClient } from "~/config/wagmi";
import MainLayout from "~/layouts/MainLayout";
import NProgressBar from "~/layouts/NProgressBar";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";

const fontSans = Cabin({ subsets: ["latin"] });

initTelemetryAsync().then((initialized) => {
  if (initialized) {
    logger.info("Telemetry initialized");
  }
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // indicate whether the app is rendered on the server
  const [isSSR, setIsSSR] = useState(true);
  const [queryClient] = useState(() => wagmiQueryClient);

  // set isSSR to false on the first client-side render
  useEffect(() => setIsSSR(false), []);

  return (
    <>
      <style jsx={true} global={true}>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <NProgressBar />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider>
            <WagmiConfigPropvider>
              {!isSSR && (
                <>
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                </>
              )}
              <ReactQueryDevtools />
              <Toaster />
            </WagmiConfigPropvider>
          </ThemeProvider>
        </Hydrate>
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

async function initTelemetryAsync() {
  if (process.env.NODE_ENV !== "development") {
    const { initLogRocket } = await import("~/config/telemetry");

    initLogRocket();

    return true;
  }
  return false;
}
