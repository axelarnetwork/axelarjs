/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Params } from "./params";

export const protobufPackage = "axelar.snapshot.v1beta1";

export interface QueryValidatorsResponse {
  validators: QueryValidatorsResponse_Validator[];
}

export interface QueryValidatorsResponse_TssIllegibilityInfo {
  tombstoned: boolean;
  jailed: boolean;
  missedTooManyBlocks: boolean;
  noProxyRegistered: boolean;
  tssSuspended: boolean;
  proxyInsuficientFunds: boolean;
  staleTssHeartbeat: boolean;
}

export interface QueryValidatorsResponse_Validator {
  operatorAddress: string;
  moniker: string;
  tssIllegibilityInfo?: QueryValidatorsResponse_TssIllegibilityInfo | undefined;
}

/** ParamsRequest represents a message that queries the params */
export interface ParamsRequest {}

export interface ParamsResponse {
  params?: Params | undefined;
}

function createBaseQueryValidatorsResponse(): QueryValidatorsResponse {
  return { validators: [] };
}

export const QueryValidatorsResponse = {
  encode(
    message: QueryValidatorsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.validators) {
      QueryValidatorsResponse_Validator.encode(
        v!,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryValidatorsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.validators.push(
            QueryValidatorsResponse_Validator.decode(reader, reader.uint32())
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorsResponse {
    return {
      validators: Array.isArray(object?.validators)
        ? object.validators.map((e: any) =>
            QueryValidatorsResponse_Validator.fromJSON(e)
          )
        : [],
    };
  },

  toJSON(message: QueryValidatorsResponse): unknown {
    const obj: any = {};
    if (message.validators?.length) {
      obj.validators = message.validators.map((e) =>
        QueryValidatorsResponse_Validator.toJSON(e)
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryValidatorsResponse>, I>>(
    base?: I
  ): QueryValidatorsResponse {
    return QueryValidatorsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryValidatorsResponse>, I>>(
    object: I
  ): QueryValidatorsResponse {
    const message = createBaseQueryValidatorsResponse();
    message.validators =
      object.validators?.map((e) =>
        QueryValidatorsResponse_Validator.fromPartial(e)
      ) || [];
    return message;
  },
};

function createBaseQueryValidatorsResponse_TssIllegibilityInfo(): QueryValidatorsResponse_TssIllegibilityInfo {
  return {
    tombstoned: false,
    jailed: false,
    missedTooManyBlocks: false,
    noProxyRegistered: false,
    tssSuspended: false,
    proxyInsuficientFunds: false,
    staleTssHeartbeat: false,
  };
}

export const QueryValidatorsResponse_TssIllegibilityInfo = {
  encode(
    message: QueryValidatorsResponse_TssIllegibilityInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tombstoned === true) {
      writer.uint32(8).bool(message.tombstoned);
    }
    if (message.jailed === true) {
      writer.uint32(16).bool(message.jailed);
    }
    if (message.missedTooManyBlocks === true) {
      writer.uint32(24).bool(message.missedTooManyBlocks);
    }
    if (message.noProxyRegistered === true) {
      writer.uint32(32).bool(message.noProxyRegistered);
    }
    if (message.tssSuspended === true) {
      writer.uint32(40).bool(message.tssSuspended);
    }
    if (message.proxyInsuficientFunds === true) {
      writer.uint32(48).bool(message.proxyInsuficientFunds);
    }
    if (message.staleTssHeartbeat === true) {
      writer.uint32(56).bool(message.staleTssHeartbeat);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryValidatorsResponse_TssIllegibilityInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorsResponse_TssIllegibilityInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.tombstoned = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.jailed = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.missedTooManyBlocks = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.noProxyRegistered = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.tssSuspended = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.proxyInsuficientFunds = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.staleTssHeartbeat = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorsResponse_TssIllegibilityInfo {
    return {
      tombstoned: isSet(object.tombstoned) ? Boolean(object.tombstoned) : false,
      jailed: isSet(object.jailed) ? Boolean(object.jailed) : false,
      missedTooManyBlocks: isSet(object.missedTooManyBlocks)
        ? Boolean(object.missedTooManyBlocks)
        : false,
      noProxyRegistered: isSet(object.noProxyRegistered)
        ? Boolean(object.noProxyRegistered)
        : false,
      tssSuspended: isSet(object.tssSuspended)
        ? Boolean(object.tssSuspended)
        : false,
      proxyInsuficientFunds: isSet(object.proxyInsuficientFunds)
        ? Boolean(object.proxyInsuficientFunds)
        : false,
      staleTssHeartbeat: isSet(object.staleTssHeartbeat)
        ? Boolean(object.staleTssHeartbeat)
        : false,
    };
  },

  toJSON(message: QueryValidatorsResponse_TssIllegibilityInfo): unknown {
    const obj: any = {};
    if (message.tombstoned === true) {
      obj.tombstoned = message.tombstoned;
    }
    if (message.jailed === true) {
      obj.jailed = message.jailed;
    }
    if (message.missedTooManyBlocks === true) {
      obj.missedTooManyBlocks = message.missedTooManyBlocks;
    }
    if (message.noProxyRegistered === true) {
      obj.noProxyRegistered = message.noProxyRegistered;
    }
    if (message.tssSuspended === true) {
      obj.tssSuspended = message.tssSuspended;
    }
    if (message.proxyInsuficientFunds === true) {
      obj.proxyInsuficientFunds = message.proxyInsuficientFunds;
    }
    if (message.staleTssHeartbeat === true) {
      obj.staleTssHeartbeat = message.staleTssHeartbeat;
    }
    return obj;
  },

  create<
    I extends Exact<DeepPartial<QueryValidatorsResponse_TssIllegibilityInfo>, I>
  >(base?: I): QueryValidatorsResponse_TssIllegibilityInfo {
    return QueryValidatorsResponse_TssIllegibilityInfo.fromPartial(
      base ?? ({} as any)
    );
  },
  fromPartial<
    I extends Exact<DeepPartial<QueryValidatorsResponse_TssIllegibilityInfo>, I>
  >(object: I): QueryValidatorsResponse_TssIllegibilityInfo {
    const message = createBaseQueryValidatorsResponse_TssIllegibilityInfo();
    message.tombstoned = object.tombstoned ?? false;
    message.jailed = object.jailed ?? false;
    message.missedTooManyBlocks = object.missedTooManyBlocks ?? false;
    message.noProxyRegistered = object.noProxyRegistered ?? false;
    message.tssSuspended = object.tssSuspended ?? false;
    message.proxyInsuficientFunds = object.proxyInsuficientFunds ?? false;
    message.staleTssHeartbeat = object.staleTssHeartbeat ?? false;
    return message;
  },
};

function createBaseQueryValidatorsResponse_Validator(): QueryValidatorsResponse_Validator {
  return { operatorAddress: "", moniker: "", tssIllegibilityInfo: undefined };
}

export const QueryValidatorsResponse_Validator = {
  encode(
    message: QueryValidatorsResponse_Validator,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.operatorAddress !== "") {
      writer.uint32(10).string(message.operatorAddress);
    }
    if (message.moniker !== "") {
      writer.uint32(18).string(message.moniker);
    }
    if (message.tssIllegibilityInfo !== undefined) {
      QueryValidatorsResponse_TssIllegibilityInfo.encode(
        message.tssIllegibilityInfo,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryValidatorsResponse_Validator {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorsResponse_Validator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.operatorAddress = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.moniker = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tssIllegibilityInfo =
            QueryValidatorsResponse_TssIllegibilityInfo.decode(
              reader,
              reader.uint32()
            );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorsResponse_Validator {
    return {
      operatorAddress: isSet(object.operatorAddress)
        ? String(object.operatorAddress)
        : "",
      moniker: isSet(object.moniker) ? String(object.moniker) : "",
      tssIllegibilityInfo: isSet(object.tssIllegibilityInfo)
        ? QueryValidatorsResponse_TssIllegibilityInfo.fromJSON(
            object.tssIllegibilityInfo
          )
        : undefined,
    };
  },

  toJSON(message: QueryValidatorsResponse_Validator): unknown {
    const obj: any = {};
    if (message.operatorAddress !== "") {
      obj.operatorAddress = message.operatorAddress;
    }
    if (message.moniker !== "") {
      obj.moniker = message.moniker;
    }
    if (message.tssIllegibilityInfo !== undefined) {
      obj.tssIllegibilityInfo =
        QueryValidatorsResponse_TssIllegibilityInfo.toJSON(
          message.tssIllegibilityInfo
        );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryValidatorsResponse_Validator>, I>>(
    base?: I
  ): QueryValidatorsResponse_Validator {
    return QueryValidatorsResponse_Validator.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<QueryValidatorsResponse_Validator>, I>
  >(object: I): QueryValidatorsResponse_Validator {
    const message = createBaseQueryValidatorsResponse_Validator();
    message.operatorAddress = object.operatorAddress ?? "";
    message.moniker = object.moniker ?? "";
    message.tssIllegibilityInfo =
      object.tssIllegibilityInfo !== undefined &&
      object.tssIllegibilityInfo !== null
        ? QueryValidatorsResponse_TssIllegibilityInfo.fromPartial(
            object.tssIllegibilityInfo
          )
        : undefined;
    return message;
  },
};

function createBaseParamsRequest(): ParamsRequest {
  return {};
}

export const ParamsRequest = {
  encode(
    _: ParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParamsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsRequest();
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

  fromJSON(_: any): ParamsRequest {
    return {};
  },

  toJSON(_: ParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ParamsRequest>, I>>(
    base?: I
  ): ParamsRequest {
    return ParamsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParamsRequest>, I>>(
    _: I
  ): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
};

function createBaseParamsResponse(): ParamsResponse {
  return { params: undefined };
}

export const ParamsResponse = {
  encode(
    message: ParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParamsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: ParamsResponse): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ParamsResponse>, I>>(
    base?: I
  ): ParamsResponse {
    return ParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParamsResponse>, I>>(
    object: I
  ): ParamsResponse {
    const message = createBaseParamsResponse();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
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
