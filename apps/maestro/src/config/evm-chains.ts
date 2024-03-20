import {
  arbitrum,
  arbitrumSepolia,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  Chain,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  fraxtal,
  fraxtalTestnet,
  kava,
  kavaTestnet,
  linea,
  lineaTestnet,
  mainnet,
  mantle,
  mantleTestnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scroll,
  scrollSepolia,
  sepolia,
} from "viem/chains";

import { NEXT_PUBLIC_NETWORK_ENV } from "./env";

export interface ExtendedWagmiChainConfig extends Chain {
  axelarChainId: string;
  axelarChainName: string;
  environment: "mainnet" | "testnet";
}

const ENVIRONMENTS = {
  mainnet: "mainnet",
  testnet: "testnet",
} as const;

export const ALL_CHAINS: ExtendedWagmiChainConfig[] = [
  {
    ...mainnet,
    axelarChainId: "ethereum",
    axelarChainName: "ethereum",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...sepolia,
    axelarChainId: "ethereum-sepolia",
    axelarChainName: "ethereum-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...moonbeam,
    axelarChainId: "moonbeam",
    axelarChainName: "Moonbeam",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...moonbaseAlpha,
    axelarChainId: "moonbeam",
    axelarChainName: "Moonbeam",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fantom,
    axelarChainId: "fantom",
    axelarChainName: "Fantom",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fantomTestnet,
    axelarChainId: "fantom",
    axelarChainName: "Fantom",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...avalanche,
    axelarChainId: "avalanche",
    axelarChainName: "Avalanche",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...avalancheFuji,
    axelarChainId: "avalanche",
    axelarChainName: "Avalanche",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...polygon,
    axelarChainId: "polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...polygonMumbai,
    rpcUrls: {
      default: { http: ["https://polygon-testnet.public.blastapi.io"] },
      public: { http: ["https://polygon-testnet.public.blastapi.io"] },
    },
    axelarChainId: "polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...polygonZkEvm,
    axelarChainId: "polygon-zkevm",
    axelarChainName: "polygon-zkevm",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...polygonZkEvmTestnet,
    axelarChainId: "polygon-zkevm",
    axelarChainName: "polygon-zkevm",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...bsc,
    axelarChainId: "binance",
    axelarChainName: "binance",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...bscTestnet,
    axelarChainId: "binance",
    axelarChainName: "binance",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...arbitrum,
    axelarChainId: "arbitrum",
    axelarChainName: "arbitrum",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...arbitrumSepolia,
    axelarChainId: "arbitrum-sepolia",
    axelarChainName: "arbitrum-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...celo,
    axelarChainId: "celo",
    axelarChainName: "celo",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...celoAlfajores,
    axelarChainId: "celo",
    axelarChainName: "celo",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...aurora,
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...auroraTestnet,
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...optimism,
    axelarChainId: "optimism",
    axelarChainName: "optimism",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...optimismSepolia,
    axelarChainId: "optimism-sepolia",
    axelarChainName: "optimism-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...kava,
    axelarChainId: "kava",
    axelarChainName: "kava",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...kavaTestnet,
    axelarChainId: "kava",
    axelarChainName: "kava",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...filecoinCalibration,
    axelarChainId: "filecoin-2",
    axelarChainName: "filecoin-2",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...filecoin,
    axelarChainId: "filecoin",
    axelarChainName: "filecoin",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...base,
    axelarChainId: "base",
    axelarChainName: "base",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...baseSepolia,
    axelarChainId: "base-sepolia",
    axelarChainName: "base-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...lineaTestnet,
    axelarChainId: "linea",
    axelarChainName: "linea",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...linea,
    axelarChainId: "linea",
    axelarChainName: "linea",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantle,
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantleTestnet,
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...scroll,
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...scrollSepolia,
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fraxtal,
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fraxtalTestnet,
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...blast,
    axelarChainId: "blast",
    axelarChainName: "blast",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...blastSepolia,
    axelarChainId: "blast-sepolia",
    axelarChainName: "blast-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
] as const;

export const WAGMI_CHAIN_CONFIGS = ALL_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV,
) as [ExtendedWagmiChainConfig, ...ExtendedWagmiChainConfig[]];
