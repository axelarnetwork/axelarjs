/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { QueueState } from "../../utils/v1beta1/queuer";
import { Params } from "./params";
import { CosmosChain, IBCTransfer } from "./types";

export const protobufPackage = "axelar.axelarnet.v1beta1";

export interface GenesisState {
  params?: Params | undefined;
  collectorAddress: Uint8Array;
  chains: CosmosChain[];
  transferQueue?: QueueState | undefined;
  ibcTransfers: IBCTransfer[];
  seqIdMapping: { [key: string]: Long };
}

export interface GenesisState_SeqIdMappingEntry {
  key: string;
  value: Long;
}

function createBaseGenesisState(): GenesisState {
  return {
    params: undefined,
    collectorAddress: new Uint8Array(0),
    chains: [],
    transferQueue: undefined,
    ibcTransfers: [],
    seqIdMapping: {},
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
    if (message.collectorAddress.length !== 0) {
      writer.uint32(18).bytes(message.collectorAddress);
    }
    for (const v of message.chains) {
      CosmosChain.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.transferQueue !== undefined) {
      QueueState.encode(
        message.transferQueue,
        writer.uint32(42).fork()
      ).ldelim();
    }
    for (const v of message.ibcTransfers) {
      IBCTransfer.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    Object.entries(message.seqIdMapping).forEach(([key, value]) => {
      GenesisState_SeqIdMappingEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
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
          if (tag !== 18) {
            break;
          }

          message.collectorAddress = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chains.push(CosmosChain.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.transferQueue = QueueState.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.ibcTransfers.push(
            IBCTransfer.decode(reader, reader.uint32())
          );
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          const entry8 = GenesisState_SeqIdMappingEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.seqIdMapping[entry8.key] = entry8.value;
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

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      collectorAddress: isSet(object.collectorAddress)
        ? bytesFromBase64(object.collectorAddress)
        : new Uint8Array(0),
      chains: globalThis.Array.isArray(object?.chains)
        ? object.chains.map((e: any) => CosmosChain.fromJSON(e))
        : [],
      transferQueue: isSet(object.transferQueue)
        ? QueueState.fromJSON(object.transferQueue)
        : undefined,
      ibcTransfers: globalThis.Array.isArray(object?.ibcTransfers)
        ? object.ibcTransfers.map((e: any) => IBCTransfer.fromJSON(e))
        : [],
      seqIdMapping: isObject(object.seqIdMapping)
        ? Object.entries(object.seqIdMapping).reduce<{ [key: string]: Long }>(
            (acc, [key, value]) => {
              acc[key] = Long.fromValue(value as Long | string);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    if (message.collectorAddress.length !== 0) {
      obj.collectorAddress = base64FromBytes(message.collectorAddress);
    }
    if (message.chains?.length) {
      obj.chains = message.chains.map((e) => CosmosChain.toJSON(e));
    }
    if (message.transferQueue !== undefined) {
      obj.transferQueue = QueueState.toJSON(message.transferQueue);
    }
    if (message.ibcTransfers?.length) {
      obj.ibcTransfers = message.ibcTransfers.map((e) => IBCTransfer.toJSON(e));
    }
    if (message.seqIdMapping) {
      const entries = Object.entries(message.seqIdMapping);
      if (entries.length > 0) {
        obj.seqIdMapping = {};
        entries.forEach(([k, v]) => {
          obj.seqIdMapping[k] = v.toString();
        });
      }
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
    message.collectorAddress = object.collectorAddress ?? new Uint8Array(0);
    message.chains =
      object.chains?.map((e) => CosmosChain.fromPartial(e)) || [];
    message.transferQueue =
      object.transferQueue !== undefined && object.transferQueue !== null
        ? QueueState.fromPartial(object.transferQueue)
        : undefined;
    message.ibcTransfers =
      object.ibcTransfers?.map((e) => IBCTransfer.fromPartial(e)) || [];
    message.seqIdMapping = Object.entries(object.seqIdMapping ?? {}).reduce<{
      [key: string]: Long;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Long.fromValue(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGenesisState_SeqIdMappingEntry(): GenesisState_SeqIdMappingEntry {
  return { key: "", value: Long.UZERO };
}

export const GenesisState_SeqIdMappingEntry = {
  encode(
    message: GenesisState_SeqIdMappingEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (!message.value.equals(Long.UZERO)) {
      writer.uint32(16).uint64(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenesisState_SeqIdMappingEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState_SeqIdMappingEntry();
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

          message.value = reader.uint64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenesisState_SeqIdMappingEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? Long.fromValue(object.value) : Long.UZERO,
    };
  },

  toJSON(message: GenesisState_SeqIdMappingEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (!message.value.equals(Long.UZERO)) {
      obj.value = (message.value || Long.UZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState_SeqIdMappingEntry>, I>>(
    base?: I
  ): GenesisState_SeqIdMappingEntry {
    return GenesisState_SeqIdMappingEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenesisState_SeqIdMappingEntry>, I>>(
    object: I
  ): GenesisState_SeqIdMappingEntry {
    const message = createBaseGenesisState_SeqIdMappingEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Long.fromValue(object.value)
        : Long.UZERO;
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
