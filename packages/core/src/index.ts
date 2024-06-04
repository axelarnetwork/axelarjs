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
  testnet: "https://testnet.api.axelarscan.io",
  mainnet: "https://api.axelarscan.io",
} as const;

export type AxelarscanAPIUrl = keyof typeof AXELARSCAN_API_URLS;

export const AXELARSCAN_UI_URLS = {
  testnet: "https://testnet.axelarscan.io",
  mainnet: "https://axelarscan.io",
} as const;

export type AxelarscanUIUrl = keyof typeof AXELARSCAN_UI_URLS;

export const GMP_API_URLS = {
  testnet: "https://testnet.api.gmp.axelarscan.io",
  mainnet: "https://api.gmp.axelarscan.io",
} as const;

export type GMPAPIUrl = keyof typeof GMP_API_URLS;

export const AXELAR_CONFIG_API_URLS = {
  testnet: "https://axelar-testnet.s3.us-east-2.amazonaws.com",
  mainnet: "https://axelar-mainnet.s3.us-east-2.amazonaws.com",
} as const;

export type AxelarConfigAPIUrl = keyof typeof AXELAR_CONFIG_API_URLS;

export const DEPOSIT_ADDRESS_API_URLS = {
  testnet: "https://nest-server-testnet.axelar.dev",
  mainnet: "https://nest-server-mainnet.axelar.dev",
} as const;

export type DepositAddressAPIUrl = keyof typeof DEPOSIT_ADDRESS_API_URLS;

export const DEPOSIT_SERVICE_API_URLS = {
  testnet: "https://deposit-service.testnet.axelar.dev",
  mainnet: "https://deposit-service.mainnet.axelar.dev",
} as const;

export type DepositServiceAPIUrl = keyof typeof DEPOSIT_SERVICE_API_URLS;

export const AXELAR_RPC_URLS = {
  testnet: "https://rpc-axelar-testnet.imperator.co",
  mainnet: "https://rpc-axelar.imperator.co",
} as const;

export type AxelarRPCUrlFallback = typeof AXELAR_RPC_URLS_FALLBACK;

export const AXELAR_RPC_URLS_FALLBACK = {
  testnet: [
    AXELAR_RPC_URLS.testnet,
    "https://tm.axelar-testnet.lava.build:443",
    "https://axelartest-rpc.quickapi.com:443",
    "https://axelar-rpc-1.staketab.org:443",
  ],
  mainnet: [
    AXELAR_RPC_URLS.mainnet,
    "https://tm.axelar.lava.build",
    "https://rpc-axelar.imperator.co",
    "https://axelar-rpc.quickapi.com:443",
  ],
} as const;

export const AXELAR_LCD_URLS = {
  testnet: "https://lcd-axelar-testnet.imperator.co",
  mainnet: "https://lcd-axelar.imperator.co",
} as const;

export type AxelarLCDUrlFallback = typeof AXELAR_LCD_URLS_FALLBACK;

export const AXELAR_LCD_URLS_FALLBACK = {
  testnet: [
    AXELAR_LCD_URLS.testnet,
    "https://tm.axelar-testnet.lava.build:1317",
    "https://axelartest-lcd.quickapi.com:443",
    "https://axelar-lcd-1.staketab.org:443",
  ],
  mainnet: [
    AXELAR_LCD_URLS.mainnet,
    "https://tm.axelar.lava.build:1317",
    "https://lcd-axelar.imperator.co",
    "https://axelar-lcd.quickapi.com:443",
  ],
} as const;

export type AxelarRPCUrl = keyof typeof AXELAR_RPC_URLS;

export const AXELAR_RECOVERY_API_URLS = {
  testnet: "https://axelar-signing-relayer-testnet.axelar.dev",
  mainnet: "https://axelar-signing-relayer-mainnet.axelar.dev",
};

export type AxelarRecoveryAPIUrl = keyof typeof AXELAR_RECOVERY_API_URLS;
