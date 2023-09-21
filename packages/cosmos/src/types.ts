import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClientOptions, StdFee } from "@cosmjs/stargate";

export type Environment = "devnet" | "testnet" | "mainnet";

export type CosmosBasedWalletDetails = {
  mnemonic?: string;
  offlineSigner?: OfflineSigner;
};
export interface AxelarRpcClientConfig {
  axelarRpcUrl?: string;
  environment: Environment;
  broadcastOptions?: BroadcastTxOptions;
}

export interface AxelarSigningClientConfig extends AxelarRpcClientConfig {
  cosmosBasedWalletDetails: CosmosBasedWalletDetails;
  options: SigningStargateClientOptions;
}

export type BroadcastTxOptions =
  | {
      broadcastPollIntervalMs?: number;
      broadcastTimeoutMs?: number;
      fee?: StdFee;
    }
  | undefined;
