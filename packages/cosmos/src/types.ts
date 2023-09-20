import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { SigningStargateClientOptions } from "@cosmjs/stargate";

export type Environment = "devnet" | "testnet" | "mainnet" | "local";

export type CosmosBasedWalletDetails = {
  mnemonic?: string;
  offlineSigner?: OfflineSigner;
};
export interface AxelarQueryClientConfig {
  axelarRpcUrl?: string;
  environment: Environment;
}

export interface AxelarSigningClientConfig extends AxelarQueryClientConfig {
  cosmosBasedWalletDetails: CosmosBasedWalletDetails;
  options: SigningStargateClientOptions;
}
