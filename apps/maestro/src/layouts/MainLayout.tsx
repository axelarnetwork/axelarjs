import {
  Badge,
  Button,
  Card,
  Clamp,
  Drawer,
  Footer,
  LinkButton,
  useTheme,
} from "@axelarjs/ui";
import type { FC, PropsWithChildren } from "react";

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

  const [
    { isDrawerOpen, DrawerSideContent, isTestnetBannerDismissed },
    actions,
  ] = useLayoutStateContainer();

  const defaultChain = useChainFromRoute();

  const shouldRenderTestnetBanner =
    process.env.NEXT_PUBLIC_NETWORK_ENV === "mainnet" &&
    !isTestnetBannerDismissed;

  return (
    <>
      <Drawer>
        <Drawer.Toggle checked={isDrawerOpen} />
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
                variant="accent"
              >
                env: {process.env.NEXT_PUBLIC_NETWORK_ENV}
              </Badge>
            )}
          </Footer>
          {shouldRenderTestnetBanner && (
            <TestnetBanner onClose={actions.dismissTestnetBanner} />
          )}
        </Drawer.Content>
        <Drawer.Side>
          <Drawer.Overlay onClick={actions.closeDrawer} />
          <aside className="bg-base-100 text-base-content h-full w-full max-w-xs p-4">
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

const TestnetBanner = ({ onClose = () => {} }) => (
  <Card
    className="bg-base-200 absolute bottom-2 left-2 max-w-xs sm:bottom-4 sm:left-4"
    compact
  >
    <Card.Body>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={onClose}
      >
        ✕
      </Button>
      <Card.Title>New to Maestro?</Card.Title>
      <p>
        Run a few flows in our testnet (with test tokens) and experiment here
        with small amounts first.
      </p>
      <Card.Actions className="justify-end">
        <LinkButton variant="accent" size="xs">
          Go to testnet
        </LinkButton>
      </Card.Actions>
    </Card.Body>
  </Card>
);
