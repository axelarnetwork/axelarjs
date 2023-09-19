/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Timestamp } from "../../../../google/protobuf/timestamp";

export const protobufPackage = "axelar.snapshot.exported.v1beta1";

export interface Participant {
  address: Uint8Array;
  weight: Uint8Array;
}

export interface Snapshot {
  timestamp?: Date | undefined;
  height: Long;
  participants: { [key: string]: Participant };
  bondedWeight: Uint8Array;
}

export interface Snapshot_ParticipantsEntry {
  key: string;
  value?: Participant | undefined;
}

function createBaseParticipant(): Participant {
  return { address: new Uint8Array(0), weight: new Uint8Array(0) };
}

export const Participant = {
  encode(
    message: Participant,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.weight.length !== 0) {
      writer.uint32(18).bytes(message.weight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Participant {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.weight = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Participant {
    return {
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(0),
      weight: isSet(object.weight)
        ? bytesFromBase64(object.weight)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Participant): unknown {
    const obj: any = {};
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    if (message.weight.length !== 0) {
      obj.weight = base64FromBytes(message.weight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Participant>, I>>(base?: I): Participant {
    return Participant.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Participant>, I>>(
    object: I
  ): Participant {
    const message = createBaseParticipant();
    message.address = object.address ?? new Uint8Array(0);
    message.weight = object.weight ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSnapshot(): Snapshot {
  return {
    timestamp: undefined,
    height: Long.ZERO,
    participants: {},
    bondedWeight: new Uint8Array(0),
  };
}

export const Snapshot = {
  encode(
    message: Snapshot,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timestamp),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(24).int64(message.height);
    }
    Object.entries(message.participants).forEach(([key, value]) => {
      Snapshot_ParticipantsEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    if (message.bondedWeight.length !== 0) {
      writer.uint32(74).bytes(message.bondedWeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Snapshot {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshot();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.timestamp = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.height = reader.int64() as Long;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          const entry8 = Snapshot_ParticipantsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.participants[entry8.key] = entry8.value;
          }
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.bondedWeight = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Snapshot {
    return {
      timestamp: isSet(object.timestamp)
        ? fromJsonTimestamp(object.timestamp)
        : undefined,
      height: isSet(object.height) ? Long.fromValue(object.height) : Long.ZERO,
      participants: isObject(object.participants)
        ? Object.entries(object.participants).reduce<{
            [key: string]: Participant;
          }>((acc, [key, value]) => {
            acc[key] = Participant.fromJSON(value);
            return acc;
          }, {})
        : {},
      bondedWeight: isSet(object.bondedWeight)
        ? bytesFromBase64(object.bondedWeight)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Snapshot): unknown {
    const obj: any = {};
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    if (!message.height.isZero()) {
      obj.height = (message.height || Long.ZERO).toString();
    }
    if (message.participants) {
      const entries = Object.entries(message.participants);
      if (entries.length > 0) {
        obj.participants = {};
        entries.forEach(([k, v]) => {
          obj.participants[k] = Participant.toJSON(v);
        });
      }
    }
    if (message.bondedWeight.length !== 0) {
      obj.bondedWeight = base64FromBytes(message.bondedWeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Snapshot>, I>>(base?: I): Snapshot {
    return Snapshot.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Snapshot>, I>>(object: I): Snapshot {
    const message = createBaseSnapshot();
    message.timestamp = object.timestamp ?? undefined;
    message.height =
      object.height !== undefined && object.height !== null
        ? Long.fromValue(object.height)
        : Long.ZERO;
    message.participants = Object.entries(object.participants ?? {}).reduce<{
      [key: string]: Participant;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Participant.fromPartial(value);
      }
      return acc;
    }, {});
    message.bondedWeight = object.bondedWeight ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSnapshot_ParticipantsEntry(): Snapshot_ParticipantsEntry {
  return { key: "", value: undefined };
}

export const Snapshot_ParticipantsEntry = {
  encode(
    message: Snapshot_ParticipantsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Participant.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): Snapshot_ParticipantsEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshot_ParticipantsEntry();
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
          if (tag !== 18) {
            break;
          }

          message.value = Participant.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Snapshot_ParticipantsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value)
        ? Participant.fromJSON(object.value)
        : undefined,
    };
  },

  toJSON(message: Snapshot_ParticipantsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = Participant.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Snapshot_ParticipantsEntry>, I>>(
    base?: I
  ): Snapshot_ParticipantsEntry {
    return Snapshot_ParticipantsEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Snapshot_ParticipantsEntry>, I>>(
    object: I
  ): Snapshot_ParticipantsEntry {
    const message = createBaseSnapshot_ParticipantsEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Participant.fromPartial(object.value)
        : undefined;
    return message;
  },
};

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
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

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds.toNumber() || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

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
