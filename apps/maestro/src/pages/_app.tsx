import { FC, useEffect, useState } from "react";

import { ThemeProvider } from "@axelarjs/ui";
import { Cabin } from "@next/font/google";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "~/styles/globals.css";

import MainLayout from "~/layouts/MainLayout";
import { trpc } from "~/lib/trpc";

const fontSans = Cabin({ subsets: ["latin"] });

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
          <ThemeProvider>
            <WagmiConfigPropvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </WagmiConfigPropvider>
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default trpc.withTRPC(App);
