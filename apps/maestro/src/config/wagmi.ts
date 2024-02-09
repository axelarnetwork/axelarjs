import { QueryClient } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { logger } from "~/lib/logger";
import { APP_NAME, APP_TITLE } from "./app";
import {
  NEXT_PUBLIC_DISABLED_WALLET_IDS,
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "./env";
import { WAGMI_CHAIN_CONFIGS } from "./evm-chains";

export * from "./evm-chains";

if (typeof window !== "undefined") {
  logger.once.info({
    [`${WAGMI_CHAIN_CONFIGS.length} chain configs on "${NEXT_PUBLIC_NETWORK_ENV}"`]:
      WAGMI_CHAIN_CONFIGS.map(({ id, name }) => ({ id, name })),
  });
}

export { WAGMI_CHAIN_CONFIGS as EVM_CHAIN_CONFIGS };

export const queryClient = new QueryClient();

const metadata = {
  name: APP_NAME,
  description: APP_TITLE,
  icons: ["/icons/favicon-32x32.png"],
  url: "",
};

export const wagmiConfig = createConfig({
  chains: WAGMI_CHAIN_CONFIGS,
  connectors: [
    walletConnect({
      projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      metadata,
    }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
    injected(),
  ],
  transports: Object.fromEntries(
    WAGMI_CHAIN_CONFIGS.map((chain) => [chain.id, http()])
  ),
});

export const WEB3_MODAL = createWeb3Modal({
  wagmiConfig,
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  themeVariables: {
    "--w3m-font-family": "var(--font-sans)",
    "--w3m-accent": "var(--primary)",
    "--w3m-color-mix": "var(--primary)",
  },
  excludeWalletIds: [...NEXT_PUBLIC_DISABLED_WALLET_IDS],
});
