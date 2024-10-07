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
  immutableZkEvm,
  immutableZkEvmTestnet,
  kava,
  kavaTestnet,
  linea,
  lineaSepolia,
  lineaTestnet,
  mainnet,
  mantle,
  mantleTestnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
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

function createRpcUrlConfig(chain: Chain, additionalUrls: string[] = []) {
  const httpUrls = [...chain.rpcUrls.default.http, ...additionalUrls];
  return {
    default: { http: httpUrls },
    public: { http: httpUrls },
  };
}

export const ALL_CHAINS: ExtendedWagmiChainConfig[] = [
  {
    ...mainnet,
    rpcUrls: createRpcUrlConfig(mainnet, ["https://eth.llamarpc.com"]),
    axelarChainId: "ethereum",
    axelarChainName: "ethereum",
    environment: ENVIRONMENTS.mainnet,
  },
  // TODO: correct this
  {
    id: 101,
    axelarChainId: "sui",
    axelarChainName: "sui",
    environment: ENVIRONMENTS.mainnet,
    name: "Sui",
    nativeCurrency: {
      name: "SUI",
      symbol: "SUI",
      decimals: 9,
    },
    rpcUrls: {
      default: { http: ["https://sui-rpc.publicnode.com"] },
      public: { http: ["https://sui-rpc.publicnode.com"] },
    },
    blockExplorers: {
      default: { name: "Sui Explorer", url: "https://suiexplorer.com/" },
    },
  },
  {
    ...sepolia,
    axelarChainId: "ethereum-sepolia",
    axelarChainName: "ethereum-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...moonbeam,
    rpcUrls: createRpcUrlConfig(moonbeam, ["https://moonbeam.drpc.org"]),
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
    rpcUrls: createRpcUrlConfig(fantom, ["https://fantom.drpc.org"]),
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
    ...immutableZkEvm,
    rpcUrls: createRpcUrlConfig(immutableZkEvm, [
      "https://immutable-zkevm.drpc.org",
    ]),
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...immutableZkEvmTestnet,
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...avalanche,
    rpcUrls: createRpcUrlConfig(avalanche, ["https://1rpc.io/avax/c"]),
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
    rpcUrls: createRpcUrlConfig(polygon, ["https://polygon.llamarpc.com"]),
    axelarChainId: "polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...polygonAmoy,
    axelarChainId: "polygon-amoy",
    axelarChainName: "polygon-amoy",
    environment: ENVIRONMENTS.testnet,
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
    rpcUrls: createRpcUrlConfig(polygonZkEvm, [
      "https://polygon-zkevm.drpc.org",
    ]),
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
    rpcUrls: createRpcUrlConfig(bsc, ["https://binance.llamarpc.com"]),
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
    rpcUrls: createRpcUrlConfig(arbitrum, ["https://arbitrum.drpc.org"]),
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
    rpcUrls: createRpcUrlConfig(celo, ["https://1rpc.io/celo"]),
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
    rpcUrls: createRpcUrlConfig(aurora, ["https://1rpc.io/aurora"]),
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
    rpcUrls: createRpcUrlConfig(kava, ["https://kava.drpc.org"]),
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
    rpcUrls: createRpcUrlConfig(filecoin, ["https://rpc.ankr.com/filecoin"]),
    axelarChainId: "filecoin",
    axelarChainName: "filecoin",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...base,
    rpcUrls: createRpcUrlConfig(base, ["https://base.llamarpc.com"]),
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
    ...lineaSepolia,
    axelarChainId: "linea-sepolia",
    axelarChainName: "linea-sepolia",
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
    rpcUrls: createRpcUrlConfig(linea, ["https://1rpc.io/linea"]),
    axelarChainId: "linea",
    axelarChainName: "linea",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantle,
    rpcUrls: createRpcUrlConfig(mantle, ["https://rpc.mantle.xyz"]),
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
    rpcUrls: createRpcUrlConfig(scroll, ["https://scroll.drpc.org"]),
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
    rpcUrls: createRpcUrlConfig(fraxtal, ["https://fraxtal.drpc.org"]),
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
    rpcUrls: createRpcUrlConfig(blast, ["https://rpc.envelop.is/blast"]),
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
  {
    ...blastSepolia,
    axelarChainId: "blast-sepolia",
    axelarChainName: "blast-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
] as const;

export const WAGMI_CHAIN_CONFIGS = ALL_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV
) as [ExtendedWagmiChainConfig, ...ExtendedWagmiChainConfig[]];
