/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.tss.tofnd.v1beta1";

/** File copied from golang tofnd with minor tweaks */

/** Key presence check types */
export interface KeyPresenceRequest {
  keyUid: string;
  /** SEC1-encoded compressed pub key bytes to find the right */
  pubKey: Uint8Array;
}

export interface KeyPresenceResponse {
  response: KeyPresenceResponse_Response;
}

export enum KeyPresenceResponse_Response {
  RESPONSE_UNSPECIFIED = 0,
  RESPONSE_PRESENT = 1,
  RESPONSE_ABSENT = 2,
  RESPONSE_FAIL = 3,
  UNRECOGNIZED = -1,
}

export function keyPresenceResponse_ResponseFromJSON(
  object: any
): KeyPresenceResponse_Response {
  switch (object) {
    case 0:
    case "RESPONSE_UNSPECIFIED":
      return KeyPresenceResponse_Response.RESPONSE_UNSPECIFIED;
    case 1:
    case "RESPONSE_PRESENT":
      return KeyPresenceResponse_Response.RESPONSE_PRESENT;
    case 2:
    case "RESPONSE_ABSENT":
      return KeyPresenceResponse_Response.RESPONSE_ABSENT;
    case 3:
    case "RESPONSE_FAIL":
      return KeyPresenceResponse_Response.RESPONSE_FAIL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return KeyPresenceResponse_Response.UNRECOGNIZED;
  }
}

export function keyPresenceResponse_ResponseToJSON(
  object: KeyPresenceResponse_Response
): string {
  switch (object) {
    case KeyPresenceResponse_Response.RESPONSE_UNSPECIFIED:
      return "RESPONSE_UNSPECIFIED";
    case KeyPresenceResponse_Response.RESPONSE_PRESENT:
      return "RESPONSE_PRESENT";
    case KeyPresenceResponse_Response.RESPONSE_ABSENT:
      return "RESPONSE_ABSENT";
    case KeyPresenceResponse_Response.RESPONSE_FAIL:
      return "RESPONSE_FAIL";
    case KeyPresenceResponse_Response.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseKeyPresenceRequest(): KeyPresenceRequest {
  return { keyUid: "", pubKey: new Uint8Array(0) };
}

export const KeyPresenceRequest = {
  encode(
    message: KeyPresenceRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyUid !== "") {
      writer.uint32(10).string(message.keyUid);
    }
    if (message.pubKey.length !== 0) {
      writer.uint32(18).bytes(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyPresenceRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyPresenceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.keyUid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pubKey = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeyPresenceRequest {
    return {
      keyUid: isSet(object.keyUid) ? String(object.keyUid) : "",
      pubKey: isSet(object.pubKey)
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array(0),
    };
  },

  toJSON(message: KeyPresenceRequest): unknown {
    const obj: any = {};
    if (message.keyUid !== "") {
      obj.keyUid = message.keyUid;
    }
    if (message.pubKey.length !== 0) {
      obj.pubKey = base64FromBytes(message.pubKey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyPresenceRequest>, I>>(
    base?: I
  ): KeyPresenceRequest {
    return KeyPresenceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyPresenceRequest>, I>>(
    object: I
  ): KeyPresenceRequest {
    const message = createBaseKeyPresenceRequest();
    message.keyUid = object.keyUid ?? "";
    message.pubKey = object.pubKey ?? new Uint8Array(0);
    return message;
  },
};

function createBaseKeyPresenceResponse(): KeyPresenceResponse {
  return { response: 0 };
}

export const KeyPresenceResponse = {
  encode(
    message: KeyPresenceResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.response !== 0) {
      writer.uint32(8).int32(message.response);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyPresenceResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyPresenceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.response = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeyPresenceResponse {
    return {
      response: isSet(object.response)
        ? keyPresenceResponse_ResponseFromJSON(object.response)
        : 0,
    };
  },

  toJSON(message: KeyPresenceResponse): unknown {
    const obj: any = {};
    if (message.response !== 0) {
      obj.response = keyPresenceResponse_ResponseToJSON(message.response);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyPresenceResponse>, I>>(
    base?: I
  ): KeyPresenceResponse {
    return KeyPresenceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyPresenceResponse>, I>>(
    object: I
  ): KeyPresenceResponse {
    const message = createBaseKeyPresenceResponse();
    message.response = object.response ?? 0;
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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
