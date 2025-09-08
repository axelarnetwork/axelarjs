import { STELLAR_RPC_URLS, SUI_RPC_URLS } from "@axelarjs/core";

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

export const xrpl = {
  id: 114,
  axelarChainId: "xrpl",
  axelarChainName: "XRPL",
  environment: ENVIRONMENTS.mainnet,
  name: "XRPL",
  nativeCurrency: {
    name: "XRP",
    symbol: "XRP",
    decimals: 6,
  },
  rpcUrls: createRpcUrlConfig("xrpl", ENVIRONMENTS.mainnet, [
    "https://xrpl.ws/", // TODO: don't declare it here
  ]),
  blockExplorers: {
    default: {
      name: "XRPL Explorer",
      url: "https://livenet.xrpl.org",
    },
  },
  supportWagmi: false,
};

const xrplTestnet = {
  ...xrpl,
  id: 115,
  rpcUrls: createRpcUrlConfig("xrpl", ENVIRONMENTS.testnet, [
    "https://s.altnet.rippletest.net:51234", // TODO: don't declare it here
  ]),
  blockExplorers: {
    default: {
      name: "XRPL Explorer",
      url: "https://testnet.xrpl.org",
    },
  },
  environment: ENVIRONMENTS.testnet,
  name: "XRPL Testnet",
};

const xrplDevnet = {
  ...xrplTestnet,
  id: 116,
  axelarChainId: "xrpl-dev",
  environment: ENVIRONMENTS.devnet,
  rpcUrls: createRpcUrlConfig("xrpl", ENVIRONMENTS.testnet, [
    "https://s.devnet.rippletest.net:51234/", // TODO: don't declare it here
  ]),
  blockExplorers: {
    default: {
      name: "XRPL Explorer",
      url: "https://devnet.xrpl.org/",
    },
  },
  name: "XRPL Devnet",
};


export const VM_CHAINS: ExtendedWagmiChainConfig[] = [
  sui,
  suiTestnet,
  suiDevnet,
  stellar,
  stellarTestnet,
  stellarDevnet,
  xrpl,
  xrplTestnet,
  xrplDevnet,
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

export const xrplChainConfig = VM_CHAIN_CONFIGS.find((chain) => {
  chain.axelarChainId.includes("xrpl");
}) as ExtendedWagmiChainConfig;