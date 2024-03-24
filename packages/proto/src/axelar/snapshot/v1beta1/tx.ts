/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.snapshot.v1beta1";

export interface RegisterProxyRequest {
  sender: Uint8Array;
  proxyAddr: Uint8Array;
}

export interface RegisterProxyResponse {}

export interface DeactivateProxyRequest {
  sender: Uint8Array;
}

export interface DeactivateProxyResponse {}

function createBaseRegisterProxyRequest(): RegisterProxyRequest {
  return { sender: new Uint8Array(0), proxyAddr: new Uint8Array(0) };
}

export const RegisterProxyRequest = {
  encode(
    message: RegisterProxyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.proxyAddr.length !== 0) {
      writer.uint32(18).bytes(message.proxyAddr);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterProxyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterProxyRequest();
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

          message.proxyAddr = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterProxyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      proxyAddr: isSet(object.proxyAddr)
        ? bytesFromBase64(object.proxyAddr)
        : new Uint8Array(0),
    };
  },

  toJSON(message: RegisterProxyRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.proxyAddr.length !== 0) {
      obj.proxyAddr = base64FromBytes(message.proxyAddr);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterProxyRequest>, I>>(
    base?: I
  ): RegisterProxyRequest {
    return RegisterProxyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterProxyRequest>, I>>(
    object: I
  ): RegisterProxyRequest {
    const message = createBaseRegisterProxyRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.proxyAddr = object.proxyAddr ?? new Uint8Array(0);
    return message;
  },
};

function createBaseRegisterProxyResponse(): RegisterProxyResponse {
  return {};
}

export const RegisterProxyResponse = {
  encode(
    _: RegisterProxyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterProxyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterProxyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): RegisterProxyResponse {
    return {};
  },

  toJSON(_: RegisterProxyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterProxyResponse>, I>>(
    base?: I
  ): RegisterProxyResponse {
    return RegisterProxyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterProxyResponse>, I>>(
    _: I
  ): RegisterProxyResponse {
    const message = createBaseRegisterProxyResponse();
    return message;
  },
};

function createBaseDeactivateProxyRequest(): DeactivateProxyRequest {
  return { sender: new Uint8Array(0) };
}

export const DeactivateProxyRequest = {
  encode(
    message: DeactivateProxyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeactivateProxyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateProxyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeactivateProxyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
    };
  },

  toJSON(message: DeactivateProxyRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateProxyRequest>, I>>(
    base?: I
  ): DeactivateProxyRequest {
    return DeactivateProxyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeactivateProxyRequest>, I>>(
    object: I
  ): DeactivateProxyRequest {
    const message = createBaseDeactivateProxyRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDeactivateProxyResponse(): DeactivateProxyResponse {
  return {};
}

export const DeactivateProxyResponse = {
  encode(
    _: DeactivateProxyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeactivateProxyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateProxyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeactivateProxyResponse {
    return {};
  },

  toJSON(_: DeactivateProxyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateProxyResponse>, I>>(
    base?: I
  ): DeactivateProxyResponse {
    return DeactivateProxyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeactivateProxyResponse>, I>>(
    _: I
  ): DeactivateProxyResponse {
    const message = createBaseDeactivateProxyResponse();
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
