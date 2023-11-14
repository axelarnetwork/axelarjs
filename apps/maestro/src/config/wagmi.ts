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
  { ...mainnet, axelarChainId: "ethereum", environment: "mainnet" },
  { ...goerli, axelarChainId: "ethereum-2", environment: "testnet" },
  { ...moonbeam, axelarChainId: "moonbeam", environment: "mainnet" },
  {
    ...moonbaseAlpha,
    axelarChainId: "moonbeam",
    environment: "testnet",
  },
  { ...fantom, axelarChainId: "fantom", environment: "mainnet" },
  {
    ...fantomTestnet,
    axelarChainId: "fantom",
    environment: "testnet",
  },
  {
    ...avalanche,
    axelarChainId: "avalanche",
    environment: "mainnet",
  },
  {
    ...avalancheFuji,
    axelarChainId: "avalanche",
    environment: "testnet",
  },
  { ...polygon, axelarChainId: "polygon", environment: "mainnet" },
  {
    ...polygonMumbai,
    rpcUrls: {
      default: { http: ["https://polygon-testnet.public.blastapi.io"] },
      public: { http: ["https://polygon-testnet.public.blastapi.io"] },
    },
    axelarChainId: "polygon",
    environment: "testnet",
  },
  {
    ...polygonZkEvm,
    axelarChainId: "polygon-zkevm",
    environment: "mainnet",
  },
  {
    ...polygonZkEvmTestnet,
    axelarChainId: "polygon-zkevm",
    environment: "testnet",
  },
  { ...bsc, axelarChainId: "binance", environment: "mainnet" },
  { ...bscTestnet, axelarChainId: "binance", environment: "testnet" },
  { ...arbitrum, axelarChainId: "arbitrum", environment: "mainnet" },
  {
    ...arbitrumGoerli,
    axelarChainId: "arbitrum",
    environment: "testnet",
  },
  { ...celo, axelarChainId: "celo", environment: "mainnet" },
  { ...celoAlfajores, axelarChainId: "celo", environment: "testnet" },
  { ...aurora, axelarChainId: "aurora", environment: "mainnet" },
  {
    ...auroraTestnet,
    axelarChainId: "aurora",
    environment: "testnet",
  },
  { ...optimism, axelarChainId: "optimism", environment: "mainnet" },
  {
    ...optimismGoerli,
    axelarChainId: "optimism",
    environment: "testnet",
  },
  {
    id: 2222,
    name: "Kava EVM",
    network: "kava",
    axelarChainId: "kava",
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
    axelarChainId: "kava",
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
    axelarChainId: "filecoin-2",
    environment: "testnet",
  },
  { ...filecoin, axelarChainId: "filecoin", environment: "mainnet" },
  {
    ...baseGoerli,
    axelarChainId: "base",
    environment: "testnet",
  },
  {
    ...lineaTestnet,
    axelarChainId: "linea",
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
