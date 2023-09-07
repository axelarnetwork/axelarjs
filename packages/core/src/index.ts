export const ENVIRONMENTS = {
  testnet: "testnet",
  mainnet: "mainnet",
} as const;

export type Environment = keyof typeof ENVIRONMENTS;

export const COSMOS_GAS_RECEIVER_OPTIONS = {
  testnet: "axelar1zl3rxpp70lmte2xr6c4lgske2fyuj3hupcsvcd",
  mainnet: "axelar1aythygn6z5thymj6tmzfwekzh05ewg3l7d6y89",
} as const;

export type CosmosGasReceiver = keyof typeof COSMOS_GAS_RECEIVER_OPTIONS;

export const AXELARSCAN_API_URLS = {
  testnet: "https://testnet.api.gmp.axelarscan.io",
  mainnet: "https://api.gmp.axelarscan.io",
} as const;

export type AxelarscanUrl = keyof typeof AXELARSCAN_API_URLS;
