import { STELLAR_RPC_URLS, SUI_RPC_URLS } from "@axelarjs/core";

import { clusterApiUrl } from "@solana/web3.js";

import { NEXT_PUBLIC_NETWORK_ENV } from "../env";
import { createRpcUrlConfig, ExtendedWagmiChainConfig } from "./evm-chains";

const ENVIRONMENTS = {
  mainnet: "mainnet",
  devnet: "devnet-amplifier",
  testnet: "testnet",
} as const;

const sui = {
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
  rpcUrls: createRpcUrlConfig("sui", ENVIRONMENTS.mainnet, [
    SUI_RPC_URLS.mainnet,
  ]),
  blockExplorers: {
    default: { name: "Sui Explorer", url: "https://suiexplorer.com/" },
  },
  supportWagmi: false,
};

const suiTestnet = {
  ...sui,
  id: 103,
  environment: ENVIRONMENTS.testnet,
  rpcUrls: createRpcUrlConfig("sui", ENVIRONMENTS.testnet, [
    SUI_RPC_URLS.testnet,
  ]),
  blockExplorers: {
    default: { name: "Sui Explorer", url: "https://suiscan.xyz/testnet" },
  },
};

const suiDevnet = {
  ...suiTestnet,
  axelarChainId: "sui-2",
  environment: ENVIRONMENTS.devnet,
};

export const stellar = {
  id: 109,
  axelarChainId: "stellar",
  axelarChainName: "stellar",
  environment: ENVIRONMENTS.mainnet,
  name: "Stellar",
  nativeCurrency: {
    name: "XLM",
    symbol: "XLM",
    decimals: 7,
  },
  rpcUrls: createRpcUrlConfig("stellar", ENVIRONMENTS.mainnet, [
    STELLAR_RPC_URLS.mainnet,
  ]),
  blockExplorers: {
    default: {
      name: "Stellar Explorer",
      url: "https://stellar.expert/explorer/public",
    },
  },
  supportWagmi: false,
};

const stellarTestnet = {
  ...stellar,
  id: 110,
  rpcUrls: createRpcUrlConfig("stellar", ENVIRONMENTS.testnet, [
    STELLAR_RPC_URLS.testnet,
  ]),
  blockExplorers: {
    default: {
      name: "Stellar Explorer",
      url: "https://stellar.expert/explorer/testnet",
    },
  },
  axelarChainId: "stellar-2025-q1",
  environment: ENVIRONMENTS.testnet,
};

const stellarDevnet = {
  ...stellarTestnet,
  environment: ENVIRONMENTS.devnet,
};

const solana = {
  id: 111,
  axelarChainId: "solana",
  axelarChainName: "solana",
  environment: ENVIRONMENTS.mainnet,
  name: "Solana",
  nativeCurrency: {
    name: "SOL",
    symbol: "SOL",
    decimals: 9,
  },
  rpcUrls: {
    default: { http: [clusterApiUrl("mainnet-beta")] },
    public: { http: [clusterApiUrl("mainnet-beta")] },
  },
  blockExplorers: {
    default: { name: "Solana Explorer", url: "https://explorer.solana.com/" },
  },
  supportWagmi: false,
};

const solanaTestnet = {
  ...solana,
  id: 112,
  environment: ENVIRONMENTS.testnet,
  name: "Solana Testnet",
  rpcUrls: {
    default: { http: [clusterApiUrl("testnet")] },
    public: { http: [clusterApiUrl("testnet")] },
  },
  blockExplorers: {
    default: {
      name: "Solana Explorer",
      url: "https://explorer.solana.com/?cluster=testnet",
    },
  },
};

const solanaDevnet = {
  ...solana,
  id: 113,
  environment: ENVIRONMENTS.devnet,
  axelarChainId: "solana-2",
  axelarChainName: "solana-2",
  name: "Solana Devnet",
  rpcUrls: {
    default: { http: [clusterApiUrl("devnet")] },
    public: { http: [clusterApiUrl("devnet")] },
  },
  blockExplorers: {
    default: {
      name: "Solana Explorer (Devnet)",
      url: "https://explorer.solana.com/?cluster=devnet",
    },
  },
};

export const VM_CHAINS: ExtendedWagmiChainConfig[] = [
  sui,
  suiTestnet,
  suiDevnet,
  stellar,
  stellarTestnet,
  stellarDevnet,
  solana,
  solanaTestnet,
  solanaDevnet,
] as const;

export const VM_CHAIN_CONFIGS = VM_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV
);

export const WAGMI_VM_CHAIN_CONFIGS = VM_CHAIN_CONFIGS.filter(
  (chain) => chain.supportWagmi
);

export const suiChainConfig = VM_CHAIN_CONFIGS.find((chain) =>
  chain.axelarChainId.includes("sui")
) as ExtendedWagmiChainConfig;

export const stellarChainConfig = VM_CHAIN_CONFIGS.find((chain) =>
  chain.axelarChainId.includes("stellar")
) as ExtendedWagmiChainConfig;

export const solanaChainConfig = VM_CHAIN_CONFIGS.find((chain) =>
  chain.axelarChainId.includes("solana")
) as ExtendedWagmiChainConfig;
