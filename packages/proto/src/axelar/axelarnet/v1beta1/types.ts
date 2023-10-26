/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "axelar.axelarnet.v1beta1";

export interface IBCTransfer {
  sender: Uint8Array;
  receiver: string;
  token?: Coin | undefined;
  portId: string;
  channelId: string;
  /** @deprecated */
  sequence: Long;
  id: Long;
  status: IBCTransfer_Status;
}

export enum IBCTransfer_Status {
  STATUS_UNSPECIFIED = 0,
  STATUS_PENDING = 1,
  STATUS_COMPLETED = 2,
  STATUS_FAILED = 3,
  UNRECOGNIZED = -1,
}

export function iBCTransfer_StatusFromJSON(object: any): IBCTransfer_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return IBCTransfer_Status.STATUS_UNSPECIFIED;
    case 1:
    case "STATUS_PENDING":
      return IBCTransfer_Status.STATUS_PENDING;
    case 2:
    case "STATUS_COMPLETED":
      return IBCTransfer_Status.STATUS_COMPLETED;
    case 3:
    case "STATUS_FAILED":
      return IBCTransfer_Status.STATUS_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IBCTransfer_Status.UNRECOGNIZED;
  }
}

export function iBCTransfer_StatusToJSON(object: IBCTransfer_Status): string {
  switch (object) {
    case IBCTransfer_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case IBCTransfer_Status.STATUS_PENDING:
      return "STATUS_PENDING";
    case IBCTransfer_Status.STATUS_COMPLETED:
      return "STATUS_COMPLETED";
    case IBCTransfer_Status.STATUS_FAILED:
      return "STATUS_FAILED";
    case IBCTransfer_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CosmosChain {
  name: string;
  ibcPath: string;
  /** @deprecated */
  assets: Asset[];
  addrPrefix: string;
}

/** @deprecated */
export interface Asset {
  denom: string;
  minAmount: Uint8Array;
}

export interface Fee {
  amount?: Coin | undefined;
  recipient: Uint8Array;
  refundRecipient: Uint8Array;
}

function createBaseIBCTransfer(): IBCTransfer {
  return {
    sender: new Uint8Array(0),
    receiver: "",
    token: undefined,
    portId: "",
    channelId: "",
    sequence: Long.UZERO,
    id: Long.UZERO,
    status: 0,
  };
}

export const IBCTransfer = {
  encode(
    message: IBCTransfer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.receiver !== "") {
      writer.uint32(18).string(message.receiver);
    }
    if (message.token !== undefined) {
      Coin.encode(message.token, writer.uint32(26).fork()).ldelim();
    }
    if (message.portId !== "") {
      writer.uint32(34).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(42).string(message.channelId);
    }
    if (!message.sequence.isZero()) {
      writer.uint32(48).uint64(message.sequence);
    }
    if (!message.id.isZero()) {
      writer.uint32(56).uint64(message.id);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IBCTransfer {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIBCTransfer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.receiver = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.token = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.portId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.channelId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.sequence = reader.uint64() as Long;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.id = reader.uint64() as Long;
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IBCTransfer {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      receiver: isSet(object.receiver)
        ? globalThis.String(object.receiver)
        : "",
      token: isSet(object.token) ? Coin.fromJSON(object.token) : undefined,
      portId: isSet(object.portId) ? globalThis.String(object.portId) : "",
      channelId: isSet(object.channelId)
        ? globalThis.String(object.channelId)
        : "",
      sequence: isSet(object.sequence)
        ? Long.fromValue(object.sequence)
        : Long.UZERO,
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      status: isSet(object.status)
        ? iBCTransfer_StatusFromJSON(object.status)
        : 0,
    };
  },

  toJSON(message: IBCTransfer): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.receiver !== "") {
      obj.receiver = message.receiver;
    }
    if (message.token !== undefined) {
      obj.token = Coin.toJSON(message.token);
    }
    if (message.portId !== "") {
      obj.portId = message.portId;
    }
    if (message.channelId !== "") {
      obj.channelId = message.channelId;
    }
    if (!message.sequence.isZero()) {
      obj.sequence = (message.sequence || Long.UZERO).toString();
    }
    if (!message.id.isZero()) {
      obj.id = (message.id || Long.UZERO).toString();
    }
    if (message.status !== 0) {
      obj.status = iBCTransfer_StatusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IBCTransfer>, I>>(base?: I): IBCTransfer {
    return IBCTransfer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IBCTransfer>, I>>(
    object: I
  ): IBCTransfer {
    const message = createBaseIBCTransfer();
    message.sender = object.sender ?? new Uint8Array(0);
    message.receiver = object.receiver ?? "";
    message.token =
      object.token !== undefined && object.token !== null
        ? Coin.fromPartial(object.token)
        : undefined;
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.sequence =
      object.sequence !== undefined && object.sequence !== null
        ? Long.fromValue(object.sequence)
        : Long.UZERO;
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseCosmosChain(): CosmosChain {
  return { name: "", ibcPath: "", assets: [], addrPrefix: "" };
}

export const CosmosChain = {
  encode(
    message: CosmosChain,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.ibcPath !== "") {
      writer.uint32(18).string(message.ibcPath);
    }
    for (const v of message.assets) {
      Asset.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.addrPrefix !== "") {
      writer.uint32(34).string(message.addrPrefix);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CosmosChain {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCosmosChain();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ibcPath = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.assets.push(Asset.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.addrPrefix = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CosmosChain {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      ibcPath: isSet(object.ibcPath) ? globalThis.String(object.ibcPath) : "",
      assets: globalThis.Array.isArray(object?.assets)
        ? object.assets.map((e: any) => Asset.fromJSON(e))
        : [],
      addrPrefix: isSet(object.addrPrefix)
        ? globalThis.String(object.addrPrefix)
        : "",
    };
  },

  toJSON(message: CosmosChain): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.ibcPath !== "") {
      obj.ibcPath = message.ibcPath;
    }
    if (message.assets?.length) {
      obj.assets = message.assets.map((e) => Asset.toJSON(e));
    }
    if (message.addrPrefix !== "") {
      obj.addrPrefix = message.addrPrefix;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CosmosChain>, I>>(base?: I): CosmosChain {
    return CosmosChain.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CosmosChain>, I>>(
    object: I
  ): CosmosChain {
    const message = createBaseCosmosChain();
    message.name = object.name ?? "";
    message.ibcPath = object.ibcPath ?? "";
    message.assets = object.assets?.map((e) => Asset.fromPartial(e)) || [];
    message.addrPrefix = object.addrPrefix ?? "";
    return message;
  },
};

function createBaseAsset(): Asset {
  return { denom: "", minAmount: new Uint8Array(0) };
}

export const Asset = {
  encode(message: Asset, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.minAmount.length !== 0) {
      writer.uint32(18).bytes(message.minAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Asset {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAsset();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.denom = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.minAmount = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Asset {
    return {
      denom: isSet(object.denom) ? globalThis.String(object.denom) : "",
      minAmount: isSet(object.minAmount)
        ? bytesFromBase64(object.minAmount)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Asset): unknown {
    const obj: any = {};
    if (message.denom !== "") {
      obj.denom = message.denom;
    }
    if (message.minAmount.length !== 0) {
      obj.minAmount = base64FromBytes(message.minAmount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset>, I>>(base?: I): Asset {
    return Asset.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset>, I>>(object: I): Asset {
    const message = createBaseAsset();
    message.denom = object.denom ?? "";
    message.minAmount = object.minAmount ?? new Uint8Array(0);
    return message;
  },
};

function createBaseFee(): Fee {
  return {
    amount: undefined,
    recipient: new Uint8Array(0),
    refundRecipient: new Uint8Array(0),
  };
}

export const Fee = {
  encode(message: Fee, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    if (message.recipient.length !== 0) {
      writer.uint32(18).bytes(message.recipient);
    }
    if (message.refundRecipient.length !== 0) {
      writer.uint32(26).bytes(message.refundRecipient);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Fee {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFee();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.recipient = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.refundRecipient = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Fee {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      recipient: isSet(object.recipient)
        ? bytesFromBase64(object.recipient)
        : new Uint8Array(0),
      refundRecipient: isSet(object.refundRecipient)
        ? bytesFromBase64(object.refundRecipient)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Fee): unknown {
    const obj: any = {};
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    if (message.recipient.length !== 0) {
      obj.recipient = base64FromBytes(message.recipient);
    }
    if (message.refundRecipient.length !== 0) {
      obj.refundRecipient = base64FromBytes(message.refundRecipient);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Fee>, I>>(base?: I): Fee {
    return Fee.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Fee>, I>>(object: I): Fee {
    const message = createBaseFee();
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? Coin.fromPartial(object.amount)
        : undefined;
    message.recipient = object.recipient ?? new Uint8Array(0);
    message.refundRecipient = object.refundRecipient ?? new Uint8Array(0);
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
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
  if (globalThis.Buffer) {
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
