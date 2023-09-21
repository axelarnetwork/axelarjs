import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClientOptions, StdFee } from "@cosmjs/stargate";
import { Rpc } from "cosmjs-types/helpers";

export type Environment = "devnet" | "testnet" | "mainnet";

export type CosmosBasedWalletDetails = {
  mnemonic?: string;
  offlineSigner?: OfflineSigner;
};
export interface AxelarQueryClientConfig {
  axelarRpcUrl?: string;
  environment: Environment;
  rpcImpl: Rpc;
  broadcastOptions?: BroadcastTxOptions;
}

export interface AxelarSigningClientConfig extends AxelarQueryClientConfig {
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
