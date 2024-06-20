import { defineChain } from "viem";

export const centrifuge = defineChain({
  id: 2090,
  name: "Centrifuge",
  network: "centrifuge",
  nativeCurrency: { name: "Centrifuge", symbol: "CFG", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://fullnode.parachain.centrifuge.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Centrifuge Explorer",
      url: "https://centrifuge.subscan.io/",
    },
  },
});

export const centrifugeTestnet = defineChain({
  id: 2032,
  name: "Centrifuge Testnet",
  network: "centrifuge",
  nativeCurrency: { name: "Centrifuge", symbol: "CFG", decimals: 18 },
  rpcUrls: {
    default: {
      http: [""],
    },
  },
});
