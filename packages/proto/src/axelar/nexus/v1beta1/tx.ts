/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
import { FeeInfo } from "../exported/v1beta1/types";

export const protobufPackage = "axelar.nexus.v1beta1";

export interface RegisterChainMaintainerRequest {
  sender: Uint8Array;
  chains: string[];
}

export interface RegisterChainMaintainerResponse {}

export interface DeregisterChainMaintainerRequest {
  sender: Uint8Array;
  chains: string[];
}

export interface DeregisterChainMaintainerResponse {}

/** ActivateChainRequest represents a message to activate chains */
export interface ActivateChainRequest {
  sender: Uint8Array;
  chains: string[];
}

export interface ActivateChainResponse {}

/** DeactivateChainRequest represents a message to deactivate chains */
export interface DeactivateChainRequest {
  sender: Uint8Array;
  chains: string[];
}

export interface DeactivateChainResponse {}

/**
 * RegisterAssetFeeRequest represents a message to register the transfer fee
 * info associated to an asset on a chain
 */
export interface RegisterAssetFeeRequest {
  sender: Uint8Array;
  feeInfo?: FeeInfo;
}

export interface RegisterAssetFeeResponse {}

/**
 * SetTransferRateLimitRequest represents a message to set rate limits on
 * transfers
 */
export interface SetTransferRateLimitRequest {
  sender: Uint8Array;
  chain: string;
  limit?: Coin;
  window?: Duration;
}

export interface SetTransferRateLimitResponse {}

function createBaseRegisterChainMaintainerRequest(): RegisterChainMaintainerRequest {
  return { sender: new Uint8Array(), chains: [] };
}

export const RegisterChainMaintainerRequest = {
  encode(
    message: RegisterChainMaintainerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterChainMaintainerRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterChainMaintainerRequest();
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

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterChainMaintainerRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: RegisterChainMaintainerRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    if (message.chains) {
      obj.chains = message.chains.map((e) => e);
    } else {
      obj.chains = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterChainMaintainerRequest>, I>>(
    base?: I
  ): RegisterChainMaintainerRequest {
    return RegisterChainMaintainerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterChainMaintainerRequest>, I>>(
    object: I
  ): RegisterChainMaintainerRequest {
    const message = createBaseRegisterChainMaintainerRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseRegisterChainMaintainerResponse(): RegisterChainMaintainerResponse {
  return {};
}

export const RegisterChainMaintainerResponse = {
  encode(
    _: RegisterChainMaintainerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterChainMaintainerResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterChainMaintainerResponse();
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

  fromJSON(_: any): RegisterChainMaintainerResponse {
    return {};
  },

  toJSON(_: RegisterChainMaintainerResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterChainMaintainerResponse>, I>>(
    base?: I
  ): RegisterChainMaintainerResponse {
    return RegisterChainMaintainerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterChainMaintainerResponse>, I>>(
    _: I
  ): RegisterChainMaintainerResponse {
    const message = createBaseRegisterChainMaintainerResponse();
    return message;
  },
};

function createBaseDeregisterChainMaintainerRequest(): DeregisterChainMaintainerRequest {
  return { sender: new Uint8Array(), chains: [] };
}

export const DeregisterChainMaintainerRequest = {
  encode(
    message: DeregisterChainMaintainerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeregisterChainMaintainerRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeregisterChainMaintainerRequest();
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

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeregisterChainMaintainerRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DeregisterChainMaintainerRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    if (message.chains) {
      obj.chains = message.chains.map((e) => e);
    } else {
      obj.chains = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeregisterChainMaintainerRequest>, I>>(
    base?: I
  ): DeregisterChainMaintainerRequest {
    return DeregisterChainMaintainerRequest.fromPartial(base ?? {});
  },

  fromPartial<
    I extends Exact<DeepPartial<DeregisterChainMaintainerRequest>, I>
  >(object: I): DeregisterChainMaintainerRequest {
    const message = createBaseDeregisterChainMaintainerRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseDeregisterChainMaintainerResponse(): DeregisterChainMaintainerResponse {
  return {};
}

export const DeregisterChainMaintainerResponse = {
  encode(
    _: DeregisterChainMaintainerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeregisterChainMaintainerResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeregisterChainMaintainerResponse();
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

  fromJSON(_: any): DeregisterChainMaintainerResponse {
    return {};
  },

  toJSON(_: DeregisterChainMaintainerResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeregisterChainMaintainerResponse>, I>>(
    base?: I
  ): DeregisterChainMaintainerResponse {
    return DeregisterChainMaintainerResponse.fromPartial(base ?? {});
  },

  fromPartial<
    I extends Exact<DeepPartial<DeregisterChainMaintainerResponse>, I>
  >(_: I): DeregisterChainMaintainerResponse {
    const message = createBaseDeregisterChainMaintainerResponse();
    return message;
  },
};

function createBaseActivateChainRequest(): ActivateChainRequest {
  return { sender: new Uint8Array(), chains: [] };
}

export const ActivateChainRequest = {
  encode(
    message: ActivateChainRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ActivateChainRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateChainRequest();
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

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActivateChainRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: ActivateChainRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    if (message.chains) {
      obj.chains = message.chains.map((e) => e);
    } else {
      obj.chains = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateChainRequest>, I>>(
    base?: I
  ): ActivateChainRequest {
    return ActivateChainRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ActivateChainRequest>, I>>(
    object: I
  ): ActivateChainRequest {
    const message = createBaseActivateChainRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseActivateChainResponse(): ActivateChainResponse {
  return {};
}

export const ActivateChainResponse = {
  encode(
    _: ActivateChainResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ActivateChainResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateChainResponse();
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

  fromJSON(_: any): ActivateChainResponse {
    return {};
  },

  toJSON(_: ActivateChainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateChainResponse>, I>>(
    base?: I
  ): ActivateChainResponse {
    return ActivateChainResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ActivateChainResponse>, I>>(
    _: I
  ): ActivateChainResponse {
    const message = createBaseActivateChainResponse();
    return message;
  },
};

function createBaseDeactivateChainRequest(): DeactivateChainRequest {
  return { sender: new Uint8Array(), chains: [] };
}

export const DeactivateChainRequest = {
  encode(
    message: DeactivateChainRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeactivateChainRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateChainRequest();
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

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeactivateChainRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DeactivateChainRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    if (message.chains) {
      obj.chains = message.chains.map((e) => e);
    } else {
      obj.chains = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateChainRequest>, I>>(
    base?: I
  ): DeactivateChainRequest {
    return DeactivateChainRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeactivateChainRequest>, I>>(
    object: I
  ): DeactivateChainRequest {
    const message = createBaseDeactivateChainRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseDeactivateChainResponse(): DeactivateChainResponse {
  return {};
}

export const DeactivateChainResponse = {
  encode(
    _: DeactivateChainResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeactivateChainResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeactivateChainResponse();
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

  fromJSON(_: any): DeactivateChainResponse {
    return {};
  },

  toJSON(_: DeactivateChainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeactivateChainResponse>, I>>(
    base?: I
  ): DeactivateChainResponse {
    return DeactivateChainResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeactivateChainResponse>, I>>(
    _: I
  ): DeactivateChainResponse {
    const message = createBaseDeactivateChainResponse();
    return message;
  },
};

function createBaseRegisterAssetFeeRequest(): RegisterAssetFeeRequest {
  return { sender: new Uint8Array(), feeInfo: undefined };
}

export const RegisterAssetFeeRequest = {
  encode(
    message: RegisterAssetFeeRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.feeInfo !== undefined) {
      FeeInfo.encode(message.feeInfo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterAssetFeeRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterAssetFeeRequest();
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

          message.feeInfo = FeeInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterAssetFeeRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      feeInfo: isSet(object.feeInfo)
        ? FeeInfo.fromJSON(object.feeInfo)
        : undefined,
    };
  },

  toJSON(message: RegisterAssetFeeRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    message.feeInfo !== undefined &&
      (obj.feeInfo = message.feeInfo
        ? FeeInfo.toJSON(message.feeInfo)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterAssetFeeRequest>, I>>(
    base?: I
  ): RegisterAssetFeeRequest {
    return RegisterAssetFeeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterAssetFeeRequest>, I>>(
    object: I
  ): RegisterAssetFeeRequest {
    const message = createBaseRegisterAssetFeeRequest();
    message.sender = object.sender ?? new Uint8Array();
    message.feeInfo =
      object.feeInfo !== undefined && object.feeInfo !== null
        ? FeeInfo.fromPartial(object.feeInfo)
        : undefined;
    return message;
  },
};

function createBaseRegisterAssetFeeResponse(): RegisterAssetFeeResponse {
  return {};
}

export const RegisterAssetFeeResponse = {
  encode(
    _: RegisterAssetFeeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterAssetFeeResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterAssetFeeResponse();
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

  fromJSON(_: any): RegisterAssetFeeResponse {
    return {};
  },

  toJSON(_: RegisterAssetFeeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterAssetFeeResponse>, I>>(
    base?: I
  ): RegisterAssetFeeResponse {
    return RegisterAssetFeeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterAssetFeeResponse>, I>>(
    _: I
  ): RegisterAssetFeeResponse {
    const message = createBaseRegisterAssetFeeResponse();
    return message;
  },
};

function createBaseSetTransferRateLimitRequest(): SetTransferRateLimitRequest {
  return {
    sender: new Uint8Array(),
    chain: "",
    limit: undefined,
    window: undefined,
  };
}

export const SetTransferRateLimitRequest = {
  encode(
    message: SetTransferRateLimitRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.limit !== undefined) {
      Coin.encode(message.limit, writer.uint32(26).fork()).ldelim();
    }
    if (message.window !== undefined) {
      Duration.encode(message.window, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SetTransferRateLimitRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetTransferRateLimitRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.limit = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.window = Duration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetTransferRateLimitRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      limit: isSet(object.limit) ? Coin.fromJSON(object.limit) : undefined,
      window: isSet(object.window)
        ? Duration.fromJSON(object.window)
        : undefined,
    };
  },

  toJSON(message: SetTransferRateLimitRequest): unknown {
    const obj: any = {};
    message.sender !== undefined &&
      (obj.sender = base64FromBytes(
        message.sender !== undefined ? message.sender : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.limit !== undefined &&
      (obj.limit = message.limit ? Coin.toJSON(message.limit) : undefined);
    message.window !== undefined &&
      (obj.window = message.window
        ? Duration.toJSON(message.window)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SetTransferRateLimitRequest>, I>>(
    base?: I
  ): SetTransferRateLimitRequest {
    return SetTransferRateLimitRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetTransferRateLimitRequest>, I>>(
    object: I
  ): SetTransferRateLimitRequest {
    const message = createBaseSetTransferRateLimitRequest();
    message.sender = object.sender ?? new Uint8Array();
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

function createBaseSetTransferRateLimitResponse(): SetTransferRateLimitResponse {
  return {};
}

export const SetTransferRateLimitResponse = {
  encode(
    _: SetTransferRateLimitResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SetTransferRateLimitResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetTransferRateLimitResponse();
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

  fromJSON(_: any): SetTransferRateLimitResponse {
    return {};
  },

  toJSON(_: SetTransferRateLimitResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SetTransferRateLimitResponse>, I>>(
    base?: I
  ): SetTransferRateLimitResponse {
    return SetTransferRateLimitResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetTransferRateLimitResponse>, I>>(
    _: I
  ): SetTransferRateLimitResponse {
    const message = createBaseSetTransferRateLimitResponse();
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
