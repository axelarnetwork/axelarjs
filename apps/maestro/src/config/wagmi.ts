import { QueryClient } from "@tanstack/react-query";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import {
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  goerli,
  lineaTestnet,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
} from "wagmi/chains";

import { logger } from "~/lib/logger";
import { APP_NAME, APP_TITLE } from "./app";
import {
  NEXT_PUBLIC_NETWORK_ENV,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
} from "./env";

export const EVM_CHAIN_CONFIGS = [
  { ...mainnet, networkNameOnAxelar: "ethereum", environment: "mainnet" },
  { ...goerli, networkNameOnAxelar: "ethereum-2", environment: "testnet" },
  { ...moonbeam, networkNameOnAxelar: "moonbeam", environment: "mainnet" },
  {
    ...moonbaseAlpha,
    networkNameOnAxelar: "moonbeam",
    environment: "testnet",
  },
  { ...fantom, networkNameOnAxelar: "fantom", environment: "mainnet" },
  {
    ...fantomTestnet,
    networkNameOnAxelar: "fantom",
    environment: "testnet",
  },
  {
    ...avalanche,
    networkNameOnAxelar: "avalanche",
    environment: "mainnet",
  },
  {
    ...avalancheFuji,
    networkNameOnAxelar: "avalanche",
    environment: "testnet",
  },
  { ...polygon, networkNameOnAxelar: "polygon", environment: "mainnet" },
  {
    ...polygonMumbai,
    rpcUrls: {
      default: { http: ["https://polygon-testnet.public.blastapi.io"] },
      public: { http: ["https://polygon-testnet.public.blastapi.io"] },
    },
    networkNameOnAxelar: "polygon",
    environment: "testnet",
  },
  {
    ...polygonZkEvm,
    networkNameOnAxelar: "polygon-zkevm",
    environment: "mainnet",
  },
  {
    ...polygonZkEvmTestnet,
    networkNameOnAxelar: "polygon-zkevm",
    environment: "testnet",
  },
  { ...bsc, networkNameOnAxelar: "binance", environment: "mainnet" },
  { ...bscTestnet, networkNameOnAxelar: "binance", environment: "testnet" },
  { ...arbitrum, networkNameOnAxelar: "arbitrum", environment: "mainnet" },
  {
    ...arbitrumGoerli,
    networkNameOnAxelar: "arbitrum",
    environment: "testnet",
  },
  { ...celo, networkNameOnAxelar: "celo", environment: "mainnet" },
  { ...celoAlfajores, networkNameOnAxelar: "celo", environment: "testnet" },
  { ...aurora, networkNameOnAxelar: "aurora", environment: "mainnet" },
  {
    ...auroraTestnet,
    networkNameOnAxelar: "aurora",
    environment: "testnet",
  },
  { ...optimism, networkNameOnAxelar: "optimism", environment: "mainnet" },
  {
    ...optimismGoerli,
    networkNameOnAxelar: "optimism",
    environment: "testnet",
  },
  {
    id: 2222,
    name: "Kava EVM",
    network: "kava",
    networkNameOnAxelar: "kava",
    environment: "mainnet",
    nativeCurrency: {
      name: "KAVA",
      symbol: "KAVA",
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: "Kava Explorer",
        url: "https://explorer.kava.io/",
      },
    },
    rpcUrls: {
      default: { http: ["https://evm.kava.io"] },
      public: { http: ["https://evm.kava.io"] },
    },
    testnet: false,
  },
  {
    id: 2221,
    name: "Kava EVM Testnet",
    network: "kava",
    networkNameOnAxelar: "kava",
    environment: "testnet",
    nativeCurrency: {
      name: "KAVA",
      symbol: "KAVA",
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: "Kava EVM Explorer",
        url: "https://explorer.evm-alpha.kava.io/",
      },
    },
    rpcUrls: {
      default: { http: ["https://evm.testnet.kava.io"] },
      public: { http: ["https://evm.testnet.kava.io"] },
    },
    testnet: true,
  },
  {
    ...filecoinCalibration,
    networkNameOnAxelar: "filecoin-2",
    environment: "testnet",
  },
  { ...filecoin, networkNameOnAxelar: "filecoin", environment: "mainnet" },
  {
    ...baseGoerli,
    networkNameOnAxelar: "base",
    environment: "testnet",
  },
  {
    ...lineaTestnet,
    networkNameOnAxelar: "linea",
    environment: "testnet",
  },
].filter((chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV);

export type WagmiEVMChainConfig = (typeof EVM_CHAIN_CONFIGS)[number];

if (typeof window !== "undefined") {
  logger.once.info({
    [`${EVM_CHAIN_CONFIGS.length} chain configs on "${NEXT_PUBLIC_NETWORK_ENV}"`]:
      EVM_CHAIN_CONFIGS.map(({ id, name }) => ({ id, name })),
  });
}

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
