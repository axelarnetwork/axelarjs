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

function createRpcUrlConfig(
  chain: Chain,
  axelarChainId: string,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  defaultExtras: string[] = [],
  publicExtras: string[] = []
) {
  // custom RPC overrides for all environments
  const customNodes =
    CUSTOM_RPC_NODES[environment]?.[axelarChainId.toLowerCase()] ?? [];

  // build default list
  const baseDefaults = [...chain.rpcUrls.default.http, ...defaultExtras];
  const defaultUrls = customNodes.length
    ? [...customNodes, ...baseDefaults]
    : baseDefaults;

  // build public list
  const basePublic = chain.rpcUrls.public?.http ?? chain.rpcUrls.default.http;
  const publicUrls = customNodes.length
    ? [...customNodes, ...basePublic, ...publicExtras]
    : [...basePublic, ...publicExtras];

  return {
    default: { http: defaultUrls },
    public: { http: publicUrls },
  };
}

export const EVM_CHAINS: ExtendedWagmiChainConfig[] = [
  {
    ...mainnet,
    rpcUrls: createRpcUrlConfig(mainnet, "Ethereum", ENVIRONMENTS.mainnet, [
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(flowMainnet, "flow", ENVIRONMENTS.mainnet),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...flowTestnet,
    rpcUrls: createRpcUrlConfig(flowTestnet, "flow", ENVIRONMENTS.testnet),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...moonbeam,
    rpcUrls: createRpcUrlConfig(moonbeam, "Moonbeam", ENVIRONMENTS.mainnet, [
      "https://moonbeam.drpc.org",
    ]),
    axelarChainId: "Moonbeam",
    axelarChainName: "Moonbeam",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...moonbaseAlpha,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(fantom, "Fantom", ENVIRONMENTS.mainnet, [
      "https://fantom.drpc.org",
    ]),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fantomTestnet,
    rpcUrls: createRpcUrlConfig(fantomTestnet, "Fantom", ENVIRONMENTS.testnet),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...immutableZkEvm,
    rpcUrls: createRpcUrlConfig(
      immutableZkEvm,
      "immutable",
      ENVIRONMENTS.mainnet,
      ["https://immutable-zkevm.drpc.org"]
    ),
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...immutableZkEvmTestnet,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(avalanche, "Avalanche", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/avax/c",
    ]),
    axelarChainId: "Avalanche",
    axelarChainName: "Avalanche",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...avalancheFuji,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(polygon, "Polygon", ENVIRONMENTS.mainnet, [
      "https://polygon.llamarpc.com",
    ]),
    axelarChainId: "Polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.mainnet,
    supportWagmi: true,
  },
  {
    ...polygonAmoy,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
      polygonZkEvm,
      "polygon-zkevm",
      ENVIRONMENTS.mainnet,
      ["https://polygon-zkevm.drpc.org"]
    ),
    axelarChainId: "polygon-zkevm",
    supportWagmi: true,
    axelarChainName: "polygon-zkevm",
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...polygonZkEvmTestnet,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(bscTestnet, "binance", ENVIRONMENTS.testnet),
    axelarChainId: "binance",
    axelarChainName: "binance",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...arbitrum,
    rpcUrls: createRpcUrlConfig(arbitrum, "arbitrum", ENVIRONMENTS.mainnet, [
      "https://arbitrum.drpc.org",
    ]),
    axelarChainId: "arbitrum",
    axelarChainName: "arbitrum",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...arbitrumSepolia,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(celo, "celo", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/celo",
    ]),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...celoAlfajores,
    rpcUrls: createRpcUrlConfig(celoAlfajores, "celo", ENVIRONMENTS.testnet),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...aurora,
    rpcUrls: createRpcUrlConfig(aurora, "aurora", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/aurora",
    ]),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...auroraTestnet,
    rpcUrls: createRpcUrlConfig(auroraTestnet, "aurora", ENVIRONMENTS.testnet),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...optimism,
    rpcUrls: createRpcUrlConfig(optimism, "optimism", ENVIRONMENTS.mainnet),
    axelarChainId: "optimism",
    axelarChainName: "optimism",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...optimismSepolia,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(kava, "kava", ENVIRONMENTS.mainnet, [
      "https://kava.drpc.org",
    ]),
    axelarChainId: "kava",
    axelarChainName: "kava",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...kavaTestnet,
    rpcUrls: createRpcUrlConfig(kavaTestnet, "kava", ENVIRONMENTS.testnet),
    axelarChainId: "kava",
    axelarChainName: "kava",
    environment: ENVIRONMENTS.testnet,
    supportWagmi: true,
  },
  {
    ...filecoinCalibration,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(filecoin, "filecoin", ENVIRONMENTS.mainnet, [
      "https://rpc.ankr.com/filecoin",
    ]),
    axelarChainId: "filecoin",
    axelarChainName: "filecoin",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...base,
    rpcUrls: createRpcUrlConfig(base, "base", ENVIRONMENTS.mainnet, [
      "https://base.llamarpc.com",
    ]),
    axelarChainId: "base",
    axelarChainName: "base",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...baseSepolia,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(lineaTestnet, "linea", ENVIRONMENTS.testnet),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...linea,
    rpcUrls: createRpcUrlConfig(linea, "linea", ENVIRONMENTS.mainnet, [
      "https://1rpc.io/linea",
    ]),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantle,
    rpcUrls: createRpcUrlConfig(mantle, "mantle", ENVIRONMENTS.mainnet, [
      "https://rpc.mantle.xyz",
    ]),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantleTestnet,
    rpcUrls: createRpcUrlConfig(mantleTestnet, "mantle", ENVIRONMENTS.testnet),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...scroll,
    rpcUrls: createRpcUrlConfig(scroll, "scroll", ENVIRONMENTS.mainnet, [
      "https://scroll.drpc.org",
    ]),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...scrollSepolia,
    rpcUrls: createRpcUrlConfig(scrollSepolia, "scroll", ENVIRONMENTS.testnet),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fraxtal,
    rpcUrls: createRpcUrlConfig(fraxtal, "fraxtal", ENVIRONMENTS.mainnet, [
      "https://fraxtal.drpc.org",
    ]),
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fraxtalTestnet,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(blast, "blast", ENVIRONMENTS.mainnet, [
      "https://rpc.envelop.is/blast",
    ]),
    axelarChainId: "blast",
    axelarChainName: "blast",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...blastSepolia,
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
    rpcUrls: createRpcUrlConfig(
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
