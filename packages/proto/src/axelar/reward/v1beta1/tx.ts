/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Any } from "../../../google/protobuf/any";

export const protobufPackage = "axelar.reward.v1beta1";

export interface RefundMsgRequest {
  sender: Uint8Array;
  innerMessage?: Any | undefined;
}

export interface RefundMsgResponse {
  data: Uint8Array;
  log: string;
}

function createBaseRefundMsgRequest(): RefundMsgRequest {
  return { sender: new Uint8Array(0), innerMessage: undefined };
}

export const RefundMsgRequest = {
  encode(
    message: RefundMsgRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.innerMessage !== undefined) {
      Any.encode(message.innerMessage, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefundMsgRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefundMsgRequest();
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

          message.innerMessage = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefundMsgRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      innerMessage: isSet(object.innerMessage)
        ? Any.fromJSON(object.innerMessage)
        : undefined,
    };
  },

  toJSON(message: RefundMsgRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.innerMessage !== undefined) {
      obj.innerMessage = Any.toJSON(message.innerMessage);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefundMsgRequest>, I>>(
    base?: I
  ): RefundMsgRequest {
    return RefundMsgRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefundMsgRequest>, I>>(
    object: I
  ): RefundMsgRequest {
    const message = createBaseRefundMsgRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.innerMessage =
      object.innerMessage !== undefined && object.innerMessage !== null
        ? Any.fromPartial(object.innerMessage)
        : undefined;
    return message;
  },
};

function createBaseRefundMsgResponse(): RefundMsgResponse {
  return { data: new Uint8Array(0), log: "" };
}

export const RefundMsgResponse = {
  encode(
    message: RefundMsgResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.data.length !== 0) {
      writer.uint32(10).bytes(message.data);
    }
    if (message.log !== "") {
      writer.uint32(18).string(message.log);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefundMsgResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefundMsgResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.data = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.log = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefundMsgResponse {
    return {
      data: isSet(object.data)
        ? bytesFromBase64(object.data)
        : new Uint8Array(0),
      log: isSet(object.log) ? globalThis.String(object.log) : "",
    };
  },

  toJSON(message: RefundMsgResponse): unknown {
    const obj: any = {};
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    if (message.log !== "") {
      obj.log = message.log;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefundMsgResponse>, I>>(
    base?: I
  ): RefundMsgResponse {
    return RefundMsgResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefundMsgResponse>, I>>(
    object: I
  ): RefundMsgResponse {
    const message = createBaseRefundMsgResponse();
    message.data = object.data ?? new Uint8Array(0);
    message.log = object.log ?? "";
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
