/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.reward.v1beta1";

/** Params represent the genesis parameters for the module */
export interface Params {
  externalChainVotingInflationRate: Uint8Array;
  keyMgmtRelativeInflationRate: Uint8Array;
}

function createBaseParams(): Params {
  return {
    externalChainVotingInflationRate: new Uint8Array(),
    keyMgmtRelativeInflationRate: new Uint8Array(),
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.externalChainVotingInflationRate.length !== 0) {
      writer.uint32(10).bytes(message.externalChainVotingInflationRate);
    }
    if (message.keyMgmtRelativeInflationRate.length !== 0) {
      writer.uint32(18).bytes(message.keyMgmtRelativeInflationRate);
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
          message.externalChainVotingInflationRate = reader.bytes();
          break;
        case 2:
          message.keyMgmtRelativeInflationRate = reader.bytes();
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
      externalChainVotingInflationRate: isSet(
        object.externalChainVotingInflationRate
      )
        ? bytesFromBase64(object.externalChainVotingInflationRate)
        : new Uint8Array(),
      keyMgmtRelativeInflationRate: isSet(object.keyMgmtRelativeInflationRate)
        ? bytesFromBase64(object.keyMgmtRelativeInflationRate)
        : new Uint8Array(),
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.externalChainVotingInflationRate !== undefined &&
      (obj.externalChainVotingInflationRate = base64FromBytes(
        message.externalChainVotingInflationRate !== undefined
          ? message.externalChainVotingInflationRate
          : new Uint8Array()
      ));
    message.keyMgmtRelativeInflationRate !== undefined &&
      (obj.keyMgmtRelativeInflationRate = base64FromBytes(
        message.keyMgmtRelativeInflationRate !== undefined
          ? message.keyMgmtRelativeInflationRate
          : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.externalChainVotingInflationRate =
      object.externalChainVotingInflationRate ?? new Uint8Array();
    message.keyMgmtRelativeInflationRate =
      object.keyMgmtRelativeInflationRate ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
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
