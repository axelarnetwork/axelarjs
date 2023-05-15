export const ENVIRONMENTS = {
  testnet: "testnet",
  mainnet: "mainnet",
  devnet: "devnet",
} as const;

export type Environment = keyof typeof ENVIRONMENTS;
