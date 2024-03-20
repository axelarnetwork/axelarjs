/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import {
  Chain,
  CrossChainTransfer,
  FeeInfo,
  GeneralMessage,
  TransferFee,
} from "../exported/v1beta1/types";
import { Params } from "./params";
import { ChainState, LinkedAddresses, RateLimit, TransferEpoch } from "./types";

export const protobufPackage = "axelar.nexus.v1beta1";

/** GenesisState represents the genesis state */
export interface GenesisState {
  params?: Params | undefined;
  nonce: Long;
  chains: Chain[];
  chainStates: ChainState[];
  linkedAddresses: LinkedAddresses[];
  transfers: CrossChainTransfer[];
  fee?: TransferFee | undefined;
  feeInfos: FeeInfo[];
  rateLimits: RateLimit[];
  transferEpochs: TransferEpoch[];
  messages: GeneralMessage[];
  messageNonce: Long;
}

function createBaseGenesisState(): GenesisState {
  return {
    params: undefined,
    nonce: Long.UZERO,
    chains: [],
    chainStates: [],
    linkedAddresses: [],
    transfers: [],
    fee: undefined,
    feeInfos: [],
    rateLimits: [],
    transferEpochs: [],
    messages: [],
    messageNonce: Long.UZERO,
  };
}

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (!message.nonce.isZero()) {
      writer.uint32(16).uint64(message.nonce);
    }
    for (const v of message.chains) {
      Chain.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.chainStates) {
      ChainState.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.linkedAddresses) {
      LinkedAddresses.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.transfers) {
      CrossChainTransfer.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.fee !== undefined) {
      TransferFee.encode(message.fee, writer.uint32(58).fork()).ldelim();
    }
    for (const v of message.feeInfos) {
      FeeInfo.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.rateLimits) {
      RateLimit.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    for (const v of message.transferEpochs) {
      TransferEpoch.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    for (const v of message.messages) {
      GeneralMessage.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (!message.messageNonce.isZero()) {
      writer.uint32(96).uint64(message.messageNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.nonce = reader.uint64() as Long;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chains.push(Chain.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.chainStates.push(ChainState.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.linkedAddresses.push(
            LinkedAddresses.decode(reader, reader.uint32())
          );
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.transfers.push(
            CrossChainTransfer.decode(reader, reader.uint32())
          );
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.fee = TransferFee.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.feeInfos.push(FeeInfo.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.rateLimits.push(RateLimit.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.transferEpochs.push(
            TransferEpoch.decode(reader, reader.uint32())
          );
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.messages.push(GeneralMessage.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.messageNonce = reader.uint64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      nonce: isSet(object.nonce) ? Long.fromValue(object.nonce) : Long.UZERO,
      chains: globalThis.Array.isArray(object?.chains)
        ? object.chains.map((e: any) => Chain.fromJSON(e))
        : [],
      chainStates: globalThis.Array.isArray(object?.chainStates)
        ? object.chainStates.map((e: any) => ChainState.fromJSON(e))
        : [],
      linkedAddresses: globalThis.Array.isArray(object?.linkedAddresses)
        ? object.linkedAddresses.map((e: any) => LinkedAddresses.fromJSON(e))
        : [],
      transfers: globalThis.Array.isArray(object?.transfers)
        ? object.transfers.map((e: any) => CrossChainTransfer.fromJSON(e))
        : [],
      fee: isSet(object.fee) ? TransferFee.fromJSON(object.fee) : undefined,
      feeInfos: globalThis.Array.isArray(object?.feeInfos)
        ? object.feeInfos.map((e: any) => FeeInfo.fromJSON(e))
        : [],
      rateLimits: globalThis.Array.isArray(object?.rateLimits)
        ? object.rateLimits.map((e: any) => RateLimit.fromJSON(e))
        : [],
      transferEpochs: globalThis.Array.isArray(object?.transferEpochs)
        ? object.transferEpochs.map((e: any) => TransferEpoch.fromJSON(e))
        : [],
      messages: globalThis.Array.isArray(object?.messages)
        ? object.messages.map((e: any) => GeneralMessage.fromJSON(e))
        : [],
      messageNonce: isSet(object.messageNonce)
        ? Long.fromValue(object.messageNonce)
        : Long.UZERO,
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    if (!message.nonce.isZero()) {
      obj.nonce = (message.nonce || Long.UZERO).toString();
    }
    if (message.chains?.length) {
      obj.chains = message.chains.map((e) => Chain.toJSON(e));
    }
    if (message.chainStates?.length) {
      obj.chainStates = message.chainStates.map((e) => ChainState.toJSON(e));
    }
    if (message.linkedAddresses?.length) {
      obj.linkedAddresses = message.linkedAddresses.map((e) =>
        LinkedAddresses.toJSON(e)
      );
    }
    if (message.transfers?.length) {
      obj.transfers = message.transfers.map((e) =>
        CrossChainTransfer.toJSON(e)
      );
    }
    if (message.fee !== undefined) {
      obj.fee = TransferFee.toJSON(message.fee);
    }
    if (message.feeInfos?.length) {
      obj.feeInfos = message.feeInfos.map((e) => FeeInfo.toJSON(e));
    }
    if (message.rateLimits?.length) {
      obj.rateLimits = message.rateLimits.map((e) => RateLimit.toJSON(e));
    }
    if (message.transferEpochs?.length) {
      obj.transferEpochs = message.transferEpochs.map((e) =>
        TransferEpoch.toJSON(e)
      );
    }
    if (message.messages?.length) {
      obj.messages = message.messages.map((e) => GeneralMessage.toJSON(e));
    }
    if (!message.messageNonce.isZero()) {
      obj.messageNonce = (message.messageNonce || Long.UZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState>, I>>(
    base?: I
  ): GenesisState {
    return GenesisState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
    object: I
  ): GenesisState {
    const message = createBaseGenesisState();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    message.nonce =
      object.nonce !== undefined && object.nonce !== null
        ? Long.fromValue(object.nonce)
        : Long.UZERO;
    message.chains = object.chains?.map((e) => Chain.fromPartial(e)) || [];
    message.chainStates =
      object.chainStates?.map((e) => ChainState.fromPartial(e)) || [];
    message.linkedAddresses =
      object.linkedAddresses?.map((e) => LinkedAddresses.fromPartial(e)) || [];
    message.transfers =
      object.transfers?.map((e) => CrossChainTransfer.fromPartial(e)) || [];
    message.fee =
      object.fee !== undefined && object.fee !== null
        ? TransferFee.fromPartial(object.fee)
        : undefined;
    message.feeInfos =
      object.feeInfos?.map((e) => FeeInfo.fromPartial(e)) || [];
    message.rateLimits =
      object.rateLimits?.map((e) => RateLimit.fromPartial(e)) || [];
    message.transferEpochs =
      object.transferEpochs?.map((e) => TransferEpoch.fromPartial(e)) || [];
    message.messages =
      object.messages?.map((e) => GeneralMessage.fromPartial(e)) || [];
    message.messageNonce =
      object.messageNonce !== undefined && object.messageNonce !== null
        ? Long.fromValue(object.messageNonce)
        : Long.UZERO;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
    ? string | number | Long
    : T extends globalThis.Array<infer U>
      ? globalThis.Array<DeepPartial<U>>
      : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : T extends {}
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
