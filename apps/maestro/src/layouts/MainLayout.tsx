import { FC, PropsWithChildren } from "react";

import { Badge, Clamp, Drawer, Footer, useTheme } from "@axelarjs/ui";
import { Web3Modal } from "@web3modal/react";

import { ethereumClient, WALLECTCONNECT_PROJECT_ID } from "~/config/wagmi";
import { useChainFromRoute } from "~/lib/hooks";

import Appbar from "./Appbar";
import {
  LayoutStateProvider,
  useLayoutStateContainer,
} from "./MainLayout.state";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  const [{ isOpen, DrawerSideContent }, actions] = useLayoutStateContainer();

  const defaultChain = useChainFromRoute();

  return (
    <>
      <Drawer>
        <Drawer.Toggle checked={isOpen} />
        <Drawer.Content className="flex min-h-screen flex-1 flex-col gap-4">
          <Appbar />
          <Clamp $as="main" className="flex flex-1">
            {children}
          </Clamp>
          <Footer className="bg-neutral text-neutral-content p-8" center={true}>
            <Footer.Title>
              &copy;{new Date().getFullYear()} &middot; Powered by AxelarUI
            </Footer.Title>
            {process.env.NEXT_PUBLIC_NETWORK_ENV !== "mainnet" && (
              <Badge
                className="absolute right-4 lowercase"
                size="lg"
                color="accent"
              >
                env: {process.env.NEXT_PUBLIC_NETWORK_ENV}
              </Badge>
            )}
          </Footer>
        </Drawer.Content>
        <Drawer.Side>
          <Drawer.Overlay onClick={actions.close} />
          <aside className="bg-base-100 text-base-content w-full max-w-xs p-4">
            <DrawerSideContent />
          </aside>
        </Drawer.Side>
      </Drawer>
      <Web3Modal
        projectId={WALLECTCONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeMode={theme ?? "light"}
        defaultChain={defaultChain}
        walletImages={{
          coinbaseWallet:
            "https://raw.githubusercontent.com/WalletConnect/web3modal/V2/laboratory/public/images/wallet_coinbase.webp",
        }}
        themeVariables={{
          "--w3m-font-family": "var(--font-sans)",
          "--w3m-logo-image-url": "/icons/favicon-32x32.png",
          "--w3m-accent-color": "var(--primary)",
          "--w3m-background-color": "var(--primary)",
        }}
      />
    </>
  );
};

const WithProvider: FC<PropsWithChildren> = (props) => (
  <LayoutStateProvider>
    <MainLayout {...props} />
  </LayoutStateProvider>
);

WithProvider.displayName = "MainLayout";

export default WithProvider;
