import {
  Button,
  Card,
  Dialog,
  Drawer,
  Footer,
  LinkButton,
  Loading,
  useTheme,
} from "@axelarjs/ui";
import { type FC, type PropsWithChildren } from "react";
import Link from "next/link";

import { Web3Modal } from "@web3modal/react";
import clsx from "clsx";
import { CheckCircleIcon, KeyIcon, XCircleIcon } from "lucide-react";

import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "~/config/env";
import { ethereumClient } from "~/config/wagmi";
import { useChainFromRoute } from "~/lib/hooks";
import pkg from "../../../package.json";
import Appbar from "./Appbar";
import {
  LayoutStateProvider,
  useLayoutStateContainer,
} from "./MainLayout.state";

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
          className={clsx(
            "flex min-h-[100dvh] flex-1 flex-col gap-4 lg:min-h-screen",
            {
              "pointer-events-none": isSignInModalOpen,
            }
          )}
        >
          <Appbar />
          {children}
          <div>
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
            <div className="bg-base-300 text-accent p-2 px-4 text-right">
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={`https://github.com/axelarnetwork/axelarjs/commit/${
                  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "main"
                }`}
              >
                {pkg.name} &middot; v{pkg.version}
              </Link>
            </div>
          </div>
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

const parseSignInErrorMessage = (error: Error) => {
  if ("shortMessage" in error) {
    return String(error.shortMessage);
  }
  return error.message;
};

const SignInModal = ({
  isSignedIn = false,
  signInError = undefined as undefined | null | Error,
  onAbort = () => {},
  // onRetry = () => {},
}) => {
  return (
    <Dialog open trigger={<></>}>
      <Dialog.Body className="grid place-items-center gap-6 py-8 md:min-h-[25vh] md:py-12">
        <div
          className={clsx(
            "swap-rotate swap relative grid h-16 w-16 place-items-center",
            {
              "swap-active": isSignedIn || signInError,
            }
          )}
        >
          {signInError ? (
            <XCircleIcon className="text-error swap-on h-12 w-12 md:h-16 md:w-16" />
          ) : (
            <CheckCircleIcon className="text-success swap-on h-12 w-12 md:h-16 md:w-16" />
          )}
          <div className="swap-off gird h-14 w-14 place-items-center md:h-16 md:w-16">
            <Loading className="absolute h-14 w-14 animate-pulse md:h-20 md:w-20" />
            <KeyIcon className="absolute left-[18px] top-[18px] h-7 w-7 animate-pulse md:left-4 md:top-5 md:h-10 md:w-10" />
          </div>
        </div>
        <div className="grid gap-1.5 text-center">
          {signInError ? (
            <>
              <span className="text-error/90 md:pt-8">
                {parseSignInErrorMessage(signInError)}
              </span>
              {/* <Button onClick={onRetry} length="block" variant="link" size="lg">
                retry signing in
              </Button> */}
            </>
          ) : (
            <>
              <span className="text-warning/70">Authentication required</span>
              <span>Please sign in with your wallet to continue</span>
              <Button
                onClick={onAbort}
                length="block"
                variant="link"
                size="lg"
                className="text-error/80"
              >
                cancel & exit
              </Button>
            </>
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};
