import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DeliverTxResponse, QueryClient, StdFee } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import { EnvironmentConfigs, getConfigs } from "../constants";
import type { AxelarRpcClientConfig } from "../types";
import { RpcImpl } from "./rpcImpl";
import {
  AxelarQueryService,
  setupQueryClientExtension,
  setupRpcClientBroadcastExtension,
} from "./types";

export * from "../types";

export type AxelarQueryClientService = QueryClient & AxelarQueryService;

let instance: AxelarQueryClientService;

export class AxelarQueryClient extends QueryClient {
  static async init(config: AxelarRpcClientConfig) {
    if (!instance) {
      const { axelarRpcUrl, environment } = config;
      const links: EnvironmentConfigs = getConfigs(environment);
      const rpc: string = axelarRpcUrl || links.axelarRpcUrl;
      instance = QueryClient.withExtensions(
        await Tendermint34Client.connect(rpc),
        setupQueryClientExtension
      );
    }
    return instance;
  }
}

export function createAxelarRPCTxClient(
  config: AxelarRpcClientConfig & {
    axelarLcdUrl: string;
    chainId: string;
    onDeliverTxResponse: (deliverTxResponse: DeliverTxResponse) => void;
  },
  offlineSigner: DirectSecp256k1HdWallet,
  options?: {
    fee?: StdFee;
    broadcastPollIntervalMs?: number;
    broadcastTimeoutMs?: number;
  }
) {
  const axelarRpcUrl =
    config.axelarRpcUrl || getConfigs(config.environment).axelarRpcUrl;

  return setupRpcClientBroadcastExtension(
    new RpcImpl(
      axelarRpcUrl,
      config.axelarLcdUrl,
      offlineSigner,
      config.chainId,
      config.onDeliverTxResponse,
      options
    )
  );
}

export const createAxelarRPCClient = AxelarQueryClient.init;
