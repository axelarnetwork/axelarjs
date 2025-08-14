import { defineChain } from "viem";

export const hyperliquid = defineChain({
  id: 1440001,
  name: "Hyperliquid",
  network: "hyperliquid",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.hyperliquid.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Purrsec",
      url: "https://purrsec.com",
    },
  },
});

export const hyperliquidTestnet = defineChain({
  id: 998,
  name: "Hyperliquid Testnet",
  network: "hyperliquid-testnet",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.hyperliquid-testnet.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Purrsec Testnet",
      url: "https://testnet.purrsec.com",
    },
  },
});
