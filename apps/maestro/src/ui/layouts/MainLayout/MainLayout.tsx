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
  Tooltip,
  useTheme,
  XCircleIcon,
} from "@axelarjs/ui";
import { useEffect, type FC, type PropsWithChildren } from "react";
import Markdown from "react-markdown";
import Link from "next/link";

import sdkPkg from "@axelar-network/axelarjs-sdk/package.json";
import { useWeb3ModalTheme } from "@web3modal/wagmi/react";

import pkgJson from "~/../package.json";
import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
} from "~/config/env";
import { TransactionsProvider } from "~/features/Transactions";
import { trpc } from "~/lib/trpc";
import Appbar from "./Appbar";
import {
  LayoutStateProvider,
  useLayoutStateContainer,
} from "./MainLayout.state";
import { BOTTOM_MENU_ITEMS } from "./MainMenu";
import SignInModal from "./SignInModal";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const { setThemeMode } = useWeb3ModalTheme();

  const { data: globalMessage } = trpc.messages.getGlobalMessage.useQuery();

  // sync theme with web3modal
  useEffect(
    () => setThemeMode(theme ?? "light"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const [
    {
      isSignedIn,
      signInError,
      isDrawerOpen,
      isSignInModalOpen,
      DrawerSideContent,
      isTestnetBannerDismissed,
      isGlobalBannerDismissed,
    },
    actions,
  ] = useLayoutStateContainer();

  const shouldRenderTestnetBanner =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" && !isTestnetBannerDismissed;

  return (
    <>
      <Drawer>
        <Drawer.Toggle
          checked={isDrawerOpen}
          name="drawer-toggle"
          aria-label="toggle drawer"
        />
        <Drawer.Content
          className={cn(
            "flex min-h-[100dvh] flex-1 flex-col gap-4 lg:min-h-screen",
            {
              "pointer-events-none": isSignInModalOpen,
            }
          )}
        >
          {globalMessage && !isGlobalBannerDismissed && (
            <div
              role="alert"
              className="bg-warning text-warning-content sticky top-0 z-20 p-4 px-8 text-center"
            >
              <Markdown>{globalMessage.content}</Markdown>

              <Tooltip
                tip="Dismiss this messages"
                className="text-error absolute right-4 top-4"
                position="left"
              >
                <button onClick={actions.dismissGlobalBanner}>
                  <XCircleIcon />
                </button>
              </Tooltip>
            </div>
          )}
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
                            <a
                              role="button"
                              className="hover:text-accent cursor-pointer hover:underline lg:uppercase"
                              onClick={(e) => e.preventDefault()}
                            >
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
    </>
  );
};

const WithProvider: FC<PropsWithChildren> = (props) => (
  <ThemeProvider>
    <LayoutStateProvider>
      <TransactionsProvider>
        <MainLayout {...props} />
      </TransactionsProvider>
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
        We encourage you to experiment with{" "}
        <a href={process.env.NEXT_PUBLIC_TESTNET_URL}>testnet</a> first!
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
