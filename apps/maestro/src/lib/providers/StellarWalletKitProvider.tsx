import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

type StellarKitContextType = {
  kit: StellarWalletsKit | null;
  isLoading: boolean;
};

const StellarKitContext = createContext<StellarKitContextType>({
  kit: null,
  isLoading: true,
});

export function StellarWalletKitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initKit = async () => {
      try {
        const {
          StellarWalletsKit,
          WalletNetwork,
          FREIGHTER_ID,
          allowAllModules,
        } = await import("@creit.tech/stellar-wallets-kit");

        const newKit = new StellarWalletsKit({
          network: WalletNetwork.TESTNET,
          selectedWalletId: FREIGHTER_ID,
          modules: allowAllModules(),
        });

        setKit(newKit);
      } catch (error) {
        console.error("Failed to initialize Stellar Wallet Kit:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initKit().catch((e) => console.log("Error initializing Stellar", e));
  }, []);

  return (
    <StellarKitContext.Provider value={{ kit, isLoading }}>
      {children}
    </StellarKitContext.Provider>
  );
}

export const useStellarKit = () => useContext(StellarKitContext);
