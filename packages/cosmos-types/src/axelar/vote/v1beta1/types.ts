/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Any } from "../../../google/protobuf/any";

export const protobufPackage = "axelar.vote.v1beta1";

/**
 * TalliedVote represents a vote for a poll with the accumulated stake of all
 * validators voting for the same data
 */
export interface TalliedVote {
  tally: Uint8Array;
  data?: Any;
  pollId: Long;
  isVoterLate: { [key: string]: boolean };
}

export interface TalliedVote_IsVoterLateEntry {
  key: string;
  value: boolean;
}

function createBaseTalliedVote(): TalliedVote {
  return {
    tally: new Uint8Array(),
    data: undefined,
    pollId: Long.UZERO,
    isVoterLate: {},
  };
}

export const TalliedVote = {
  encode(
    message: TalliedVote,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tally.length !== 0) {
      writer.uint32(10).bytes(message.tally);
    }
    if (message.data !== undefined) {
      Any.encode(message.data, writer.uint32(26).fork()).ldelim();
    }
    if (!message.pollId.isZero()) {
      writer.uint32(32).uint64(message.pollId);
    }
    Object.entries(message.isVoterLate).forEach(([key, value]) => {
      TalliedVote_IsVoterLateEntry.encode(
        { key: key as any, value },
        writer.uint32(42).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TalliedVote {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTalliedVote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tally = reader.bytes();
          break;
        case 3:
          message.data = Any.decode(reader, reader.uint32());
          break;
        case 4:
          message.pollId = reader.uint64() as Long;
          break;
        case 5:
          const entry5 = TalliedVote_IsVoterLateEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry5.value !== undefined) {
            message.isVoterLate[entry5.key] = entry5.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TalliedVote {
    return {
      tally: isSet(object.tally)
        ? bytesFromBase64(object.tally)
        : new Uint8Array(),
      data: isSet(object.data) ? Any.fromJSON(object.data) : undefined,
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
      isVoterLate: isObject(object.isVoterLate)
        ? Object.entries(object.isVoterLate).reduce<{ [key: string]: boolean }>(
            (acc, [key, value]) => {
              acc[key] = Boolean(value);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: TalliedVote): unknown {
    const obj: any = {};
    message.tally !== undefined &&
      (obj.tally = base64FromBytes(
        message.tally !== undefined ? message.tally : new Uint8Array()
      ));
    message.data !== undefined &&
      (obj.data = message.data ? Any.toJSON(message.data) : undefined);
    message.pollId !== undefined &&
      (obj.pollId = (message.pollId || Long.UZERO).toString());
    obj.isVoterLate = {};
    if (message.isVoterLate) {
      Object.entries(message.isVoterLate).forEach(([k, v]) => {
        obj.isVoterLate[k] = v;
      });
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TalliedVote>, I>>(base?: I): TalliedVote {
    return TalliedVote.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TalliedVote>, I>>(
    object: I
  ): TalliedVote {
    const message = createBaseTalliedVote();
    message.tally = object.tally ?? new Uint8Array();
    message.data =
      object.data !== undefined && object.data !== null
        ? Any.fromPartial(object.data)
        : undefined;
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    message.isVoterLate = Object.entries(object.isVoterLate ?? {}).reduce<{
      [key: string]: boolean;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Boolean(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseTalliedVote_IsVoterLateEntry(): TalliedVote_IsVoterLateEntry {
  return { key: "", value: false };
}

export const TalliedVote_IsVoterLateEntry = {
  encode(
    message: TalliedVote_IsVoterLateEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value === true) {
      writer.uint32(16).bool(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TalliedVote_IsVoterLateEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTalliedVote_IsVoterLateEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TalliedVote_IsVoterLateEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Boolean(object.value) : false,
    };
  },

  toJSON(message: TalliedVote_IsVoterLateEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  create<I extends Exact<DeepPartial<TalliedVote_IsVoterLateEntry>, I>>(
    base?: I
  ): TalliedVote_IsVoterLateEntry {
    return TalliedVote_IsVoterLateEntry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TalliedVote_IsVoterLateEntry>, I>>(
    object: I
  ): TalliedVote_IsVoterLateEntry {
    const message = createBaseTalliedVote_IsVoterLateEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? false;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
