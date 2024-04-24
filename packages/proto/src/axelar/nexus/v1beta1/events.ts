/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
import { CrossChainAddress, WasmMessage } from "../exported/v1beta1/types";

export const protobufPackage = "axelar.nexus.v1beta1";

export interface FeeDeducted {
  transferId: Long;
  recipientChain: string;
  recipientAddress: string;
  amount?: Coin | undefined;
  fee?: Coin | undefined;
}

export interface InsufficientFee {
  transferId: Long;
  recipientChain: string;
  recipientAddress: string;
  amount?: Coin | undefined;
  fee?: Coin | undefined;
}

export interface RateLimitUpdated {
  chain: string;
  limit?: Coin | undefined;
  window?: Duration | undefined;
}

export interface MessageReceived {
  id: string;
  payloadHash: Uint8Array;
  sender?: CrossChainAddress | undefined;
  recipient?: CrossChainAddress | undefined;
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

export interface WasmMessageRouted {
  message?: WasmMessage | undefined;
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
    if (!message.transferId.equals(Long.UZERO)) {
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
        ? globalThis.String(object.recipientChain)
        : "",
      recipientAddress: isSet(object.recipientAddress)
        ? globalThis.String(object.recipientAddress)
        : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined,
    };
  },

  toJSON(message: FeeDeducted): unknown {
    const obj: any = {};
    if (!message.transferId.equals(Long.UZERO)) {
      obj.transferId = (message.transferId || Long.UZERO).toString();
    }
    if (message.recipientChain !== "") {
      obj.recipientChain = message.recipientChain;
    }
    if (message.recipientAddress !== "") {
      obj.recipientAddress = message.recipientAddress;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    if (message.fee !== undefined) {
      obj.fee = Coin.toJSON(message.fee);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeeDeducted>, I>>(base?: I): FeeDeducted {
    return FeeDeducted.fromPartial(base ?? ({} as any));
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
    if (!message.transferId.equals(Long.UZERO)) {
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
        ? globalThis.String(object.recipientChain)
        : "",
      recipientAddress: isSet(object.recipientAddress)
        ? globalThis.String(object.recipientAddress)
        : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined,
    };
  },

  toJSON(message: InsufficientFee): unknown {
    const obj: any = {};
    if (!message.transferId.equals(Long.UZERO)) {
      obj.transferId = (message.transferId || Long.UZERO).toString();
    }
    if (message.recipientChain !== "") {
      obj.recipientChain = message.recipientChain;
    }
    if (message.recipientAddress !== "") {
      obj.recipientAddress = message.recipientAddress;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    if (message.fee !== undefined) {
      obj.fee = Coin.toJSON(message.fee);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<InsufficientFee>, I>>(
    base?: I
  ): InsufficientFee {
    return InsufficientFee.fromPartial(base ?? ({} as any));
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
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      limit: isSet(object.limit) ? Coin.fromJSON(object.limit) : undefined,
      window: isSet(object.window)
        ? Duration.fromJSON(object.window)
        : undefined,
    };
  },

  toJSON(message: RateLimitUpdated): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.limit !== undefined) {
      obj.limit = Coin.toJSON(message.limit);
    }
    if (message.window !== undefined) {
      obj.window = Duration.toJSON(message.window);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitUpdated>, I>>(
    base?: I
  ): RateLimitUpdated {
    return RateLimitUpdated.fromPartial(base ?? ({} as any));
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
    payloadHash: new Uint8Array(0),
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
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(0),
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
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.payloadHash.length !== 0) {
      obj.payloadHash = base64FromBytes(message.payloadHash);
    }
    if (message.sender !== undefined) {
      obj.sender = CrossChainAddress.toJSON(message.sender);
    }
    if (message.recipient !== undefined) {
      obj.recipient = CrossChainAddress.toJSON(message.recipient);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageReceived>, I>>(
    base?: I
  ): MessageReceived {
    return MessageReceived.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageReceived>, I>>(
    object: I
  ): MessageReceived {
    const message = createBaseMessageReceived();
    message.id = object.id ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array(0);
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
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: MessageProcessing): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageProcessing>, I>>(
    base?: I
  ): MessageProcessing {
    return MessageProcessing.fromPartial(base ?? ({} as any));
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
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: MessageExecuted): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageExecuted>, I>>(
    base?: I
  ): MessageExecuted {
    return MessageExecuted.fromPartial(base ?? ({} as any));
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
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: MessageFailed): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageFailed>, I>>(
    base?: I
  ): MessageFailed {
    return MessageFailed.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageFailed>, I>>(
    object: I
  ): MessageFailed {
    const message = createBaseMessageFailed();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseWasmMessageRouted(): WasmMessageRouted {
  return { message: undefined };
}

export const WasmMessageRouted = {
  encode(
    message: WasmMessageRouted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.message !== undefined) {
      WasmMessage.encode(message.message, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WasmMessageRouted {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWasmMessageRouted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = WasmMessage.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WasmMessageRouted {
    return {
      message: isSet(object.message)
        ? WasmMessage.fromJSON(object.message)
        : undefined,
    };
  },

  toJSON(message: WasmMessageRouted): unknown {
    const obj: any = {};
    if (message.message !== undefined) {
      obj.message = WasmMessage.toJSON(message.message);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WasmMessageRouted>, I>>(
    base?: I
  ): WasmMessageRouted {
    return WasmMessageRouted.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WasmMessageRouted>, I>>(
    object: I
  ): WasmMessageRouted {
    const message = createBaseWasmMessageRouted();
    message.message =
      object.message !== undefined && object.message !== null
        ? WasmMessage.fromPartial(object.message)
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
