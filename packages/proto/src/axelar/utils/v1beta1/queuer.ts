/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.utils.v1beta1";

export interface QueueState {
  items: { [key: string]: QueueState_Item };
}

export interface QueueState_Item {
  key: Uint8Array;
  value: Uint8Array;
}

export interface QueueState_ItemsEntry {
  key: string;
  value?: QueueState_Item | undefined;
}

function createBaseQueueState(): QueueState {
  return { items: {} };
}

export const QueueState = {
  encode(
    message: QueueState,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    Object.entries(message.items).forEach(([key, value]) => {
      QueueState_ItemsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueueState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueueState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = QueueState_ItemsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.items[entry1.key] = entry1.value;
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

  fromJSON(object: any): QueueState {
    return {
      items: isObject(object.items)
        ? Object.entries(object.items).reduce<{
            [key: string]: QueueState_Item;
          }>((acc, [key, value]) => {
            acc[key] = QueueState_Item.fromJSON(value);
            return acc;
          }, {})
        : {},
    };
  },

  toJSON(message: QueueState): unknown {
    const obj: any = {};
    if (message.items) {
      const entries = Object.entries(message.items);
      if (entries.length > 0) {
        obj.items = {};
        entries.forEach(([k, v]) => {
          obj.items[k] = QueueState_Item.toJSON(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueueState>, I>>(base?: I): QueueState {
    return QueueState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueueState>, I>>(
    object: I
  ): QueueState {
    const message = createBaseQueueState();
    message.items = Object.entries(object.items ?? {}).reduce<{
      [key: string]: QueueState_Item;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = QueueState_Item.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseQueueState_Item(): QueueState_Item {
  return { key: new Uint8Array(0), value: new Uint8Array(0) };
}

export const QueueState_Item = {
  encode(
    message: QueueState_Item,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueueState_Item {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueueState_Item();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueueState_Item {
    return {
      key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(0),
      value: isSet(object.value)
        ? bytesFromBase64(object.value)
        : new Uint8Array(0),
    };
  },

  toJSON(message: QueueState_Item): unknown {
    const obj: any = {};
    if (message.key.length !== 0) {
      obj.key = base64FromBytes(message.key);
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueueState_Item>, I>>(
    base?: I
  ): QueueState_Item {
    return QueueState_Item.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueueState_Item>, I>>(
    object: I
  ): QueueState_Item {
    const message = createBaseQueueState_Item();
    message.key = object.key ?? new Uint8Array(0);
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function createBaseQueueState_ItemsEntry(): QueueState_ItemsEntry {
  return { key: "", value: undefined };
}

export const QueueState_ItemsEntry = {
  encode(
    message: QueueState_ItemsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      QueueState_Item.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueueState_ItemsEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueueState_ItemsEntry();
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

          message.value = QueueState_Item.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueueState_ItemsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value)
        ? QueueState_Item.fromJSON(object.value)
        : undefined,
    };
  },

  toJSON(message: QueueState_ItemsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = QueueState_Item.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueueState_ItemsEntry>, I>>(
    base?: I
  ): QueueState_ItemsEntry {
    return QueueState_ItemsEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueueState_ItemsEntry>, I>>(
    object: I
  ): QueueState_ItemsEntry {
    const message = createBaseQueueState_ItemsEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? QueueState_Item.fromPartial(object.value)
        : undefined;
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
