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
  broadcastOptions?: {
    fee?: StdFee;
  };
}

export interface AxelarSigningClientConfig extends AxelarQueryClientConfig {
  cosmosBasedWalletDetails: CosmosBasedWalletDetails;
  options: SigningStargateClientOptions;
}
