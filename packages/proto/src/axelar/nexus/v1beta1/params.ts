/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Threshold } from "../../utils/v1beta1/threshold";

export const protobufPackage = "axelar.nexus.v1beta1";

/** Params represent the genesis parameters for the module */
export interface Params {
  chainActivationThreshold?: Threshold | undefined;
  chainMaintainerMissingVoteThreshold?: Threshold | undefined;
  chainMaintainerIncorrectVoteThreshold?: Threshold | undefined;
  chainMaintainerCheckWindow: number;
  gateway: Uint8Array;
}

function createBaseParams(): Params {
  return {
    chainActivationThreshold: undefined,
    chainMaintainerMissingVoteThreshold: undefined,
    chainMaintainerIncorrectVoteThreshold: undefined,
    chainMaintainerCheckWindow: 0,
    gateway: new Uint8Array(0),
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chainActivationThreshold !== undefined) {
      Threshold.encode(
        message.chainActivationThreshold,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.chainMaintainerMissingVoteThreshold !== undefined) {
      Threshold.encode(
        message.chainMaintainerMissingVoteThreshold,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.chainMaintainerIncorrectVoteThreshold !== undefined) {
      Threshold.encode(
        message.chainMaintainerIncorrectVoteThreshold,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.chainMaintainerCheckWindow !== 0) {
      writer.uint32(32).int32(message.chainMaintainerCheckWindow);
    }
    if (message.gateway.length !== 0) {
      writer.uint32(42).bytes(message.gateway);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chainActivationThreshold = Threshold.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chainMaintainerMissingVoteThreshold = Threshold.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chainMaintainerIncorrectVoteThreshold = Threshold.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.chainMaintainerCheckWindow = reader.int32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.gateway = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      chainActivationThreshold: isSet(object.chainActivationThreshold)
        ? Threshold.fromJSON(object.chainActivationThreshold)
        : undefined,
      chainMaintainerMissingVoteThreshold: isSet(
        object.chainMaintainerMissingVoteThreshold
      )
        ? Threshold.fromJSON(object.chainMaintainerMissingVoteThreshold)
        : undefined,
      chainMaintainerIncorrectVoteThreshold: isSet(
        object.chainMaintainerIncorrectVoteThreshold
      )
        ? Threshold.fromJSON(object.chainMaintainerIncorrectVoteThreshold)
        : undefined,
      chainMaintainerCheckWindow: isSet(object.chainMaintainerCheckWindow)
        ? globalThis.Number(object.chainMaintainerCheckWindow)
        : 0,
      gateway: isSet(object.gateway)
        ? bytesFromBase64(object.gateway)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.chainActivationThreshold !== undefined) {
      obj.chainActivationThreshold = Threshold.toJSON(
        message.chainActivationThreshold
      );
    }
    if (message.chainMaintainerMissingVoteThreshold !== undefined) {
      obj.chainMaintainerMissingVoteThreshold = Threshold.toJSON(
        message.chainMaintainerMissingVoteThreshold
      );
    }
    if (message.chainMaintainerIncorrectVoteThreshold !== undefined) {
      obj.chainMaintainerIncorrectVoteThreshold = Threshold.toJSON(
        message.chainMaintainerIncorrectVoteThreshold
      );
    }
    if (message.chainMaintainerCheckWindow !== 0) {
      obj.chainMaintainerCheckWindow = Math.round(
        message.chainMaintainerCheckWindow
      );
    }
    if (message.gateway.length !== 0) {
      obj.gateway = base64FromBytes(message.gateway);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.chainActivationThreshold =
      object.chainActivationThreshold !== undefined &&
      object.chainActivationThreshold !== null
        ? Threshold.fromPartial(object.chainActivationThreshold)
        : undefined;
    message.chainMaintainerMissingVoteThreshold =
      object.chainMaintainerMissingVoteThreshold !== undefined &&
      object.chainMaintainerMissingVoteThreshold !== null
        ? Threshold.fromPartial(object.chainMaintainerMissingVoteThreshold)
        : undefined;
    message.chainMaintainerIncorrectVoteThreshold =
      object.chainMaintainerIncorrectVoteThreshold !== undefined &&
      object.chainMaintainerIncorrectVoteThreshold !== null
        ? Threshold.fromPartial(object.chainMaintainerIncorrectVoteThreshold)
        : undefined;
    message.chainMaintainerCheckWindow = object.chainMaintainerCheckWindow ?? 0;
    message.gateway = object.gateway ?? new Uint8Array(0);
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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
