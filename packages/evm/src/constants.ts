export const GAS_TOKENS = {
  ETH: "ETH",
  AVAX: "AVAX",
  GLMR: "GLMR",
  FTM: "FTM",
  MATIC: "MATIC",
  UST: "UST",
  USDC: "USDC",
  AURORA: "aETH",
  BINANCE: "BNB",
  BNBCHAIN: "BNB",
  CELO: "CELO",
  KAVA: "KAVA",
  BASE: "ETH",
} as const;

export type GasTokenKind = (typeof GAS_TOKENS)[keyof typeof GAS_TOKENS];
