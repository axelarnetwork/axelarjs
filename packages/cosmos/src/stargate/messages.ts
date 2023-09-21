import * as axelarnetTx from "@axelarjs/proto/axelar/axelarnet/v1beta1/tx";
import * as evmTx from "@axelarjs/proto/axelar/evm/v1beta1/tx";
import * as multisigTx from "@axelarjs/proto/axelar/multisig/v1beta1/tx";
import * as nexusTx from "@axelarjs/proto/axelar/nexus/v1beta1/tx";
import * as permissionTx from "@axelarjs/proto/axelar/permission/v1beta1/tx";
import * as rewardTx from "@axelarjs/proto/axelar/reward/v1beta1/tx";
import * as snapshotTx from "@axelarjs/proto/axelar/snapshot/v1beta1/tx";
import * as tssTx from "@axelarjs/proto/axelar/tss/v1beta1/tx";
import * as voteTx from "@axelarjs/proto/axelar/vote/v1beta1/tx";

import type {
  MsgDelegateEncodeObject,
  MsgDepositEncodeObject,
  MsgSendEncodeObject,
  MsgSubmitProposalEncodeObject,
  MsgTransferEncodeObject,
  MsgUndelegateEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from "@cosmjs/stargate";

import type { EncodeObjectRecord } from "./types";

export const MODULES = [
  axelarnetTx,
  evmTx,
  multisigTx,
  nexusTx,
  permissionTx,
  rewardTx,
  snapshotTx,
  tssTx,
  voteTx,
];

export type AxelarEncodeObjectRecord = EncodeObjectRecord<typeof axelarnetTx> &
  EncodeObjectRecord<typeof evmTx> &
  EncodeObjectRecord<typeof multisigTx> &
  EncodeObjectRecord<typeof nexusTx> &
  EncodeObjectRecord<typeof permissionTx> &
  EncodeObjectRecord<typeof rewardTx> &
  EncodeObjectRecord<typeof snapshotTx> &
  EncodeObjectRecord<typeof tssTx> &
  EncodeObjectRecord<typeof voteTx>;

export type AxelarEncodeObject =
  AxelarEncodeObjectRecord[keyof AxelarEncodeObjectRecord];

export type CosmosEncodeObject =
  | MsgDelegateEncodeObject
  | MsgDepositEncodeObject
  | MsgSendEncodeObject
  | MsgSubmitProposalEncodeObject
  | MsgTransferEncodeObject
  | MsgUndelegateEncodeObject
  | MsgVoteEncodeObject
  | MsgWithdrawDelegatorRewardEncodeObject;
