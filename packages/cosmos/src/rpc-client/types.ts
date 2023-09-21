import {
  MsgService as AxelarnetMS,
  MsgServiceClientImpl as AxelarnetMSCI,
  QueryService as AxelarnetQS,
  QueryServiceClientImpl as AxelarnetQSCI,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import {
  MsgService as EVMMS,
  MsgServiceClientImpl as EVMMSCI,
  QueryService as EvmQS,
  QueryServiceClientImpl as EVMQSCI,
} from "@axelarjs/proto/axelar/evm/v1beta1/service";
import {
  MsgService as MultisigMS,
  MsgServiceClientImpl as MultisigMSCI,
  QueryService as MultisigQS,
  QueryServiceClientImpl as MultisigQSCI,
} from "@axelarjs/proto/axelar/multisig/v1beta1/service";
import {
  MsgService as NexusMS,
  MsgServiceClientImpl as NexusMSCI,
  QueryService as NexusQS,
  QueryServiceClientImpl as NexusQSCI,
} from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import {
  Msg as PermissionMS,
  MsgClientImpl as PermissionMSCI,
  Query as PermissionQS,
  QueryClientImpl as PermissionQSCI,
} from "@axelarjs/proto/axelar/permission/v1beta1/service";
import {
  MsgService as RewardMS,
  MsgServiceClientImpl as RewardMSCI,
  QueryService as RewardQS,
  QueryServiceClientImpl as RewardQSCI,
} from "@axelarjs/proto/axelar/reward/v1beta1/service";
import {
  MsgService as SnapshotMS,
  MsgServiceClientImpl as SnapshotMSCI,
  QueryService as SnapshotQS,
  QueryServiceClientImpl as SnapshotQSCI,
} from "@axelarjs/proto/axelar/snapshot/v1beta1/service";
import {
  MsgService as TSSMS,
  MsgServiceClientImpl as TSSMSCI,
  QueryService as TSSQS,
  QueryServiceClientImpl as TSSQSCI,
} from "@axelarjs/proto/axelar/tss/v1beta1/service";
import {
  MsgService as VoteMS,
  MsgServiceClientImpl as VoteMSCI,
  QueryService as VoteQS,
  QueryServiceClientImpl as VoteQSCI,
} from "@axelarjs/proto/axelar/vote/v1beta1/service";

import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Rpc } from "cosmjs-types/helpers";

export interface AxelarQueryService {
  query: {
    readonly axelarnet: AxelarnetQS;
    readonly evm: EvmQS;
    readonly multisig: MultisigQS;
    readonly permission: PermissionQS;
    readonly nexus: NexusQS;
    readonly reward: RewardQS;
    readonly snapshot: SnapshotQS;
    readonly tss: TSSQS;
    readonly vote: VoteQS;
  };
  broadcast: {
    readonly axelarnet: AxelarnetMS;
    readonly evm: EVMMS;
    readonly multisig: MultisigMS;
    readonly permission: PermissionMS;
    readonly nexus: NexusMS;
    readonly reward: RewardMS;
    readonly snapshot: SnapshotMS;
    readonly tss: TSSMS;
    readonly vote: VoteMS;
  };
}

export function setupQueryExtension(
  base: QueryClient,
  rpcImpl: Rpc
): AxelarQueryService {
  const client = createProtobufRpcClient(base);
  return {
    query: {
      axelarnet: new AxelarnetQSCI(client),
      evm: new EVMQSCI(client),
      multisig: new MultisigQSCI(client),
      permission: new PermissionQSCI(client),
      nexus: new NexusQSCI(client),
      reward: new RewardQSCI(client),
      snapshot: new SnapshotQSCI(client),
      tss: new TSSQSCI(client),
      vote: new VoteQSCI(client),
    },
    broadcast: {
      axelarnet: new AxelarnetMSCI(rpcImpl),
      evm: new EVMMSCI(client),
      multisig: new MultisigMSCI(client),
      permission: new PermissionMSCI(client),
      nexus: new NexusMSCI(client),
      reward: new RewardMSCI(client),
      snapshot: new SnapshotMSCI(client),
      tss: new TSSMSCI(client),
      vote: new VoteMSCI(client),
    },
  };
}
