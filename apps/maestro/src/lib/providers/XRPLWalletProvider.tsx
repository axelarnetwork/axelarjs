import { invariant } from "@axelarjs/utils";
// export default function WalletProvider({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const xrplWallets = useMemo(() => {
//     const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];

//     const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
//     if (walletConnectProjectId && walletConnectProjectId.length > 0) {
//       const walletConnectWallet = new WalletConnectWallet({
//         projectId: walletConnectProjectId,
//         networks: [(xrplChainConfig as any).xrplNetwork],
//         desktopWallets: [],
//         mobileWallets: [],
//       });

//       availableWallets.push(walletConnectWallet);
//     }

//     const xamanApiKey = process.env.NEXT_PUBLIC_XAMAN_API_KEY;
//     if (xamanApiKey && xamanApiKey.length > 0) {
//       const xamanWallet = new XamanWallet(xamanApiKey);

//       availableWallets.push(xamanWallet);
//     }
//     // this invariant captures that this needs to return at least one available wallet, otherwise the app will never load
//     invariant(availableWallets.length > 0);

//     return availableWallets;
//   }, []);

//   if (xrplWallets.length === 0) return null;

//   return <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>{children}</StandardWalletProvider>
// }
import {
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

import { type XRPLBaseWallet } from "@xrpl-wallet-adapter/base";
import { CrossmarkWallet } from "@xrpl-wallet-adapter/crossmark";
import { WalletConnectWallet } from "@xrpl-wallet-adapter/walletconnect";
import { XamanWallet } from "@xrpl-wallet-adapter/xaman";
import type { WalletProviderProps } from "@xrpl-wallet-standard/react";

import { xrplChainConfig } from "~/config/chains";

type GenericProviderComponent = FC<WalletProviderProps> | null;

export const XrplWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ProviderComponent, setProviderComponent] =
    useState<GenericProviderComponent>(null);

  const xrplWallets = useMemo(() => {
    const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];

    const walletConnectProjectId =
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    if (walletConnectProjectId && walletConnectProjectId.length > 0) {
      const walletConnectWallet = new WalletConnectWallet({
        projectId: walletConnectProjectId,
        networks: [(xrplChainConfig as any).xrplNetwork],
        desktopWallets: [],
        mobileWallets: [],
      });

      availableWallets.push(walletConnectWallet);
    }

    const xamanApiKey = process.env.NEXT_PUBLIC_XAMAN_API_KEY;
    if (xamanApiKey && xamanApiKey.length > 0) {
      const xamanWallet = new XamanWallet(xamanApiKey);

      availableWallets.push(xamanWallet);
    }
    // this invariant captures that this needs to return at least one available wallet, otherwise the app will never load
    invariant(availableWallets.length > 0);

    return availableWallets;
  }, []);

  useEffect(() => {
    let isMounted = true;

    import("@xrpl-wallet-standard/react")
      .then((mod) => {
        if (isMounted) {
          setProviderComponent(() => (mod as any).WalletProvider);
        }
      })
      .catch(() => {
        // Silently ignore if package not available at runtime
        if (isMounted) {
          setProviderComponent(() => null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ProviderComponent) {
    return <>{children}</>;
  }

  if (xrplWallets.length === 0) return null;

  return (
    <ProviderComponent registerWallets={xrplWallets} autoConnect={true}>
      {children}
    </ProviderComponent>
  );
};
