import { defineChain } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  berachain,
  berachainBepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  flowMainnet,
  flowTestnet,
  fraxtal,
  fraxtalTestnet,
  hedera,
  hederaTestnet,
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
  plumeMainnet,
  plumeSepolia,
  polygon,
  polygonAmoy,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scroll,
  scrollSepolia,
  sepolia,
  xrplevmTestnet,
} from "viem/chains";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { createRpcUrlConfig, ExtendedWagmiChainConfig } from "./utils";

export const HEDERA_CHAIN_ID =
  NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 295 : 296;

const ENVIRONMENTS = {
  mainnet: "mainnet",
  devnet: "devnet-amplifier",
  testnet: "testnet",
} as const;

/** the registered contract is used */
export const CHAIN_IDS_WITH_REGISTERED_TOKEN_ADDRESS = [HEDERA_CHAIN_ID];

const xrplEvm = defineChain({
  id: 1440000,
  name: "XRPL EVM",
  nativeCurrency: {
    name: "XRP",
    symbol: "XRP",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.xrplevm.org"] },
  },
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.xrplevm.org",
      apiUrl: "https://explorer.xrplevm.org/api/v2",
    },
  },
  testnet: false,
});

const hyperEVM = defineChain({
  id: 999,
  name: "HyperEVM",
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
  blockExplorers: {
    default: {
      name: "HyperEVMScan",
      url: "https://hyperevmscan.io/",
    },
  },
  testnet: false,
});

const hyperEVMTestnet = defineChain({
  id: 998,
  name: "HyperEVM Testnet",
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
  },
  blockExplorers: {
    default: {
      name: "HyperEVMScan",
      url: "https://hyperevmscan.io/",
    },
  },
  testnet: true,
});

export const EVM_CHAINS: ExtendedWagmiChainConfig[] = [
  {
    ...mainnet,
    rpcUrls: createRpcUrlConfig(
      mainnet,
      ENVIRONMENTS.mainnet,
      ["https://eth.llamarpc.com"],
      "Ethereum"
    ),
    axelarChainId: "Ethereum",
    axelarChainName: "Ethereum",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...sepolia,
    rpcUrls: createRpcUrlConfig(
      sepolia,
      ENVIRONMENTS.testnet,
      [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://endpoints.omniatech.io/v1/eth/sepolia/public",
        "https://1rpc.io/sepolia",
        "https://eth-sepolia.public.blastapi.io",
      ],
      "ethereum-sepolia"
    ),
    axelarChainId: "ethereum-sepolia",
    supportWagmi: true,
    axelarChainName: "ethereum-sepolia",
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...flowMainnet,
    rpcUrls: createRpcUrlConfig(flowMainnet, ENVIRONMENTS.mainnet, [], "flow"),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...flowTestnet,
    rpcUrls: createRpcUrlConfig(flowTestnet, ENVIRONMENTS.testnet, [], "flow"),
    axelarChainId: "flow",
    axelarChainName: "Flow",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...moonbeam,
    rpcUrls: createRpcUrlConfig(moonbeam, ENVIRONMENTS.mainnet, [], "Moonbeam"),
    axelarChainId: "Moonbeam",
    axelarChainName: "Moonbeam",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...moonbaseAlpha,
    rpcUrls: createRpcUrlConfig(
      moonbaseAlpha,
      ENVIRONMENTS.testnet,
      [],
      "moonbeam"
    ),
    axelarChainId: "moonbeam",
    axelarChainName: "Moonbeam",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fantom,
    rpcUrls: createRpcUrlConfig(fantom, ENVIRONMENTS.mainnet, [], "Fantom"),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fantomTestnet,
    rpcUrls: createRpcUrlConfig(
      fantomTestnet,
      ENVIRONMENTS.testnet,
      [],
      "Fantom"
    ),
    axelarChainId: "Fantom",
    axelarChainName: "Fantom",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...immutableZkEvm,
    rpcUrls: createRpcUrlConfig(
      immutableZkEvm,
      ENVIRONMENTS.mainnet,
      [],
      "immutable"
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
      ENVIRONMENTS.testnet,
      [],
      "immutable"
    ),
    axelarChainId: "immutable",
    axelarChainName: "Immutable",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...avalanche,
    rpcUrls: createRpcUrlConfig(
      avalanche,
      ENVIRONMENTS.mainnet,
      ["https://1rpc.io/avax/c"],
      "Avalanche"
    ),
    axelarChainId: "Avalanche",
    axelarChainName: "Avalanche",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...avalancheFuji,
    rpcUrls: createRpcUrlConfig(
      avalancheFuji,
      ENVIRONMENTS.testnet,
      [],
      "Avalanche"
    ),
    axelarChainId: "Avalanche",
    axelarChainName: "Avalanche",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...polygon,
    rpcUrls: createRpcUrlConfig(
      polygon,
      ENVIRONMENTS.mainnet,
      ["https://polygon-rpc.com"],
      "Polygon"
    ),
    axelarChainId: "Polygon",
    axelarChainName: "Polygon",
    environment: ENVIRONMENTS.mainnet,
    supportWagmi: true,
  },
  {
    ...polygonAmoy,
    rpcUrls: createRpcUrlConfig(
      polygonAmoy,
      ENVIRONMENTS.testnet,
      [],
      "polygon-sepolia"
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
      ENVIRONMENTS.mainnet,
      [],
      "polygon-zkevm"
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
      ENVIRONMENTS.testnet,
      [],
      "polygon-zkevm"
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
      ENVIRONMENTS.mainnet,
      ["https://bsc.blockrazor.xyz"],
      "binance"
    ),
    axelarChainId: "binance",
    axelarChainName: "binance",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...bscTestnet,
    rpcUrls: createRpcUrlConfig(
      bscTestnet,
      ENVIRONMENTS.testnet,
      [],
      "binance"
    ),
    axelarChainId: "binance",
    axelarChainName: "binance",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...arbitrum,
    rpcUrls: createRpcUrlConfig(arbitrum, ENVIRONMENTS.mainnet, [], "arbitrum"),
    axelarChainId: "arbitrum",
    axelarChainName: "arbitrum",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...arbitrumSepolia,
    rpcUrls: createRpcUrlConfig(
      arbitrumSepolia,
      ENVIRONMENTS.testnet,
      [],
      "arbitrum-sepolia"
    ),
    axelarChainId: "arbitrum-sepolia",
    axelarChainName: "arbitrum-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...celo,
    rpcUrls: createRpcUrlConfig(
      celo,
      ENVIRONMENTS.mainnet,
      ["https://1rpc.io/celo"],
      "celo"
    ),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...celoAlfajores,
    rpcUrls: createRpcUrlConfig(
      celoAlfajores,
      ENVIRONMENTS.testnet,
      [],
      "celo"
    ),
    axelarChainId: "celo",
    axelarChainName: "celo",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...aurora,
    rpcUrls: createRpcUrlConfig(
      aurora,
      ENVIRONMENTS.mainnet,
      ["https://1rpc.io/aurora"],
      "aurora"
    ),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...auroraTestnet,
    rpcUrls: createRpcUrlConfig(
      auroraTestnet,
      ENVIRONMENTS.testnet,
      [],
      "aurora"
    ),
    axelarChainId: "aurora",
    axelarChainName: "aurora",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...optimism,
    rpcUrls: createRpcUrlConfig(optimism, ENVIRONMENTS.mainnet, [], "optimism"),
    axelarChainId: "optimism",
    axelarChainName: "optimism",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...optimismSepolia,
    rpcUrls: createRpcUrlConfig(
      optimismSepolia,
      ENVIRONMENTS.testnet,
      [],
      "optimism-sepolia"
    ),
    axelarChainId: "optimism-sepolia",
    axelarChainName: "optimism-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...kava,
    rpcUrls: createRpcUrlConfig(kava, ENVIRONMENTS.mainnet, [], "kava"),
    axelarChainId: "kava",
    axelarChainName: "kava",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...kavaTestnet,
    rpcUrls: createRpcUrlConfig(kavaTestnet, ENVIRONMENTS.testnet, [], "kava"),
    axelarChainId: "kava",
    axelarChainName: "kava",
    environment: ENVIRONMENTS.testnet,
    supportWagmi: true,
  },
  {
    ...filecoinCalibration,
    rpcUrls: createRpcUrlConfig(
      filecoinCalibration,
      ENVIRONMENTS.testnet,
      [],
      "filecoin-2"
    ),
    axelarChainId: "filecoin-2",
    axelarChainName: "filecoin-2",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...filecoin,
    rpcUrls: createRpcUrlConfig(
      filecoin,
      ENVIRONMENTS.mainnet,
      ["https://rpc.ankr.com/filecoin"],
      "filecoin"
    ),
    axelarChainId: "filecoin",
    axelarChainName: "filecoin",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...base,
    rpcUrls: createRpcUrlConfig(
      base,
      ENVIRONMENTS.mainnet,
      ["https://base.llamarpc.com"],
      "base"
    ),
    axelarChainId: "base",
    axelarChainName: "base",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...baseSepolia,
    rpcUrls: createRpcUrlConfig(
      baseSepolia,
      ENVIRONMENTS.testnet,
      [],
      "base-sepolia"
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
      ENVIRONMENTS.testnet,
      [],
      "linea-sepolia"
    ),
    axelarChainId: "linea-sepolia",
    axelarChainName: "linea-sepolia",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...lineaTestnet,
    rpcUrls: createRpcUrlConfig(
      lineaTestnet,
      ENVIRONMENTS.testnet,
      [],
      "linea"
    ),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...linea,
    rpcUrls: createRpcUrlConfig(
      linea,
      ENVIRONMENTS.mainnet,
      ["https://1rpc.io/linea"],
      "linea"
    ),
    axelarChainId: "linea",
    axelarChainName: "linea",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantle,
    rpcUrls: createRpcUrlConfig(
      mantle,
      ENVIRONMENTS.mainnet,
      ["https://rpc.mantle.xyz"],
      "mantle"
    ),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...mantleTestnet,
    rpcUrls: createRpcUrlConfig(
      mantleTestnet,
      ENVIRONMENTS.testnet,
      [],
      "mantle"
    ),
    axelarChainId: "mantle",
    axelarChainName: "mantle",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...scroll,
    rpcUrls: createRpcUrlConfig(scroll, ENVIRONMENTS.mainnet, [], "scroll"),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...scrollSepolia,
    rpcUrls: createRpcUrlConfig(
      scrollSepolia,
      ENVIRONMENTS.testnet,
      [],
      "scroll"
    ),
    axelarChainId: "scroll",
    axelarChainName: "scroll",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...fraxtal,
    rpcUrls: createRpcUrlConfig(fraxtal, ENVIRONMENTS.mainnet, [], "fraxtal"),
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...fraxtalTestnet,
    rpcUrls: createRpcUrlConfig(
      fraxtalTestnet,
      ENVIRONMENTS.testnet,
      [],
      "fraxtal"
    ),
    axelarChainId: "fraxtal",
    axelarChainName: "fraxtal",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...blast,
    rpcUrls: createRpcUrlConfig(
      blast,
      ENVIRONMENTS.mainnet,
      ["https://rpc.envelop.is/blast"],
      "blast"
    ),
    axelarChainId: "blast",
    axelarChainName: "blast",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...blastSepolia,
    rpcUrls: createRpcUrlConfig(
      blastSepolia,
      ENVIRONMENTS.testnet,
      [],
      "blast-sepolia"
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
      ENVIRONMENTS.devnet,
      [],
      "avalanche-fuji"
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
      ENVIRONMENTS.devnet,
      [],
      "optimism-sepolia"
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
      ENVIRONMENTS.devnet,
      ["https://endpoints.omniatech.io/v1/eth/sepolia/public"],
      "eth-sepolia"
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
      ENVIRONMENTS.testnet,
      [],
      "xrpl-evm"
    ),
    axelarChainId: "xrpl-evm",
    axelarChainName: "xrpl-evm",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...berachain,
    rpcUrls: createRpcUrlConfig(
      berachain,
      ENVIRONMENTS.mainnet,
      [],
      "berachain"
    ),
    axelarChainId: "berachain",
    axelarChainName: "berachain",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...berachainBepolia,
    rpcUrls: createRpcUrlConfig(
      berachainBepolia,
      ENVIRONMENTS.testnet,
      [],
      "berachain-bepolia"
    ),
    axelarChainId: "berachain",
    axelarChainName: "berachain",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...xrplEvm,
    rpcUrls: createRpcUrlConfig(xrplEvm, ENVIRONMENTS.mainnet, [], "xrpl-evm"),
    axelarChainId: "xrpl-evm",
    axelarChainName: "xrpl-evm",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...hederaTestnet,
    rpcUrls: createRpcUrlConfig(
      hederaTestnet,
      ENVIRONMENTS.testnet,
      [],
      "hedera"
    ),
    axelarChainId: "hedera",
    axelarChainName: "hedera",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...hedera,
    rpcUrls: createRpcUrlConfig(hedera, ENVIRONMENTS.mainnet, [], "hedera"),
    axelarChainId: "hedera",
    axelarChainName: "hedera",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...plumeMainnet,
    rpcUrls: createRpcUrlConfig(
      plumeMainnet,
      ENVIRONMENTS.mainnet,
      [],
      "plume"
    ),
    axelarChainId: "plume",
    axelarChainName: "plume",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...plumeSepolia,
    rpcUrls: createRpcUrlConfig(
      plumeSepolia,
      ENVIRONMENTS.testnet,
      [],
      "plume"
    ),
    axelarChainId: "plume",
    axelarChainName: "plume",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
  {
    ...hyperEVM,
    rpcUrls: createRpcUrlConfig(
      hyperEVM,
      ENVIRONMENTS.mainnet,
      [],
      "hyperliquid"
    ),
    axelarChainId: "hyperliquid",
    axelarChainName: "hyperliquid",
    supportWagmi: true,
    environment: ENVIRONMENTS.mainnet,
  },
  {
    ...hyperEVMTestnet,
    rpcUrls: createRpcUrlConfig(
      hyperEVMTestnet,
      ENVIRONMENTS.testnet,
      [],
      "hyperliquid"
    ),
    axelarChainId: "hyperliquid",
    axelarChainName: "hyperliquid",
    supportWagmi: true,
    environment: ENVIRONMENTS.testnet,
  },
] as const;

export const EVM_CHAIN_CONFIGS = EVM_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV
) as [ExtendedWagmiChainConfig, ...ExtendedWagmiChainConfig[]];
