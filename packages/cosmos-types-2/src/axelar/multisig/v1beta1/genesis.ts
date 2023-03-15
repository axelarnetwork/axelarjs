/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params } from "./params";
import { Key, KeyEpoch, KeygenSession, SigningSession } from "./types";

export const protobufPackage = "axelar.multisig.v1beta1";

/** GenesisState represents the genesis state */
export interface GenesisState {
  params?: Params;
  keygenSessions: KeygenSession[];
  signingSessions: SigningSession[];
  keys: Key[];
  keyEpochs: KeyEpoch[];
}

function createBaseGenesisState(): GenesisState {
  return {
    params: undefined,
    keygenSessions: [],
    signingSessions: [],
    keys: [],
    keyEpochs: [],
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
    for (const v of message.keygenSessions) {
      KeygenSession.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.signingSessions) {
      SigningSession.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.keys) {
      Key.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.keyEpochs) {
      KeyEpoch.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.keygenSessions.push(
            KeygenSession.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.signingSessions.push(
            SigningSession.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.keys.push(Key.decode(reader, reader.uint32()));
          break;
        case 5:
          message.keyEpochs.push(KeyEpoch.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      keygenSessions: Array.isArray(object?.keygenSessions)
        ? object.keygenSessions.map((e: any) => KeygenSession.fromJSON(e))
        : [],
      signingSessions: Array.isArray(object?.signingSessions)
        ? object.signingSessions.map((e: any) => SigningSession.fromJSON(e))
        : [],
      keys: Array.isArray(object?.keys)
        ? object.keys.map((e: any) => Key.fromJSON(e))
        : [],
      keyEpochs: Array.isArray(object?.keyEpochs)
        ? object.keyEpochs.map((e: any) => KeyEpoch.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.keygenSessions) {
      obj.keygenSessions = message.keygenSessions.map((e) =>
        e ? KeygenSession.toJSON(e) : undefined
      );
    } else {
      obj.keygenSessions = [];
    }
    if (message.signingSessions) {
      obj.signingSessions = message.signingSessions.map((e) =>
        e ? SigningSession.toJSON(e) : undefined
      );
    } else {
      obj.signingSessions = [];
    }
    if (message.keys) {
      obj.keys = message.keys.map((e) => (e ? Key.toJSON(e) : undefined));
    } else {
      obj.keys = [];
    }
    if (message.keyEpochs) {
      obj.keyEpochs = message.keyEpochs.map((e) =>
        e ? KeyEpoch.toJSON(e) : undefined
      );
    } else {
      obj.keyEpochs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState>, I>>(
    base?: I
  ): GenesisState {
    return GenesisState.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
    object: I
  ): GenesisState {
    const message = createBaseGenesisState();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    message.keygenSessions =
      object.keygenSessions?.map((e) => KeygenSession.fromPartial(e)) || [];
    message.signingSessions =
      object.signingSessions?.map((e) => SigningSession.fromPartial(e)) || [];
    message.keys = object.keys?.map((e) => Key.fromPartial(e)) || [];
    message.keyEpochs =
      object.keyEpochs?.map((e) => KeyEpoch.fromPartial(e)) || [];
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
