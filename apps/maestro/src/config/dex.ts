export const dexLinks = {
  arbitrum: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=arbitrum`,
    icon: "/icons/uniswap.png",
  }),
  binance: (tokenAddress: `0x${string}`) => ({
    name: "PancakeSwap",
    url: `https://pancakeswap.finance/add/BNB/${tokenAddress}?chain=bsc`,
    icon: "/icons/pancake.png",
  }),
  avalanche: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=avalanche`,
    icon: "/icons/uniswap.png",
  }),
  celo: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=celo`,
    icon: "/icons/uniswap.png",
  }),
  fantom: (tokenAddress: `0x${string}`) => ({
    name: "SpookySwap",
    url: `https://spooky.fi/#/add/ETH/${tokenAddress}?chain=fantom`,
    icon: "/icons/spookyswap.png",
  }),
  polygon: (tokenAddress: `0x${string}`) => ({
    name: "QuickSwap",
    url: `https://quickswap.exchange/#/add/ETH/${tokenAddress}?chain=polygon`,
    icon: "/icons/quickswap.png",
  }),
  base: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=base`,
    icon: "/icons/uniswap.png",
  }),
} as any;
