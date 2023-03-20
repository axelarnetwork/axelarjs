/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { LegacyAminoPubKey } from "../../../cosmos/crypto/multisig/keys";

export const protobufPackage = "axelar.permission.v1beta1";

/**
 * QueryGovernanceKeyRequest is the request type for the
 * Query/GovernanceKey RPC method
 */
export interface QueryGovernanceKeyRequest {}

/**
 * QueryGovernanceKeyResponse is the response type for the
 * Query/GovernanceKey RPC method
 */
export interface QueryGovernanceKeyResponse {
  governanceKey?: LegacyAminoPubKey;
}

function createBaseQueryGovernanceKeyRequest(): QueryGovernanceKeyRequest {
  return {};
}

export const QueryGovernanceKeyRequest = {
  encode(
    _: QueryGovernanceKeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGovernanceKeyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGovernanceKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryGovernanceKeyRequest {
    return {};
  },

  toJSON(_: QueryGovernanceKeyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGovernanceKeyRequest>, I>>(
    base?: I
  ): QueryGovernanceKeyRequest {
    return QueryGovernanceKeyRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<QueryGovernanceKeyRequest>, I>>(
    _: I
  ): QueryGovernanceKeyRequest {
    const message = createBaseQueryGovernanceKeyRequest();
    return message;
  },
};

function createBaseQueryGovernanceKeyResponse(): QueryGovernanceKeyResponse {
  return { governanceKey: undefined };
}

export const QueryGovernanceKeyResponse = {
  encode(
    message: QueryGovernanceKeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.governanceKey !== undefined) {
      LegacyAminoPubKey.encode(
        message.governanceKey,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGovernanceKeyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGovernanceKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.governanceKey = LegacyAminoPubKey.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGovernanceKeyResponse {
    return {
      governanceKey: isSet(object.governanceKey)
        ? LegacyAminoPubKey.fromJSON(object.governanceKey)
        : undefined,
    };
  },

  toJSON(message: QueryGovernanceKeyResponse): unknown {
    const obj: any = {};
    message.governanceKey !== undefined &&
      (obj.governanceKey = message.governanceKey
        ? LegacyAminoPubKey.toJSON(message.governanceKey)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGovernanceKeyResponse>, I>>(
    base?: I
  ): QueryGovernanceKeyResponse {
    return QueryGovernanceKeyResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<QueryGovernanceKeyResponse>, I>>(
    object: I
  ): QueryGovernanceKeyResponse {
    const message = createBaseQueryGovernanceKeyResponse();
    message.governanceKey =
      object.governanceKey !== undefined && object.governanceKey !== null
        ? LegacyAminoPubKey.fromPartial(object.governanceKey)
        : undefined;
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
