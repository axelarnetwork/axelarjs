import { QueryClient } from "@tanstack/react-query";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { logger } from "~/lib/logger";
import { APP_NAME, APP_TITLE } from "./app";
import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "./env";
import { EVM_CHAIN_CONFIGS } from "./evm-chains";

export type WagmiEVMChainConfig = (typeof EVM_CHAIN_CONFIGS)[number];

if (typeof window !== "undefined") {
  logger.once.info({
    [`${EVM_CHAIN_CONFIGS.length} chain configs on "${NEXT_PUBLIC_NETWORK_ENV}"`]:
      EVM_CHAIN_CONFIGS.map(({ id, name }) => ({ id, name })),
  });
}

export { EVM_CHAIN_CONFIGS };

export const queryClient = new QueryClient();

export const wagmiConfig = defaultWagmiConfig({
  chains: EVM_CHAIN_CONFIGS,
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: APP_NAME,
    description: APP_TITLE,
    icons: ["/icons/favicon-32x32.png"],
  },
});

export const WEB3_MODAL = createWeb3Modal({
  wagmiConfig,
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: EVM_CHAIN_CONFIGS,
  themeVariables: {
    "--w3m-font-family": "var(--font-sans)",
    "--w3m-accent": "var(--primary)",
    "--w3m-color-mix": "var(--primary)",
  },
  connectorImages: {
    coinbaseWallet:
      "https://raw.githubusercontent.com/WalletConnect/web3modal/V2/laboratory/public/images/wallet_coinbase.webp",
  },
  defaultChain: EVM_CHAIN_CONFIGS[0],
});
