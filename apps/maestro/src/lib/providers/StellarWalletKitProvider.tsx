import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";

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
        const { StellarWalletsKit, FREIGHTER_ID, FreighterModule } =
          await import("@creit.tech/stellar-wallets-kit");

        const newKit = new StellarWalletsKit({
          network: STELLAR_NETWORK_PASSPHRASE,
          selectedWalletId: FREIGHTER_ID,
          modalTheme: {
            bgColor: "#1D232A",
            textColor: "#A6ADBA",
            solidTextColor: "#FFFFFF",
            headerButtonColor: "#A6ADBA",
            dividerColor: "#2A323C",
            helpBgColor: "#2A323C",
            notAvailableTextColor: "#A6ADBA",
            notAvailableBgColor: "#1D232A",
            notAvailableBorderColor: "#2A323C",
          },
          modules: [new FreighterModule()],
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
