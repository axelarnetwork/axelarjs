import { useEffect, useState } from "react";

import { ThemeProvider } from "@axelarjs/ui";
import { Cabin } from "@next/font/google";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";

import "~/styles/globals.css";

import MainLayout from "~/layouts/MainLayout";

const fontSans = Cabin({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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
      {ready && (
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
}
