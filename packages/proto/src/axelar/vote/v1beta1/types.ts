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
  data?: Any | undefined;
  pollId: Long;
  isVoterLate: { [key: string]: boolean };
}

export interface TalliedVote_IsVoterLateEntry {
  key: string;
  value: boolean;
}

function createBaseTalliedVote(): TalliedVote {
  return {
    tally: new Uint8Array(0),
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
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTalliedVote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tally = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = Any.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.pollId = reader.uint64() as Long;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          const entry5 = TalliedVote_IsVoterLateEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry5.value !== undefined) {
            message.isVoterLate[entry5.key] = entry5.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TalliedVote {
    return {
      tally: isSet(object.tally)
        ? bytesFromBase64(object.tally)
        : new Uint8Array(0),
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
    if (message.tally.length !== 0) {
      obj.tally = base64FromBytes(message.tally);
    }
    if (message.data !== undefined) {
      obj.data = Any.toJSON(message.data);
    }
    if (!message.pollId.isZero()) {
      obj.pollId = (message.pollId || Long.UZERO).toString();
    }
    if (message.isVoterLate) {
      const entries = Object.entries(message.isVoterLate);
      if (entries.length > 0) {
        obj.isVoterLate = {};
        entries.forEach(([k, v]) => {
          obj.isVoterLate[k] = v;
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TalliedVote>, I>>(base?: I): TalliedVote {
    return TalliedVote.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TalliedVote>, I>>(
    object: I
  ): TalliedVote {
    const message = createBaseTalliedVote();
    message.tally = object.tally ?? new Uint8Array(0);
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
        acc[key] = globalThis.Boolean(value);
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
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTalliedVote_IsVoterLateEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TalliedVote_IsVoterLateEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Boolean(object.value) : false,
    };
  },

  toJSON(message: TalliedVote_IsVoterLateEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value === true) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TalliedVote_IsVoterLateEntry>, I>>(
    base?: I
  ): TalliedVote_IsVoterLateEntry {
    return TalliedVote_IsVoterLateEntry.fromPartial(base ?? ({} as any));
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
