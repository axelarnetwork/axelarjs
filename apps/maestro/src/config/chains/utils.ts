import { Chain } from "viem/chains";

import { CUSTOM_RPC_NODES } from "./custom-rpc-nodes";

export interface ExtendedWagmiChainConfig extends Chain {
  axelarChainId: string;
  axelarChainName: string;
  supportWagmi: boolean;
  environment: "mainnet" | "testnet" | "devnet-amplifier";
}

const createClientRpcUrlConfig = (
  chainIdOrChain: string | Chain,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  extras: string[] = [],
  axelarChainId?: string
) => {
  // Handle the case where a Chain object is provided
  let chainId: string;
  let baseUrls: string[];

  if (typeof chainIdOrChain === "string") {
    // VM chains configuration case
    chainId = chainIdOrChain;
    baseUrls = [];
  } else {
    // EVM chain configuration case
    chainId = axelarChainId || "";
    baseUrls = Array.from(chainIdOrChain.rpcUrls.default.http);
  }

  // custom RPC overrides for all environments
  const customUrls =
    CUSTOM_RPC_NODES[environment]?.[chainId.toLowerCase()] ?? [];

  // build unified URL list with custom nodes and extras
  const urls = [...customUrls, ...extras, ...baseUrls];

  return {
    default: { http: urls },
    public: { http: urls },
  };
};

const createServerRpcUrlConfig = (
  chainIdOrChain: string | Chain,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  extras: string[] = [],
  axelarChainId?: string
) => {
  // Handle the case where a Chain object is provided
  let chainId: string;
  let baseUrls: string[];

  if (typeof chainIdOrChain === "string") {
    // VM chains configuration case
    chainId = chainIdOrChain;
    baseUrls = [];
  } else {
    // EVM chain configuration case
    chainId = axelarChainId || "";
    baseUrls = Array.from(chainIdOrChain.rpcUrls.default.http);
  }

  const serverOnlyUrls: string[] = [];

  // parse server-only URLs from environment variables
  const envKey = `RPC_${chainId}_${environment}` as const;
  const envValue = process.env[envKey];
  if (envValue) {
    serverOnlyUrls.push(envValue);
  }

  // custom RPC overrides for all environments
  const customUrls =
    CUSTOM_RPC_NODES[environment]?.[chainId.toLowerCase()] ?? [];

  // build unified URL list with custom nodes and extras
  const urls = [...serverOnlyUrls, ...customUrls, ...extras, ...baseUrls];

  return {
    default: { http: urls },
    public: { http: urls },
  };
};

export const createRpcUrlConfig = (
  chainIdOrChain: string | Chain,
  environment: "mainnet" | "testnet" | "devnet-amplifier",
  extras: string[] = [],
  axelarChainId?: string
) => {
  if (typeof window !== "undefined") {
    return createClientRpcUrlConfig(
      chainIdOrChain,
      environment,
      extras,
      axelarChainId
    );
  }

  return createServerRpcUrlConfig(
    chainIdOrChain,
    environment,
    extras,
    axelarChainId
  );
};
