import { QueryClient } from "@tanstack/react-query";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { createWalletClient, http } from "viem";
import { configureChains, createConfig } from "wagmi";
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
  filecoinHyperspace,
  foundry,
  goerli,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { MockConnector } from "wagmi/connectors/mock";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { logger } from "~/lib/logger";
import { APP_NAME } from "../app";

export const WALLECTCONNECT_PROJECT_ID = String(
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
);

export const NETWORK_ENV = String(process.env.NEXT_PUBLIC_NETWORK_ENV) as
  | "mainnet"
  | "testnet";

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
    networkNameOnAxelar: "polygon",
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
    ...filecoinHyperspace,
    networkNameOnAxelar: "filecoin",
    environment: "testnet",
  },
  { ...filecoin, networkNameOnAxelar: "filecoin", environment: "mainnet" },
  {
    ...baseGoerli,
    networkNameOnAxelar: "base",
    environment: "testnet",
  },
].filter((chain) => chain.environment === NETWORK_ENV);

export type WagmiEVMChainConfig = (typeof EVM_CHAIN_CONFIGS)[number];

if (typeof window !== "undefined") {
  logger.info({
    [`${EVM_CHAIN_CONFIGS.length} chain configs on "${NETWORK_ENV}"`]:
      EVM_CHAIN_CONFIGS.map(({ id, name }) => ({ id, name })),
  });
}

/**
 * whether the app is running in e2e test mode
 */
export const IS_E2E_TEST = process.env.NEXT_PUBLIC_E2E_ENABLED === "true";

const { webSocketPublicClient, publicClient } = IS_E2E_TEST
  ? configureChains(
      // only use foundry for e2e tests
      [foundry],
      [
        // use jsonRpcProvider as the provider for e2e tests
        jsonRpcProvider({
          rpc: (chain_) => ({
            http: chain_.rpcUrls.default.http[0],
          }),
        }),
      ]
    )
  : configureChains(EVM_CHAIN_CONFIGS, [
      w3mProvider({
        projectId: WALLECTCONNECT_PROJECT_ID,
      }),
    ]);

export const queryClient = new QueryClient();

const W3M_CONNECTORS = w3mConnectors({
  chains: EVM_CHAIN_CONFIGS,
  projectId: WALLECTCONNECT_PROJECT_ID,
  version: 2,
});

export const getMockWalletClient = () =>
  createWalletClient({
    transport: http(foundry.rpcUrls.default.http[0]),
    chain: {
      ...foundry,
      id: goerli.id,
      network: goerli.network,
      name: goerli.name,
    },
    name: "Mock Wallet",
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    pollingInterval: 100,
  });

const connectors = IS_E2E_TEST
  ? [
      new MockConnector({
        options: {
          walletClient: getMockWalletClient(),
          chainId: goerli.id,
        },
      }),
      ...W3M_CONNECTORS,
    ]
  : [
      new CoinbaseWalletConnector({
        chains: EVM_CHAIN_CONFIGS,
        options: {
          appName: APP_NAME,
        },
      }),
      new LedgerConnector({
        chains: EVM_CHAIN_CONFIGS,
      }),
      ...W3M_CONNECTORS,
    ];

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  queryClient,
  connectors,
  logger, // custom logger
});

export const ethereumClient = new EthereumClient(
  wagmiConfig,
  EVM_CHAIN_CONFIGS
);
