import { FC, PropsWithChildren, useEffect } from "react";

import { Clamp, Footer, useTheme } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import { ethereumClient, WALLECTCONNECT_PROJECT_ID } from "~/config/wagmi";

import Appbar from "./Appbar";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const { chain, chains } = useNetwork();

  const { chainName } = useRouter().query;

  const { setDefaultChain } = useWeb3Modal();

  // set default chain from url
  useEffect(() => {
    if (typeof chainName === "string") {
      const targetChain = chains.find(
        (chain) => sluggify(chain.name) === chainName
      );
      if (targetChain?.id && targetChain.id !== chain?.id) {
        setDefaultChain(targetChain);
      }
    }
  }, [chainName, chain, chains, setDefaultChain]);

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col gap-4">
        <Appbar />
        <Clamp $as="main" className="flex flex-1">
          {children}
        </Clamp>
        <Footer className="bg-neutral text-neutral-content p-8" center={true}>
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
