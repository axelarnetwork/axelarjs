import { FC, PropsWithChildren } from "react";

import {
  AxelarIcon,
  Button,
  Clamp,
  CopyToClipboardButton,
  Footer,
  Navbar,
  ThemeSwitcher,
  useTheme,
} from "@axelarjs/ui";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";

import { useAccount, useNetwork, useDisconnect, useSwitchNetwork } from "wagmi";

import {
  CHAIN_CONFIGS,
  ethereumClient,
  WALLECTCONNECT_PROJECT_ID,
} from "~/config/wagmi";
import { APP_NAME } from "~/config/app";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";
import Image from "next/image";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { data: evmChains } = useEVMChainConfigsQuery();

  const currentChain = evmChains?.find((c) => c.chain_id === chain?.id);

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
                {currentChain && (
                  <div className="dropdown">
                    <Button
                      tabIndex={0}
                      className="flex items-center gap-2"
                      ghost
                      size="sm"
                    >
                      <Image
                        className="rounded-full"
                        src={currentChain.image}
                        alt={currentChain.chain_name}
                        width={18}
                        height={18}
                      />
                      <div>{currentChain.chain_name}</div>
                    </Button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 -translate-x-1"
                    >
                      {evmChains?.map((chain) => (
                        <li key={chain.chain_id}>
                          {/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
                          <a
                            href="#"
                            role="button"
                            onClick={(e) => {
                              e.preventDefault();
                              try {
                                switchNetworkAsync?.(chain.chain_id);
                              } catch (error) {}
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Image
                                className="rounded-full"
                                src={chain.image}
                                alt={chain.chain_name}
                                width={18}
                                height={18}
                              />
                              <div>{chain.chain_name}</div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
