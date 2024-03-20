import { QueryServiceClientImpl as AxelarnetQueryClient } from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import { QueryServiceClientImpl as EVMQueryClient } from "@axelarjs/proto/axelar/evm/v1beta1/service";
import { QueryServiceClientImpl as MultisigQueryClient } from "@axelarjs/proto/axelar/multisig/v1beta1/service";
import { QueryServiceClientImpl as NexusQueryClient } from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import { QueryClientImpl as PermissionQueryClient } from "@axelarjs/proto/axelar/permission/v1beta1/service";
import { QueryServiceClientImpl as RewardQueryClient } from "@axelarjs/proto/axelar/reward/v1beta1/service";
import { QueryServiceClientImpl as SnapshotQueryClient } from "@axelarjs/proto/axelar/snapshot/v1beta1/service";
import { QueryServiceClientImpl as TSSQueryClient } from "@axelarjs/proto/axelar/tss/v1beta1/service";
import { QueryServiceClientImpl as VoteQueryClient } from "@axelarjs/proto/axelar/vote/v1beta1/service";

import {
  createProtobufRpcClient,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupStakingExtension,
  setupTxExtension,
} from "@cosmjs/stargate";
import { HttpEndpoint, Tendermint37Client } from "@cosmjs/tendermint-rpc";

import type { Rpc, StringLiteral } from "./types";

const setupBareExtension =
  <TModule, TClient>(
    moduleName: StringLiteral<TModule>,
    client: { new (rpc: Rpc): TClient },
  ) =>
  (base: QueryClient) => {
    const rpc = createProtobufRpcClient(base);
    const baseClient = new client(rpc);

    const clientWithUncapitalizedMethods = Object.fromEntries(
      Object.getOwnPropertyNames(Object.getPrototypeOf(baseClient))
        .filter((x) => x !== "constructor")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((x) => typeof (baseClient as any)[x] === "function")
        .map((x) => [
          x[0]?.toLowerCase() + x.slice(1),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((baseClient as any)[x] as (...args: any[]) => unknown).bind(
            baseClient,
          ),
        ]),
    ) as {
      [P in keyof TClient as P extends string
        ? Uncapitalize<P>
        : P]: TClient[P];
    };

    return {
      [moduleName]: clientWithUncapitalizedMethods,
    } as {
      [P in StringLiteral<TModule>]: typeof clientWithUncapitalizedMethods;
    };
  };

const createQueryClientFromTmClient = (tmClient: Tendermint37Client) =>
  QueryClient.withExtensions(
    tmClient,
    setupAuthExtension,
    setupBankExtension,
    setupStakingExtension,
    setupTxExtension,
    setupBareExtension("axelarnet", AxelarnetQueryClient),
    setupBareExtension("evm", EVMQueryClient),
    setupBareExtension("multisig", MultisigQueryClient),
    setupBareExtension("permission", PermissionQueryClient),
    setupBareExtension("nexus", NexusQueryClient),
    setupBareExtension("reward", RewardQueryClient),
    setupBareExtension("snapshot", SnapshotQueryClient),
    setupBareExtension("tss", TSSQueryClient),
    setupBareExtension("vote", VoteQueryClient),
  );

const createQueryClientFromEndpoint = async (endpoint: string | HttpEndpoint) =>
  createQueryClientFromTmClient(await Tendermint37Client.connect(endpoint));

export type AxelarQueryClient = ReturnType<
  typeof createQueryClientFromTmClient
>;

export function createQueryClient(
  endpoint: string | HttpEndpoint,
): Promise<AxelarQueryClient>;
export function createQueryClient(
  tmClient: Tendermint37Client,
): AxelarQueryClient;
export function createQueryClient(
  endpointOrTmClient: string | HttpEndpoint | Tendermint37Client,
) {
  return endpointOrTmClient instanceof Tendermint37Client
    ? createQueryClientFromTmClient(endpointOrTmClient)
    : createQueryClientFromEndpoint(endpointOrTmClient);
}
