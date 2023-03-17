import { FC, PropsWithChildren, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { Cabin } from "@next/font/google";
import {
  AxelarIcon,
  Button,
  Clamp,
  Footer,
  Navbar,
  ThemeSwitcher,
  ThemeProvider,
  useTheme,
} from "@axelarjs/ui";
import { Web3Button, Web3Modal } from "@web3modal/react";
import NextNProgress from "nextjs-progressbar";
import { useAccount, useDisconnect } from "wagmi";

import { WagmiConfigPropvider } from "~/lib/providers/WagmiConfigPropvider";
import { ethereumClient, WALLECTCONNECT_PROJECT_ID } from "~/config/wagmi";
import { APP_NAME } from "~/config/app";
import "~/styles/globals.css";

const fontSans = Cabin({ subsets: ["latin"] });

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const theme = useTheme();

  return (
    <>
      <div className="min-h-screen flex flex-col flex-1 gap-4">
        <Navbar className="bg-base-200">
          <Navbar.Start>
            <div className="flex items-center gap-2 text-lg font-bold uppercase">
              <AxelarIcon className="h-6 w-6 dark:invert" />
              {APP_NAME}
            </div>
          </Navbar.Start>
          <Navbar.End className="flex items-center gap-2">
            {isConnected && address ? (
              <>
                <Button size="sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
                <Button size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Web3Button icon="hide" label="Connect Wallet" />
            )}
            <ThemeSwitcher />
          </Navbar.End>
        </Navbar>
        <Clamp $as="main" className="flex-1">
          {children}
        </Clamp>
        <Footer className="p-8 bg-neutral text-neutral-content" center>
          <Footer.Title>
            &copy;{new Date().getFullYear()} &middot; Powered by AxelarUI
          </Footer.Title>
        </Footer>
      </div>
      <Web3Modal
        projectId={WALLECTCONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeMode={theme ?? "light"}
        themeVariables={{
          "--w3m-font-family": "var(--font-sans)",
        }}
      />
    </>
  );
};

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
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WagmiConfigPropvider>
          </ThemeProvider>
        </>
      )}
    </>
  );
}
