import type * as axelarnetTx from "@axelarjs/proto/axelar/axelarnet/v1beta1/tx";
import type * as axelarEvmTx from "@axelarjs/proto/axelar/evm/v1beta1/tx";

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

export type AxelarEncodeObjectRecord = EncodeObjectRecord<typeof axelarnetTx> &
  EncodeObjectRecord<typeof axelarEvmTx>;

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
