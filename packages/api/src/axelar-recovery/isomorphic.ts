import { AXELAR_RPC_URLS, Environment } from "@axelarjs/core";
import { createAxelarBroadcastClient } from "@axelarjs/cosmos";
import type { Body as HttpBody } from "@axelarjs/utils/http-client";

import type { DeliverTxResponse } from "@cosmjs/stargate";

import { AxelarConfigClient } from "../axelar-config";
import {
  RestService,
  type ClientMeta,
  type RestServiceOptions,
} from "../lib/rest-service";
import type { ChainModule } from "./types";

export type AxelarRecoveryQueryDependencies = {
  axelarConfigClient: AxelarConfigClient;
};

export class AxelarRecoveryApiClient extends RestService {
  protected env: Environment;
  protected rpcUrl: string;
  protected deps: AxelarRecoveryQueryDependencies;

  public constructor(
    options: RestServiceOptions,
    deps: AxelarRecoveryQueryDependencies,
    env: Environment,
    meta?: ClientMeta
  ) {
    super(options, meta);
    this.deps = deps;
    this.rpcUrl = AXELAR_RPC_URLS[env];
    this.env = env;
  }

  static init(
    options: RestServiceOptions,
    deps: AxelarRecoveryQueryDependencies,
    env: Environment
  ) {
    return new AxelarRecoveryApiClient(options, deps, env, {
      name: "AxelarRecoveryQueryAPI",
      version: "0.0.1",
    });
  }

  private async generateTxBytesAndBroadcast<B extends HttpBody>(
    endpoint: string,
    body: B
  ) {
    const { data: txBytes } = await this.client
      .post(endpoint, body)
      .json<{ data: Uint8Array }>();

    const broadcaster = await createAxelarBroadcastClient(this.rpcUrl);

    return broadcaster.broadcastTx(txBytes);
  }

  async confirm(
    txHash: `0x${string}`,
    module: ChainModule,
    chain: string
  ): Promise<DeliverTxResponse> {
    return this.generateTxBytesAndBroadcast("/confirm_gateway_tx", {
      txHash,
      module,
      chain,
    });
  }

  async createPendingTransfers(module: ChainModule, chain: string) {
    return this.generateTxBytesAndBroadcast("/create_pending_transfers", {
      module,
      chain,
    });
  }

  async executePendingTransfers(module: ChainModule, chain: string) {
    return this.generateTxBytesAndBroadcast("/execute_pending_transfers", {
      module,
      chain,
    });
  }

  async routeMessage(payload: string, id: string) {
    return this.generateTxBytesAndBroadcast("/route_message", {
      payload,
      id,
    });
  }

  async signCommands(chain: string, module: ChainModule) {
    return this.generateTxBytesAndBroadcast("/sign_commands", {
      chain,
      module,
    });
  }

  async signEvmTx(chain: string, gatewayAddress: `0x${string}`, data: string) {
    const response = await this.client
      .post("sign_evm_tx", {
        chain,
        gatewayAddress,
        data,
      })
      .json<{ data: string }>();

    return response.data;
  }
}
