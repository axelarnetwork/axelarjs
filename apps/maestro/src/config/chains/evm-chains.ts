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
  flowMainnet,
  flowTestnet,
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
  polygonZkEvm,
  polygonZkEvmTestnet,
  scroll,
  scrollSepolia,
  sepolia,
  xrplevmTestnet,
} from "viem/chains";

import { NEXT_PUBLIC_NETWORK_ENV } from "../env";
import { CUSTOM_RPC_NODES } from "./custom-rpc-nodes";

export interface ExtendedWagmiChainConfig extends Chain {
  axelarChainId: string;
  axelarChainName: string;
  supportWagmi: boolean;
  environment: "mainnet" | "testnet" | "devnet-amplifier";
}

const ENVIRONMENTS = {
  mainnet: "mainnet",
  devnet: "devnet-amplifier",
  testnet: "testnet",
} as const;

/**
 * Create RPC URL configurations with custom nodes and extras
 */
export function createRpcUrlConfig(
  chainId: string,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  baseDefaultUrls: string[] = [],
  basePublicUrls: string[] = [],
  defaultExtras: string[] = [],
  publicExtras: string[] = []
) {
  // custom RPC overrides for all environments
  const customNodes =
    CUSTOM_RPC_NODES[environment]?.[chainId.toLowerCase()] ?? [];

  // build default list
  const baseDefaults = [...baseDefaultUrls, ...defaultExtras];
  const defaultUrls = customNodes.length
    ? [...customNodes, ...baseDefaults]
    : baseDefaults;

  // build public list
  const basePublic = basePublicUrls.length > 0 ? basePublicUrls : baseDefaultUrls;
  const publicUrls = customNodes.length
    ? [...customNodes, ...basePublic, ...publicExtras]
    : [...basePublic, ...publicExtras];

  return {
    default: { http: defaultUrls },
    public: { http: publicUrls },
  };
}

/**
 * Helper function to create RPC URL configuration for EVM chains
 */
function createEvmChainRpcConfig(
  chain: Chain,
  axelarChainId: string,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  defaultExtras: string[] = [],
  publicExtras: string[] = []
) {
  return createRpcUrlConfig(
    axelarChainId,
    environment,
    Array.from(chain.rpcUrls.default.http),
    chain.rpcUrls.public?.http ? Array.from(chain.rpcUrls.public.http) : Array.from(chain.rpcUrls.default.http),
    defaultExtras,
    publicExtras
  );
}

export const EVM_CHAINS: ExtendedWagmiChainConfig[] = [
  {
    ...mainnet,
    rpcUrls: createEvmChainRpcConfig(mainnet, "Ethereum", ENVIRONMENTS.mainnet, [
      "https://eth.llamarpc.com",
      "https://eth.drpc.org",
    ]),
    axelarChainId: "Ethereum",
    axelarChainName: "ethereum",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...sepolia,
    rpcUrls: createEvmChainRpcConfig(
      sepolia,
      "ethereum-sepolia",
      ENVIRONMENTS.testnet,
      [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://endpoints.omniatech.io/v1/eth/sepolia/public",
      ],
      [
        "https://1rpc.io/sepolia",
        "https://eth-sepolia.public.blastapi.io",
        "https://endpoints.omniatech.io/v1/eth/sepolia/public",
      ]
    ),
    axelarChainId: "ethereum-sepolia",
    supportWagmi: true,
    axelarChainName: "ethereum-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...flowMainnet,
    rpcUrls: createEvmChainRpcConfig(flowMainnet, "flow", ENVIRONMENTS.mainnet),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...flowTestnet,
    rpcUrls: createEvmChainRpcConfig(flowTestnet, "flow", ENVIRONMENTS.testnet),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...moonbeam,
    rpcUrls: createEvmChainRpcConfig(moonbeam, "Moonbeam", ENVIRONMENTS.mainnet),
    axelarChainId: "Moonbeam",
    axelarChainName: "Moonbeam",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...moonbaseAlpha,
    rpcUrls: createEvmChainRpcConfig(
      moonbaseAlpha,
      "moonbeam",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "moonbeam",
    axelarChainName: "Moonbeam",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fantom,
    rpcUrls: createEvmChainRpcConfig(fantom, "Fantom", ENVIRONMENTS.mainnet),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fantomTestnet,
    rpcUrls: createEvmChainRpcConfig(fantomTestnet, "Fantom", ENVIRONMENTS.testnet),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...immutableZkEvm,
    rpcUrls: createEvmChainRpcConfig(
      immutableZkEvm,
      "immutable",
      ENVIRONMENTS.mainnet
    ),
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...immutableZkEvmTestnet,
    rpcUrls: createEvmChainRpcConfig(
      immutableZkEvmTestnet,
      "immutable",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...avalanche,
    rpcUrls: createEvmChainRpcConfig(avalanche, "Avalanche", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/avax/c",
    ]),
    axelarChainId: "Avalanche",
    axelarChainName: "Avalanche",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...avalancheFuji,
    rpcUrls: createEvmChainRpcConfig(
      avalancheFuji,
      "Avalanche",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "Avalanche",
    axelarChainName: "Avalanche",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...polygon,
    rpcUrls: createEvmChainRpcConfig(polygon, "Polygon", ENVIRONMENTS.mainnet, [
      "https://polygon.llamarpc.com",
    ]),
    axelarChainId: "Polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.mainnet,
    supportWagmi: true,
  },
  {
    ...polygonAmoy,
    rpcUrls: createEvmChainRpcConfig(
      polygonAmoy,
      "polygon-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "polygon-sepolia",
    axelarChainName: "polygon-sepolia",
    environment: ENVIRONMENTS.testnet,
    supportWagmi: true,
  },
  {
    ...polygonZkEvm,
    rpcUrls: createEvmChainRpcConfig(
      polygonZkEvm,
      "polygon-zkevm",
      ENVIRONMENTS.mainnet
    ),
    axelarChainId: "polygon-zkevm",
    supportWagmi: true,
    axelarChainName: "polygon-zkevm",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...polygonZkEvmTestnet,
    rpcUrls: createEvmChainRpcConfig(
      polygonZkEvmTestnet,
      "polygon-zkevm",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "polygon-zkevm",
    axelarChainName: "polygon-zkevm",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...bsc,
    rpcUrls: createEvmChainRpcConfig(
      bsc,
      "binance",
      ENVIRONMENTS.mainnet,
      ["https://bsc.blockrazor.xyz"],
      ["https://bsc.blockrazor.xyz"]
    ),
    axelarChainId: "binance",
    axelarChainName: "binance",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...bscTestnet,
    rpcUrls: createEvmChainRpcConfig(bscTestnet, "binance", ENVIRONMENTS.testnet),
    axelarChainId: "binance",
    axelarChainName: "binance",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...arbitrum,
    rpcUrls: createEvmChainRpcConfig(arbitrum, "arbitrum", ENVIRONMENTS.mainnet),
    axelarChainId: "arbitrum",
    axelarChainName: "arbitrum",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...arbitrumSepolia,
    rpcUrls: createEvmChainRpcConfig(
      arbitrumSepolia,
      "arbitrum-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "arbitrum-sepolia",
    axelarChainName: "arbitrum-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...celo,
    rpcUrls: createEvmChainRpcConfig(celo, "celo", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/celo",
    ]),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...celoAlfajores,
    rpcUrls: createEvmChainRpcConfig(celoAlfajores, "celo", ENVIRONMENTS.testnet),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...aurora,
    rpcUrls: createEvmChainRpcConfig(aurora, "aurora", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/aurora",
    ]),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...auroraTestnet,
    rpcUrls: createEvmChainRpcConfig(auroraTestnet, "aurora", ENVIRONMENTS.testnet),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...optimism,
    rpcUrls: createEvmChainRpcConfig(optimism, "optimism", ENVIRONMENTS.mainnet),
    axelarChainId: "optimism",
    axelarChainName: "optimism",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...optimismSepolia,
    rpcUrls: createEvmChainRpcConfig(
      optimismSepolia,
      "optimism-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "optimism-sepolia",
    axelarChainName: "optimism-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...kava,
    rpcUrls: createEvmChainRpcConfig(kava, "kava", ENVIRONMENTS.mainnet),
    axelarChainId: "kava",
    axelarChainName: "kava",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...kavaTestnet,
    rpcUrls: createEvmChainRpcConfig(kavaTestnet, "kava", ENVIRONMENTS.testnet),
    axelarChainId: "kava",
    axelarChainName: "kava",
    environment: ENVIRONMENTS.testnet,
    supportWagmi: true,
  },
  {
    ...filecoinCalibration,
    rpcUrls: createEvmChainRpcConfig(
      filecoinCalibration,
      "filecoin-2",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "filecoin-2",
    axelarChainName: "filecoin-2",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...filecoin,
    rpcUrls: createEvmChainRpcConfig(filecoin, "filecoin", ENVIRONMENTS.mainnet, [
      "https://rpc.ankr.com/filecoin",
    ]),
    axelarChainId: "filecoin",
    axelarChainName: "filecoin",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...base,
    rpcUrls: createEvmChainRpcConfig(base, "base", ENVIRONMENTS.mainnet, [
      "https://base.llamarpc.com",
    ]),
    axelarChainId: "base",
    axelarChainName: "base",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...baseSepolia,
    rpcUrls: createEvmChainRpcConfig(
      baseSepolia,
      "base-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "base-sepolia",
    axelarChainName: "base-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...lineaSepolia,
    rpcUrls: createEvmChainRpcConfig(
      lineaSepolia,
      "linea-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "linea-sepolia",
    axelarChainName: "linea-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...lineaTestnet,
    rpcUrls: createEvmChainRpcConfig(lineaTestnet, "linea", ENVIRONMENTS.testnet),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...linea,
    rpcUrls: createEvmChainRpcConfig(linea, "linea", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/linea",
    ]),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantle,
    rpcUrls: createEvmChainRpcConfig(mantle, "mantle", ENVIRONMENTS.mainnet, [
      "https://rpc.mantle.xyz",
    ]),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantleTestnet,
    rpcUrls: createEvmChainRpcConfig(mantleTestnet, "mantle", ENVIRONMENTS.testnet),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...scroll,
    rpcUrls: createEvmChainRpcConfig(scroll, "scroll", ENVIRONMENTS.mainnet, [
      "https://scroll.drpc.org",
    ]),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...scrollSepolia,
    rpcUrls: createEvmChainRpcConfig(scrollSepolia, "scroll", ENVIRONMENTS.testnet),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fraxtal,
    rpcUrls: createEvmChainRpcConfig(fraxtal, "fraxtal", ENVIRONMENTS.mainnet, [
      "https://fraxtal.drpc.org",
    ]),
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fraxtalTestnet,
    rpcUrls: createEvmChainRpcConfig(
      fraxtalTestnet,
      "fraxtal",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...blast,
    rpcUrls: createEvmChainRpcConfig(blast, "blast", ENVIRONMENTS.mainnet, [
      "https://rpc.envelop.is/blast",
    ]),
    axelarChainId: "blast",
    axelarChainName: "blast",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...blastSepolia,
    rpcUrls: createEvmChainRpcConfig(
      blastSepolia,
      "blast-sepolia",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "blast-sepolia",
    axelarChainName: "blast-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...avalancheFuji,
    rpcUrls: createEvmChainRpcConfig(
      avalancheFuji,
      "avalanche-fuji",
      ENVIRONMENTS.devnet
    ),
    axelarChainId: "avalanche-fuji",
    axelarChainName: "avalanche-fuji",
    supportWagmi: true,
    environment: ENVIRONMENTS.devnet,
  },
  {
    ...optimismSepolia,
    rpcUrls: createEvmChainRpcConfig(
      optimismSepolia,
      "optimism-sepolia",
      ENVIRONMENTS.devnet
    ),
    axelarChainId: "optimism-sepolia",
    axelarChainName: "optimism-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.devnet,
  },
  {
    ...sepolia,
    rpcUrls: createEvmChainRpcConfig(
      sepolia,
      "eth-sepolia",
      ENVIRONMENTS.devnet,
      ["https://endpoints.omniatech.io/v1/eth/sepolia/public"],
      ["https://endpoints.omniatech.io/v1/eth/sepolia/public"]
    ),
    axelarChainId: "eth-sepolia",
    axelarChainName: "eth-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.devnet,
  },
  {
    ...xrplevmTestnet,
    rpcUrls: createEvmChainRpcConfig(
      xrplevmTestnet,
      "xrpl-evm",
      ENVIRONMENTS.testnet
    ),
    axelarChainId: "xrpl-evm",
    axelarChainName: "xrpl-evm",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
] as const;

export const EVM_CHAIN_CONFIGS = EVM_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV
) as [ExtendedWagmiChainConfig, ...ExtendedWagmiChainConfig[]];
