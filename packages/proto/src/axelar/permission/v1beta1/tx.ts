/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { LegacyAminoPubKey } from "../../../cosmos/crypto/multisig/keys";

export const protobufPackage = "axelar.permission.v1beta1";

export interface UpdateGovernanceKeyRequest {
  sender: Uint8Array;
  governanceKey?: LegacyAminoPubKey;
}

export interface UpdateGovernanceKeyResponse {}

/** MsgRegisterController represents a message to register a controller account */
export interface RegisterControllerRequest {
  sender: Uint8Array;
  controller: Uint8Array;
}

export interface RegisterControllerResponse {}

/** DeregisterController represents a message to deregister a controller account */
export interface DeregisterControllerRequest {
  sender: Uint8Array;
  controller: Uint8Array;
}

export interface DeregisterControllerResponse {}

function createBaseUpdateGovernanceKeyRequest(): UpdateGovernanceKeyRequest {
  return { sender: new Uint8Array(), governanceKey: undefined };
}

export const UpdateGovernanceKeyRequest = {
  encode(
    message: UpdateGovernanceKeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.governanceKey !== undefined) {
      LegacyAminoPubKey.encode(
        message.governanceKey,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateGovernanceKeyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateGovernanceKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.sender = reader.bytes();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.governanceKey = LegacyAminoPubKey.decode(
            reader,
            reader.uint32()
          );
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateGovernanceKeyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      governanceKey: isSet(object.governanceKey)
        ? LegacyAminoPubKey.fromJSON(object.governanceKey)
        : undefined,
    };
  },

  toJSON(message: UpdateGovernanceKeyRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    message.governanceKey !== undefined &&
      (obj.governanceKey = message.governanceKey
        ? LegacyAminoPubKey.toJSON(message.governanceKey)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateGovernanceKeyRequest>, I>>(
    base?: I
  ): UpdateGovernanceKeyRequest {
    return UpdateGovernanceKeyRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateGovernanceKeyRequest>, I>>(
    object: I
  ): UpdateGovernanceKeyRequest {
    const message = createBaseUpdateGovernanceKeyRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.governanceKey =
      object.governanceKey !== undefined && object.governanceKey !== null
        ? LegacyAminoPubKey.fromPartial(object.governanceKey)
        : undefined;
    return message;
  },
};

function createBaseUpdateGovernanceKeyResponse(): UpdateGovernanceKeyResponse {
  return {};
}

export const UpdateGovernanceKeyResponse = {
  encode(
    _: UpdateGovernanceKeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateGovernanceKeyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateGovernanceKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): UpdateGovernanceKeyResponse {
    return {};
  },

  toJSON(_: UpdateGovernanceKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateGovernanceKeyResponse>, I>>(
    base?: I
  ): UpdateGovernanceKeyResponse {
    return UpdateGovernanceKeyResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateGovernanceKeyResponse>, I>>(
    _: I
  ): UpdateGovernanceKeyResponse {
    const message = createBaseUpdateGovernanceKeyResponse();
    return message;
  },
};

function createBaseRegisterControllerRequest(): RegisterControllerRequest {
  return { sender: new Uint8Array(), controller: new Uint8Array() };
}

export const RegisterControllerRequest = {
  encode(
    message: RegisterControllerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.controller.length !== 0) {
      writer.uint32(18).bytes(message.controller);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterControllerRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterControllerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.sender = reader.bytes();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.controller = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterControllerRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      controller: isSet(object.controller)
        ? bytesFromBase64(object.controller)
        : new Uint8Array(),
    };
  },

  toJSON(message: RegisterControllerRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    message.controller !== undefined &&
      (obj.controller = base64FromBytes(
        message.controller !== undefined ? message.controller : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterControllerRequest>, I>>(
    base?: I
  ): RegisterControllerRequest {
    return RegisterControllerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterControllerRequest>, I>>(
    object: I
  ): RegisterControllerRequest {
    const message = createBaseRegisterControllerRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.controller = object.controller ?? new Uint8Array();
    return message;
  },
};

function createBaseRegisterControllerResponse(): RegisterControllerResponse {
  return {};
}

export const RegisterControllerResponse = {
  encode(
    _: RegisterControllerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterControllerResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterControllerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): RegisterControllerResponse {
    return {};
  },

  toJSON(_: RegisterControllerResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterControllerResponse>, I>>(
    base?: I
  ): RegisterControllerResponse {
    return RegisterControllerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterControllerResponse>, I>>(
    _: I
  ): RegisterControllerResponse {
    const message = createBaseRegisterControllerResponse();
    return message;
  },
};

function createBaseDeregisterControllerRequest(): DeregisterControllerRequest {
  return { sender: new Uint8Array(), controller: new Uint8Array() };
}

export const DeregisterControllerRequest = {
  encode(
    message: DeregisterControllerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.controller.length !== 0) {
      writer.uint32(18).bytes(message.controller);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeregisterControllerRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeregisterControllerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.sender = reader.bytes();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.controller = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeregisterControllerRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      controller: isSet(object.controller)
        ? bytesFromBase64(object.controller)
        : new Uint8Array(),
    };
  },

  toJSON(message: DeregisterControllerRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    message.controller !== undefined &&
      (obj.controller = base64FromBytes(
        message.controller !== undefined ? message.controller : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<DeregisterControllerRequest>, I>>(
    base?: I
  ): DeregisterControllerRequest {
    return DeregisterControllerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeregisterControllerRequest>, I>>(
    object: I
  ): DeregisterControllerRequest {
    const message = createBaseDeregisterControllerRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.controller = object.controller ?? new Uint8Array();
    return message;
  },
};

function createBaseDeregisterControllerResponse(): DeregisterControllerResponse {
  return {};
}

export const DeregisterControllerResponse = {
  encode(
    _: DeregisterControllerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeregisterControllerResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeregisterControllerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeregisterControllerResponse {
    return {};
  },

  toJSON(_: DeregisterControllerResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeregisterControllerResponse>, I>>(
    base?: I
  ): DeregisterControllerResponse {
    return DeregisterControllerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeregisterControllerResponse>, I>>(
    _: I
  ): DeregisterControllerResponse {
    const message = createBaseDeregisterControllerResponse();
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
