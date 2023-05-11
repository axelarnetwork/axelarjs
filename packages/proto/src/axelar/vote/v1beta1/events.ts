/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.vote.v1beta1";

export interface Voted {
  module: string;
  action: string;
  poll: string;
  voter: string;
  state: string;
}

function createBaseVoted(): Voted {
  return { module: "", action: "", poll: "", voter: "", state: "" };
}

export const Voted = {
  encode(message: Voted, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.module !== "") {
      writer.uint32(10).string(message.module);
    }
    if (message.action !== "") {
      writer.uint32(18).string(message.action);
    }
    if (message.poll !== "") {
      writer.uint32(26).string(message.poll);
    }
    if (message.voter !== "") {
      writer.uint32(34).string(message.voter);
    }
    if (message.state !== "") {
      writer.uint32(42).string(message.state);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Voted {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVoted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.module = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.action = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.poll = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.voter = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.state = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Voted {
    return {
      module: isSet(object.module) ? String(object.module) : "",
      action: isSet(object.action) ? String(object.action) : "",
      poll: isSet(object.poll) ? String(object.poll) : "",
      voter: isSet(object.voter) ? String(object.voter) : "",
      state: isSet(object.state) ? String(object.state) : "",
    };
  },

  toJSON(message: Voted): unknown {
    const obj: any = {};
    message.module !== undefined && (obj.module = message.module);
    message.action !== undefined && (obj.action = message.action);
    message.poll !== undefined && (obj.poll = message.poll);
    message.voter !== undefined && (obj.voter = message.voter);
    message.state !== undefined && (obj.state = message.state);
    return obj;
  },

  create<I extends Exact<DeepPartial<Voted>, I>>(base?: I): Voted {
    return Voted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Voted>, I>>(object: I): Voted {
    const message = createBaseVoted();
    message.module = object.module ?? "";
    message.action = object.action ?? "";
    message.poll = object.poll ?? "";
    message.voter = object.voter ?? "";
    message.state = object.state ?? "";
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
