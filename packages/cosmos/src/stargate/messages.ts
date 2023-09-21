import * as axelarnet from "@axelarjs/proto/axelar/axelarnet/v1beta1/tx";
import * as evm from "@axelarjs/proto/axelar/evm/v1beta1/tx";
import * as multisig from "@axelarjs/proto/axelar/multisig/v1beta1/tx";
import * as nexus from "@axelarjs/proto/axelar/nexus/v1beta1/tx";
import * as permission from "@axelarjs/proto/axelar/permission/v1beta1/tx";
import * as reward from "@axelarjs/proto/axelar/reward/v1beta1/tx";
import * as snapshot from "@axelarjs/proto/axelar/snapshot/v1beta1/tx";
import * as tss from "@axelarjs/proto/axelar/tss/v1beta1/tx";
import * as vote from "@axelarjs/proto/axelar/vote/v1beta1/tx";

import {
  EncodeObject,
  GeneratedType,
  isTsProtoGeneratedType,
} from "@cosmjs/proto-signing";
import type {
  DeliverTxResponse,
  MsgDelegateEncodeObject,
  MsgDepositEncodeObject,
  MsgSendEncodeObject,
  MsgSubmitProposalEncodeObject,
  MsgTransferEncodeObject,
  MsgUndelegateEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
  SigningStargateClient,
  StdFee,
} from "@cosmjs/stargate";

import type { EncodeProtoPackage } from "./types";

export const TRACKED_MODULES = {
  axelarnet,
  evm,
  multisig,
  nexus,
  permission,
  reward,
  snapshot,
  tss,
  vote,
};

type TrackedModules = typeof TRACKED_MODULES;

type ModuleNames = keyof typeof TRACKED_MODULES;

export const MODULES = Object.values(TRACKED_MODULES);

type EncodeModule<M extends keyof TrackedModules> = {
  [P in keyof TrackedModules[M]]: TrackedModules[M][P] extends GeneratedType
    ? {
        signAndBroadcast(
          senderAddress: string,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message: ReturnType<TrackedModules[M][P]["fromPartial"]>,
          fee: StdFee
        ): Promise<DeliverTxResponse>;
      }
    : never;
};

export type AxelarMsgClient = {
  [M in ModuleNames]: EncodeModule<M>;
};

export const createMsgClient = (baseClient: SigningStargateClient) =>
  Object.entries(TRACKED_MODULES).reduce(
    (acc, [moduleName, module]) => ({
      ...acc,
      [moduleName]: Object.entries(module)
        .filter(([, value]) => isTsProtoGeneratedType(value as GeneratedType))
        .reduce(
          (acc, [key]) => ({
            ...acc,
            [key]: {
              signAndBroadcast(
                senderAddress: string,
                message: EncodeObject["value"],
                fee: StdFee
              ) {
                return baseClient.signAndBroadcast(
                  senderAddress,
                  [
                    {
                      typeUrl: `/${module.protobufPackage}.${key}`,
                      value: message,
                    },
                  ],
                  fee
                );
              },
            },
          }),
          {}
        ),
    }),
    {} as AxelarMsgClient
  );

export type AxelarEncodeObjectRecord = EncodeProtoPackage<typeof axelarnet> &
  EncodeProtoPackage<typeof evm> &
  EncodeProtoPackage<typeof multisig> &
  EncodeProtoPackage<typeof nexus> &
  EncodeProtoPackage<typeof permission> &
  EncodeProtoPackage<typeof reward> &
  EncodeProtoPackage<typeof snapshot> &
  EncodeProtoPackage<typeof tss> &
  EncodeProtoPackage<typeof vote>;

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
