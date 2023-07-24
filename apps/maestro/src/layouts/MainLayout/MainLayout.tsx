import {
  Button,
  Card,
  Drawer,
  Footer,
  LinkButton,
  Loading,
  Modal,
  useTheme,
} from "@axelarjs/ui";
import { useState, type FC, type PropsWithChildren } from "react";
import Link from "next/link";

import { Web3Modal } from "@web3modal/react";
import clsx from "clsx";
import { CheckCircleIcon, KeyIcon } from "lucide-react";

import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "~/config/env";
import { ethereumClient } from "~/config/wagmi";
import { useChainFromRoute } from "~/lib/hooks";
import { useWeb3SignIn } from "~/lib/hooks/useWeb3SignIn";
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

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const defaultChain = useChainFromRoute();

  const shouldRenderTestnetBanner =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" && !isTestnetBannerDismissed;

  useWeb3SignIn({
    onSignInStart() {
      setShowSignInModal(true);
    },
    onSignInSuccess() {
      if (NEXT_PUBLIC_NETWORK_ENV !== "mainnet") {
        console.log("session initiated");
      }
      setIsSignedIn(true);

      setTimeout(() => {
        setShowSignInModal(false);
      }, 1000);
    },
  });

  return (
    <>
      <Drawer>
        <Drawer.Toggle checked={isDrawerOpen} />
        <Drawer.Content className="flex min-h-[100dvh] flex-1 flex-col gap-4 lg:min-h-screen">
          <Appbar />
          {children}
          <Footer
            className="bg-neutral text-neutral-content p-6 md:p-8 xl:p-10"
            center={true}
          >
            <div className="flex items-center text-sm">
              &copy;{new Date().getFullYear()} <span>&middot;</span>
              <Link
                rel="noopener noreferrer"
                href="https://axelar.network"
                target="_blank"
                className="text-accent"
              >
                Axelar Network
              </Link>
            </div>
          </Footer>
          {shouldRenderTestnetBanner && (
            <TestnetBanner onClose={actions.dismissTestnetBanner} />
          )}
          {showSignInModal && (
            <Modal open hideCloseButton>
              <Modal.Body className="grid place-items-center gap-4 py-8">
                <div
                  className={clsx(
                    "swap-rotate swap relative grid h-16 w-16 place-items-center",
                    { "swap-active": isSignedIn }
                  )}
                >
                  <CheckCircleIcon className="text-success swap-on h-16 w-16" />
                  <Loading className="swap-off absolute h-16 w-16 animate-pulse" />
                  <KeyIcon className="swap-off absolute h-8 w-8 animate-pulse" />
                </div>
                <div>Authentication required</div>
                <div className="grid">
                  Please sign the message to continue using the app.
                </div>
              </Modal.Body>
            </Modal>
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
        projectId={NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeMode={theme ?? "dark"}
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
    className="bg-base-200 fixed bottom-2 left-2 max-w-xs sm:bottom-4 sm:left-4"
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
      <Card.Title>New to the Interchain Token Service?</Card.Title>
      <p>
        Run a few flows in our testnet (with test tokens) and experiment here
        with small amounts first.
      </p>
      <Card.Actions className="justify-end">
        <LinkButton
          variant="accent"
          size="xs"
          href={process.env.NEXT_PUBLIC_TESTNET_URL}
        >
          Go to testnet
        </LinkButton>
      </Card.Actions>
    </Card.Body>
  </Card>
);
