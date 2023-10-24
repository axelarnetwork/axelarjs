import {
  Badge,
  Button,
  Card,
  cn,
  Drawer,
  ExternalLinkIcon,
  Footer,
  LinkButton,
  Modal,
  ThemeProvider,
  useTheme,
} from "@axelarjs/ui";
import type { FC, PropsWithChildren } from "react";
import Link from "next/link";

import sdkPkg from "@axelar-network/axelarjs-sdk/package.json";
import { Web3Modal } from "@web3modal/react";

import pkgJson from "~/../package.json";
import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "~/config/env";
import { ethereumClient } from "~/config/wagmi";
import { useChainFromRoute } from "~/lib/hooks";
import Appbar from "./Appbar";
import {
  LayoutStateProvider,
  useLayoutStateContainer,
} from "./MainLayout.state";
import { BOTTOM_MENU_ITEMS } from "./MainMenu";
import SignInModal from "./SignInModal";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  const [
    {
      isSignedIn,
      signInError,
      isDrawerOpen,
      isSignInModalOpen,
      DrawerSideContent,
      isTestnetBannerDismissed,
    },
    actions,
  ] = useLayoutStateContainer();

  const defaultChain = useChainFromRoute();

  const shouldRenderTestnetBanner =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" && !isTestnetBannerDismissed;

  return (
    <>
      <Drawer>
        <Drawer.Toggle checked={isDrawerOpen} />
        <Drawer.Content
          className={cn(
            "flex min-h-[100dvh] flex-1 flex-col gap-4 lg:min-h-screen",
            {
              "pointer-events-none": isSignInModalOpen,
            }
          )}
        >
          <Appbar />

          {children}

          <Footer
            className="bg-neutral text-neutral-content footer p-6 md:p-8 xl:p-10"
            center={true}
          >
            <div className="w-full max-w-4xl items-center justify-evenly md:flex">
              {BOTTOM_MENU_ITEMS.map((item, index) => (
                <nav key={index}>
                  <header className="footer-title">
                    {item.kind === "link" ? (
                      <Link
                        href={item.href}
                        className="hover:text-accent inline-flex hover:underline lg:uppercase"
                        rel={item.external ? "noopener noreferrer" : undefined}
                        target={item.external ? "_blank" : undefined}
                      >
                        {item.label}{" "}
                        {item.external && (
                          <ExternalLinkIcon className="h-[1em] w-[1em]" />
                        )}
                      </Link>
                    ) : (
                      <>
                        <Modal
                          trigger={
                            <a className="hover:text-accent cursor-pointer hover:underline lg:uppercase">
                              {item.label}
                            </a>
                          }
                        >
                          <Modal.Title>{item.label}</Modal.Title>
                          <Modal.Body>
                            {item.ModalContent && <item.ModalContent />}
                          </Modal.Body>
                        </Modal>
                      </>
                    )}
                  </header>
                </nav>
              ))}
            </div>
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
            <div className="text-accent flex items-center gap-2 text-right">
              <Badge className="hover:text-primary text-xs">
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://github.com/axelarnetwork/axelarjs/commit/${
                    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "main"
                  }`}
                >
                  app @ v{pkgJson.version}
                </Link>
              </Badge>
              <Badge className="hover:text-primary text-xs">
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://github.com/axelarnetwork/axelarjs-sdk/tree/v${sdkPkg.version}`}
                >
                  sdk @ v{sdkPkg.version}
                </Link>
              </Badge>
            </div>
          </Footer>

          {shouldRenderTestnetBanner && (
            <TestnetBanner onClose={actions.dismissTestnetBanner} />
          )}
          {isSignInModalOpen && (
            <SignInModal isSignedIn={isSignedIn} signInError={signInError} />
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
  <ThemeProvider>
    <LayoutStateProvider>
      <MainLayout {...props} />
    </LayoutStateProvider>
  </ThemeProvider>
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
