import { SUI_RPC_URLS } from "@axelarjs/core";

import { NEXT_PUBLIC_NETWORK_ENV } from "./env";
import { ExtendedWagmiChainConfig } from "./evm-chains";

const ENVIRONMENTS = {
  mainnet: "mainnet",
  devnet: "devnet-amplifier",
  testnet: "testnet",
} as const;

export type VMChainConfig = ExtendedWagmiChainConfig & {
  supportWagmi?: boolean;
};

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
  rpcUrls: {
    default: { http: [SUI_RPC_URLS.mainnet] },
    public: { http: [SUI_RPC_URLS.mainnet] },
  },
  blockExplorers: {
    default: { name: "Sui Explorer", url: "https://suiexplorer.com/" },
  },
  supportWagmi: false,
};

const suiTestnet = {
  ...sui,
  id: 103,
  environment: ENVIRONMENTS.testnet,
  rpcUrls: {
    default: { http: [SUI_RPC_URLS.testnet] },
    public: { http: [SUI_RPC_URLS.testnet] },
  },
  blockExplorers: {
    default: { name: "Sui Explorer", url: "https://suiscan.xyz/testnet" },
  },
};

export const VM_CHAINS: VMChainConfig[] = [
  sui,
  suiTestnet,
  {
    ...suiTestnet,
    environment: ENVIRONMENTS.devnet,
  },
] as const;

export const VM_CHAIN_CONFIGS = VM_CHAINS.filter(
  (chain) => chain.environment === NEXT_PUBLIC_NETWORK_ENV
);

export const WAGMI_VM_CHAIN_CONFIGS = VM_CHAIN_CONFIGS.filter(
  (chain) => chain.supportWagmi
);
