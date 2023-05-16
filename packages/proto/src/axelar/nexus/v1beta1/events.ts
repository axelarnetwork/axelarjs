/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
import { CrossChainAddress } from "../exported/v1beta1/types";

export const protobufPackage = "axelar.nexus.v1beta1";

export interface FeeDeducted {
  transferId: Long;
  recipientChain: string;
  recipientAddress: string;
  amount?: Coin;
  fee?: Coin;
}

export interface InsufficientFee {
  transferId: Long;
  recipientChain: string;
  recipientAddress: string;
  amount?: Coin;
  fee?: Coin;
}

export interface RateLimitUpdated {
  chain: string;
  limit?: Coin;
  window?: Duration;
}

export interface MessageReceived {
  id: string;
  payloadHash: Uint8Array;
  sender?: CrossChainAddress;
  recipient?: CrossChainAddress;
}

export interface MessageProcessing {
  id: string;
}

export interface MessageExecuted {
  id: string;
}

export interface MessageFailed {
  id: string;
}

function createBaseFeeDeducted(): FeeDeducted {
  return {
    transferId: Long.UZERO,
    recipientChain: "",
    recipientAddress: "",
    amount: undefined,
    fee: undefined,
  };
}

export const FeeDeducted = {
  encode(
    message: FeeDeducted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.transferId.isZero()) {
      writer.uint32(8).uint64(message.transferId);
    }
    if (message.recipientChain !== "") {
      writer.uint32(18).string(message.recipientChain);
    }
    if (message.recipientAddress !== "") {
      writer.uint32(26).string(message.recipientAddress);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(34).fork()).ldelim();
    }
    if (message.fee !== undefined) {
      Coin.encode(message.fee, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeDeducted {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeDeducted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.transferId = reader.uint64() as Long;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.recipientChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.recipientAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.fee = Coin.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeeDeducted {
    return {
      transferId: isSet(object.transferId)
        ? Long.fromValue(object.transferId)
        : Long.UZERO,
      recipientChain: isSet(object.recipientChain)
        ? String(object.recipientChain)
        : "",
      recipientAddress: isSet(object.recipientAddress)
        ? String(object.recipientAddress)
        : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined,
    };
  },

  toJSON(message: FeeDeducted): unknown {
    const obj: any = {};
    message.transferId !== undefined &&
      (obj.transferId = (message.transferId || Long.UZERO).toString());
    message.recipientChain !== undefined &&
      (obj.recipientChain = message.recipientChain);
    message.recipientAddress !== undefined &&
      (obj.recipientAddress = message.recipientAddress);
    message.amount !== undefined &&
      (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.fee !== undefined &&
      (obj.fee = message.fee ? Coin.toJSON(message.fee) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FeeDeducted>, I>>(base?: I): FeeDeducted {
    return FeeDeducted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FeeDeducted>, I>>(
    object: I
  ): FeeDeducted {
    const message = createBaseFeeDeducted();
    message.transferId =
      object.transferId !== undefined && object.transferId !== null
        ? Long.fromValue(object.transferId)
        : Long.UZERO;
    message.recipientChain = object.recipientChain ?? "";
    message.recipientAddress = object.recipientAddress ?? "";
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? Coin.fromPartial(object.amount)
        : undefined;
    message.fee =
      object.fee !== undefined && object.fee !== null
        ? Coin.fromPartial(object.fee)
        : undefined;
    return message;
  },
};

function createBaseInsufficientFee(): InsufficientFee {
  return {
    transferId: Long.UZERO,
    recipientChain: "",
    recipientAddress: "",
    amount: undefined,
    fee: undefined,
  };
}

export const InsufficientFee = {
  encode(
    message: InsufficientFee,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.transferId.isZero()) {
      writer.uint32(8).uint64(message.transferId);
    }
    if (message.recipientChain !== "") {
      writer.uint32(18).string(message.recipientChain);
    }
    if (message.recipientAddress !== "") {
      writer.uint32(26).string(message.recipientAddress);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(34).fork()).ldelim();
    }
    if (message.fee !== undefined) {
      Coin.encode(message.fee, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InsufficientFee {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInsufficientFee();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.transferId = reader.uint64() as Long;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.recipientChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.recipientAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.fee = Coin.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InsufficientFee {
    return {
      transferId: isSet(object.transferId)
        ? Long.fromValue(object.transferId)
        : Long.UZERO,
      recipientChain: isSet(object.recipientChain)
        ? String(object.recipientChain)
        : "",
      recipientAddress: isSet(object.recipientAddress)
        ? String(object.recipientAddress)
        : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined,
    };
  },

  toJSON(message: InsufficientFee): unknown {
    const obj: any = {};
    message.transferId !== undefined &&
      (obj.transferId = (message.transferId || Long.UZERO).toString());
    message.recipientChain !== undefined &&
      (obj.recipientChain = message.recipientChain);
    message.recipientAddress !== undefined &&
      (obj.recipientAddress = message.recipientAddress);
    message.amount !== undefined &&
      (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.fee !== undefined &&
      (obj.fee = message.fee ? Coin.toJSON(message.fee) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<InsufficientFee>, I>>(
    base?: I
  ): InsufficientFee {
    return InsufficientFee.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<InsufficientFee>, I>>(
    object: I
  ): InsufficientFee {
    const message = createBaseInsufficientFee();
    message.transferId =
      object.transferId !== undefined && object.transferId !== null
        ? Long.fromValue(object.transferId)
        : Long.UZERO;
    message.recipientChain = object.recipientChain ?? "";
    message.recipientAddress = object.recipientAddress ?? "";
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? Coin.fromPartial(object.amount)
        : undefined;
    message.fee =
      object.fee !== undefined && object.fee !== null
        ? Coin.fromPartial(object.fee)
        : undefined;
    return message;
  },
};

function createBaseRateLimitUpdated(): RateLimitUpdated {
  return { chain: "", limit: undefined, window: undefined };
}

export const RateLimitUpdated = {
  encode(
    message: RateLimitUpdated,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.limit !== undefined) {
      Coin.encode(message.limit, writer.uint32(18).fork()).ldelim();
    }
    if (message.window !== undefined) {
      Duration.encode(message.window, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RateLimitUpdated {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitUpdated();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chain = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.limit = Coin.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.window = Duration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RateLimitUpdated {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      limit: isSet(object.limit) ? Coin.fromJSON(object.limit) : undefined,
      window: isSet(object.window)
        ? Duration.fromJSON(object.window)
        : undefined,
    };
  },

  toJSON(message: RateLimitUpdated): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.limit !== undefined &&
      (obj.limit = message.limit ? Coin.toJSON(message.limit) : undefined);
    message.window !== undefined &&
      (obj.window = message.window
        ? Duration.toJSON(message.window)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitUpdated>, I>>(
    base?: I
  ): RateLimitUpdated {
    return RateLimitUpdated.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RateLimitUpdated>, I>>(
    object: I
  ): RateLimitUpdated {
    const message = createBaseRateLimitUpdated();
    message.chain = object.chain ?? "";
    message.limit =
      object.limit !== undefined && object.limit !== null
        ? Coin.fromPartial(object.limit)
        : undefined;
    message.window =
      object.window !== undefined && object.window !== null
        ? Duration.fromPartial(object.window)
        : undefined;
    return message;
  },
};

function createBaseMessageReceived(): MessageReceived {
  return {
    id: "",
    payloadHash: new Uint8Array(),
    sender: undefined,
    recipient: undefined,
  };
}

export const MessageReceived = {
  encode(
    message: MessageReceived,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(18).bytes(message.payloadHash);
    }
    if (message.sender !== undefined) {
      CrossChainAddress.encode(
        message.sender,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.recipient !== undefined) {
      CrossChainAddress.encode(
        message.recipient,
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageReceived {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageReceived();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payloadHash = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sender = CrossChainAddress.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.recipient = CrossChainAddress.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageReceived {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(),
      sender: isSet(object.sender)
        ? CrossChainAddress.fromJSON(object.sender)
        : undefined,
      recipient: isSet(object.recipient)
        ? CrossChainAddress.fromJSON(object.recipient)
        : undefined,
    };
  },

  toJSON(message: MessageReceived): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.payloadHash !== undefined &&
      (obj.payloadHash = base64FromBytes(
        message.payloadHash !== undefined
          ? message.payloadHash
          : new Uint8Array()
      ));
    message.sender !== undefined &&
      (obj.sender = message.sender
        ? CrossChainAddress.toJSON(message.sender)
        : undefined);
    message.recipient !== undefined &&
      (obj.recipient = message.recipient
        ? CrossChainAddress.toJSON(message.recipient)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageReceived>, I>>(
    base?: I
  ): MessageReceived {
    return MessageReceived.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageReceived>, I>>(
    object: I
  ): MessageReceived {
    const message = createBaseMessageReceived();
    message.id = object.id ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array();
    message.sender =
      object.sender !== undefined && object.sender !== null
        ? CrossChainAddress.fromPartial(object.sender)
        : undefined;
    message.recipient =
      object.recipient !== undefined && object.recipient !== null
        ? CrossChainAddress.fromPartial(object.recipient)
        : undefined;
    return message;
  },
};

function createBaseMessageProcessing(): MessageProcessing {
  return { id: "" };
}

export const MessageProcessing = {
  encode(
    message: MessageProcessing,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageProcessing {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageProcessing();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageProcessing {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: MessageProcessing): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageProcessing>, I>>(
    base?: I
  ): MessageProcessing {
    return MessageProcessing.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageProcessing>, I>>(
    object: I
  ): MessageProcessing {
    const message = createBaseMessageProcessing();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseMessageExecuted(): MessageExecuted {
  return { id: "" };
}

export const MessageExecuted = {
  encode(
    message: MessageExecuted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageExecuted {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageExecuted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageExecuted {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: MessageExecuted): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageExecuted>, I>>(
    base?: I
  ): MessageExecuted {
    return MessageExecuted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageExecuted>, I>>(
    object: I
  ): MessageExecuted {
    const message = createBaseMessageExecuted();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseMessageFailed(): MessageFailed {
  return { id: "" };
}

export const MessageFailed = {
  encode(
    message: MessageFailed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageFailed {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageFailed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageFailed {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: MessageFailed): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageFailed>, I>>(
    base?: I
  ): MessageFailed {
    return MessageFailed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageFailed>, I>>(
    object: I
  ): MessageFailed {
    const message = createBaseMessageFailed();
    message.id = object.id ?? "";
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
