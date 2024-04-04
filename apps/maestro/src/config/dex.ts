export const dexLinks = {
  arbitrum: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=arbitrum`,
    icon: "/logos/dexes/uniswap.png",
  }),
  binance: (tokenAddress: `0x${string}`) => ({
    name: "PancakeSwap",
    url: `https://pancakeswap.finance/add/BNB/${tokenAddress}?chain=bsc`,
    icon: "/logos/dexes/pancakeswap.png",
  }),
  avalanche: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=avalanche`,
    icon: "/logos/dexes/uniswap.png",
  }),
  celo: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=celo`,
    icon: "/logos/dexes/uniswap.png",
  }),
  fantom: (tokenAddress: `0x${string}`) => ({
    name: "SpookySwap",
    url: `https://spooky.fi/#/add/ETH/${tokenAddress}?chain=fantom`,
    icon: "/logos/dexes/spookyswap.png",
  }),
  polygon: (tokenAddress: `0x${string}`) => ({
    name: "QuickSwap",
    url: `https://quickswap.exchange/#/add/ETH/${tokenAddress}?chain=polygon`,
    icon: "/logos/dexes/quickswap.svg",
  }),
  base: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=base`,
    icon: "/logos/dexes/uniswap.png",
  }),
  ethereum: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=mainnet`,
    icon: "/logos/dexes/thruster.svg",
  }),
  // This dex doesn't accept token address as a parameter, so we can't prefill the token for users.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blast: (_tokenAddress: `0x${string}`) => ({
    name: "Thruster",
    url: "https://app.thruster.finance/add",
    icon: "/logos/dexes/thruster.svg",
  }),
  filecoin: (tokenAddress: `0x${string}`) => ({
    name: "SushiSwap",
    url: `https://www.sushi.com/pool/add?chainId=314&toCurrency=${tokenAddress}&fromCurrency=NATIVE`,
    icon: "/logos/dexes/sushi.svg",
  }),
  // This dex doesn't accept token address as a parameter, so we can't prefill the token for users.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fraxtal: (_tokenAddress: `0x${string}`) => ({
    name: "RA Exchange",
    url: "https://www.ra.exchange/liquidity/v2/add",
    icon: "/logos/dexes/ra.svg",
  }),
  kava: (tokenAddress: `0x${string}`) => ({
    name: "Kinetix",
    url: `https://dex.kinetix.finance/#/pools?currency0=ETH&currency1=${tokenAddress}`,
    icon: "/logos/dexes/kinetix.svg",
  }),
  linea: (tokenAddress: `0x${string}`) => ({
    name: "PancakeSwap",
    url: `https://pancakeswap.finance/add/ETH/${tokenAddress}?chain=linea`,
    icon: "/logos/dexes/pancakeswap.png",
  }),
  mantle: (tokenAddress: `0x${string}`) => ({
    name: "FusionX",
    url: `https://fusionx.finance/add/MNT/${tokenAddress}?chain=mantle`,
    icon: "/logos/dexes/fusionx.png",
  }),
  moonbeam: (tokenAddress: `0x${string}`) => ({
    name: "StellaSwap",
    url: `https://app.stellaswap.com/pulsar/add/ETH/${tokenAddress}`,
    icon: "/logos/dexes/stellaswap.png",
  }),
  optimism: (tokenAddress: `0x${string}`) => ({
    name: "Uniswap",
    url: `https://app.uniswap.org/add/ETH/${tokenAddress}?chain=optimism`,
    icon: "/logos/dexes/uniswap.png",
  }),
  scroll: (tokenAddress: `0x${string}`) => ({
    name: "SushiSwap",
    url: `https://www.sushi.com/pool/add?chainId=534352&toCurrency=${tokenAddress}&fromCurrency=NATIVE`,
    icon: "/logos/dexes/sushi.svg",
  }),
} as any;
