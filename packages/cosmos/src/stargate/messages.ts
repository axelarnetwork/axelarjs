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
  SignerData,
  SigningStargateClient,
  StdFee,
} from "@cosmjs/stargate";
// comsmos messages

import type { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import * as ibcFee from "cosmjs-types/ibc/applications/fee/v1/tx";
import * as ibcTransfer from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { camelize } from "inflection";

import type {
  EncodeProtoPackage,
  KeepOnlySimplifiedRequestMethods,
} from "./types";

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
  // cosmos messages
  ibcFee,
  ibcTransfer,
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
        sign(
          signerAddress: string,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message: ReturnType<TrackedModules[M][P]["fromPartial"]>,
          fee: StdFee,
          memo: string,
          explicitSignerData?: SignerData
        ): Promise<TxRaw>;
        simulate(
          signerAddress: string,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message: ReturnType<TrackedModules[M][P]["fromPartial"]>,
          memo?: string
        ): Promise<number>;
      }
    : never;
};

export type AxelarMsgClient = {
  [M in ModuleNames]: KeepOnlySimplifiedRequestMethods<EncodeModule<M>>;
};

const createMsgMethodClient =
  (client: SigningStargateClient, module: { protobufPackage: string }) =>
  <T extends Record<string, unknown>>(acc: T, [method]: [string, string]) => ({
    ...acc,
    [camelize(method.replace(/Request$/, "").replace(/^Msg/, ""), true)]: {
      signAndBroadcast: (
        senderAddress: string,
        message: EncodeObject["value"],
        fee: StdFee
      ) =>
        client.signAndBroadcast(
          senderAddress,
          [
            {
              typeUrl: `/${module.protobufPackage}.${method}`,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value: message,
            },
          ],
          fee
        ),
      sign(
        signerAddress: string,
        message: EncodeObject["value"],
        fee: StdFee,
        memo: string,
        explicitSignerData?: SignerData
      ) {
        return client.sign(
          signerAddress,
          [
            {
              typeUrl: `/${module.protobufPackage}.${method}`,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value: message,
            },
          ],
          fee,
          memo,
          explicitSignerData
        );
      },
      simulate(
        signerAddress: string,
        message: EncodeObject["value"],
        memo: string | undefined
      ) {
        return client.simulate(
          signerAddress,
          [
            {
              typeUrl: `/${module.protobufPackage}.${method}`,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value: message,
            },
          ],
          memo
        );
      },
    },
  });

export const createMsgClient = (baseClient: SigningStargateClient) =>
  Object.entries(TRACKED_MODULES).reduce(
    (acc, [moduleName, module]) => ({
      ...acc,
      [moduleName]: Object.entries(module)
        .filter(
          ([method, value]) =>
            isTsProtoGeneratedType(value as GeneratedType) &&
            (method.endsWith("Request") ||
              (method.startsWith("Msg") &&
                !method.endsWith("Response") &&
                !method.endsWith("Impl")))
        )
        .reduce(
          createMsgMethodClient(baseClient, module),
          {} as Record<string, unknown>
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
