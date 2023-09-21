import { StdFee } from "@cosmjs/stargate";

export type Environment = "devnet" | "testnet" | "mainnet";

export interface AxelarRpcClientConfig {
  axelarRpcUrl?: string;
  environment: Environment;
  broadcastOptions?: BroadcastTxOptions;
}

export type BroadcastTxOptions =
  | {
      broadcastPollIntervalMs?: number;
      broadcastTimeoutMs?: number;
      fee?: StdFee;
    }
  | undefined;
