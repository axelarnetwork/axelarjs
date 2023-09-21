import {
  MsgServiceClientImpl as AxelarnetMSCI,
  QueryServiceClientImpl as AxelarnetQSCI,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import {
  MsgServiceClientImpl as EVMMSCI,
  QueryServiceClientImpl as EVMQSCI,
} from "@axelarjs/proto/axelar/evm/v1beta1/service";
import {
  MsgServiceClientImpl as MultisigMSCI,
  QueryServiceClientImpl as MultisigQSCI,
} from "@axelarjs/proto/axelar/multisig/v1beta1/service";
import {
  MsgServiceClientImpl as NexusMSCI,
  QueryServiceClientImpl as NexusQSCI,
} from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import {
  MsgClientImpl as PermissionMSCI,
  QueryClientImpl as PermissionQSCI,
} from "@axelarjs/proto/axelar/permission/v1beta1/service";
import {
  MsgServiceClientImpl as RewardMSCI,
  QueryServiceClientImpl as RewardQSCI,
} from "@axelarjs/proto/axelar/reward/v1beta1/service";
import {
  MsgServiceClientImpl as SnapshotMSCI,
  QueryServiceClientImpl as SnapshotQSCI,
} from "@axelarjs/proto/axelar/snapshot/v1beta1/service";
import {
  MsgServiceClientImpl as TSSMSCI,
  QueryServiceClientImpl as TSSQSCI,
} from "@axelarjs/proto/axelar/tss/v1beta1/service";
import {
  MsgServiceClientImpl as VoteMSCI,
  QueryServiceClientImpl as VoteQSCI,
} from "@axelarjs/proto/axelar/vote/v1beta1/service";

import {
  createProtobufRpcClient,
  ProtobufRpcClient,
  QueryClient,
} from "@cosmjs/stargate";

const QUERY_SERVICES = {
  axelarnet: AxelarnetQSCI,
  evm: EVMQSCI,
  multisig: MultisigQSCI,
  permission: PermissionQSCI,
  nexus: NexusQSCI,
  reward: RewardQSCI,
  snapshot: SnapshotQSCI,
  tss: TSSQSCI,
  vote: VoteQSCI,
} as const;

const BROADCAST_SERVICES = {
  axelarnet: AxelarnetMSCI,
  evm: EVMMSCI,
  multisig: MultisigMSCI,
  permission: PermissionMSCI,
  nexus: NexusMSCI,
  reward: RewardMSCI,
  snapshot: SnapshotMSCI,
  tss: TSSMSCI,
  vote: VoteMSCI,
} as const;

type QueryServiceName = keyof typeof QUERY_SERVICES;

type BroadcastServiceName = keyof typeof BROADCAST_SERVICES;

export const setupRpcClientQueryExtensions = (client: ProtobufRpcClient) =>
  Object.entries(QUERY_SERVICES).reduce(
    (acc, [key, Ctrl]) => ({ ...acc, [key]: new Ctrl(client) }),
    {} as {
      [key in QueryServiceName]: InstanceType<(typeof QUERY_SERVICES)[key]>;
    }
  );

export const setupRpcClientBroadcastExtension = (rpcImpl: ProtobufRpcClient) =>
  Object.entries(BROADCAST_SERVICES).reduce(
    (acc, [key, Ctrl]) => ({ ...acc, [key]: new Ctrl(rpcImpl) }),
    {} as {
      [key in BroadcastServiceName]: InstanceType<
        (typeof BROADCAST_SERVICES)[key]
      >;
    }
  );

export function setupQueryClientExtension(base: QueryClient) {
  const client = createProtobufRpcClient(base);

  return setupRpcClientQueryExtensions(client);
}

export type AxelarQueryService = ReturnType<typeof setupQueryClientExtension>;
