import { QueryClient } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { logger } from "~/lib/logger";
import { APP_NAME, APP_TITLE } from "./app";
import {
  NEXT_PUBLIC_DISABLED_WALLET_IDS,
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "./env";
import { ExtendedWagmiChainConfig, WAGMI_CHAIN_CONFIGS } from "./chains";

if (typeof window !== "undefined") {
  logger.once.info({
    [`${WAGMI_CHAIN_CONFIGS.length} chain configs on "${NEXT_PUBLIC_NETWORK_ENV}"`]:
      WAGMI_CHAIN_CONFIGS.map(({ id, name }) => ({ id, name })),
  });
}

export const queryClient = new QueryClient();

export const wagmiConfig = defaultWagmiConfig({
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: WAGMI_CHAIN_CONFIGS as [ExtendedWagmiChainConfig, ...ExtendedWagmiChainConfig[]],
  ssr: true,
  metadata: {
    name: APP_NAME,
    description: APP_TITLE,
    icons: ["/icons/favicon-32x32.png"],
    url: "",
  },
  enableInjected: true,
  enableCoinbase: false,
  enableWalletConnect: false,
});

export const WEB3_MODAL = createWeb3Modal({
  wagmiConfig,
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  themeVariables: {
    "--w3m-font-family": "var(--font-sans)",
    "--w3m-accent": "var(--primary)",
    "--w3m-color-mix": "var(--primary)",
  },
  // https://docs.reown.com/cloud/wallets/wallet-list
  excludeWalletIds: [...NEXT_PUBLIC_DISABLED_WALLET_IDS, "6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb"],
  connectorImages: {
    coinbaseWallet:
      "https://raw.githubusercontent.com/WalletConnect/web3modal/V2/laboratory/public/images/wallet_coinbase.webp",
  },
});
