import { FC, PropsWithChildren, useMemo } from "react";
import Image from "next/image";

import {
  AxelarIcon,
  Button,
  Clamp,
  CopyToClipboardButton,
  Dropdown,
  Footer,
  Navbar,
  ThemeSwitcher,
  useTheme,
} from "@axelarjs/ui";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";

import { useAccount, useNetwork, useDisconnect, useSwitchNetwork } from "wagmi";

import { ethereumClient, WALLECTCONNECT_PROJECT_ID } from "~/config/wagmi";
import { APP_NAME } from "~/config/app";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";
import { EVMChainConfig } from "~/lib/api/axelarscan/types";
import { EVMChainsDropdown } from "~/components/EVMChainsDropdown";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { data: evmChains } = useEVMChainConfigsQuery();

  const selectedChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === chain?.id),
    [chain, evmChains]
  );

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
                <EVMChainsDropdown
                  onSwitchNetwork={switchNetworkAsync}
                  selectedChain={selectedChain}
                  chains={evmChains}
                />
                <CopyToClipboardButton size="sm" copyText={address} outline>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </CopyToClipboardButton>
                <Button size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => open()} color="primary">
                Connect Wallet
              </Button>
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
          "--w3m-logo-image-url": "/icons/favicon-32x32.png",
          "--w3m-accent-color": "var(--primary)",
          "--w3m-background-color": "var(--primary)",
        }}
      />
    </>
  );
};

export default MainLayout;
