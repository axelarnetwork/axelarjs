/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Threshold } from "../../utils/v1beta1/threshold";

export const protobufPackage = "axelar.vote.v1beta1";

/** Params represent the genesis parameters for the module */
export interface Params {
  defaultVotingThreshold?: Threshold;
  endBlockerLimit: Long;
}

function createBaseParams(): Params {
  return { defaultVotingThreshold: undefined, endBlockerLimit: Long.ZERO };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.defaultVotingThreshold !== undefined) {
      Threshold.encode(
        message.defaultVotingThreshold,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (!message.endBlockerLimit.isZero()) {
      writer.uint32(16).int64(message.endBlockerLimit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.defaultVotingThreshold = Threshold.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.endBlockerLimit = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      defaultVotingThreshold: isSet(object.defaultVotingThreshold)
        ? Threshold.fromJSON(object.defaultVotingThreshold)
        : undefined,
      endBlockerLimit: isSet(object.endBlockerLimit)
        ? Long.fromValue(object.endBlockerLimit)
        : Long.ZERO,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.defaultVotingThreshold !== undefined &&
      (obj.defaultVotingThreshold = message.defaultVotingThreshold
        ? Threshold.toJSON(message.defaultVotingThreshold)
        : undefined);
    message.endBlockerLimit !== undefined &&
      (obj.endBlockerLimit = (message.endBlockerLimit || Long.ZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.defaultVotingThreshold =
      object.defaultVotingThreshold !== undefined &&
      object.defaultVotingThreshold !== null
        ? Threshold.fromPartial(object.defaultVotingThreshold)
        : undefined;
    message.endBlockerLimit =
      object.endBlockerLimit !== undefined && object.endBlockerLimit !== null
        ? Long.fromValue(object.endBlockerLimit)
        : Long.ZERO;
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
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
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
