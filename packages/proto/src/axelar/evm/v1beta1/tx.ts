/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import {
  KeyType,
  keyTypeFromJSON,
  keyTypeToJSON,
} from "../../tss/exported/v1beta1/types";
import { Asset, TokenDetails } from "./types";

export const protobufPackage = "axelar.evm.v1beta1";

export interface SetGatewayRequest {
  sender: Uint8Array;
  chain: string;
  address: Uint8Array;
}

export interface SetGatewayResponse {}

/** @deprecated */
export interface ConfirmGatewayTxRequest {
  sender: Uint8Array;
  chain: string;
  txId: Uint8Array;
}

/** @deprecated */
export interface ConfirmGatewayTxResponse {}

export interface ConfirmGatewayTxsRequest {
  sender: Uint8Array;
  chain: string;
  txIds: Uint8Array[];
}

export interface ConfirmGatewayTxsResponse {}

/** MsgConfirmDeposit represents an erc20 deposit confirmation message */
export interface ConfirmDepositRequest {
  sender: Uint8Array;
  chain: string;
  txId: Uint8Array;
  /** @deprecated */
  amount: Uint8Array;
  burnerAddress: Uint8Array;
}

export interface ConfirmDepositResponse {}

/** MsgConfirmToken represents a token deploy confirmation message */
export interface ConfirmTokenRequest {
  sender: Uint8Array;
  chain: string;
  txId: Uint8Array;
  asset?: Asset | undefined;
}

export interface ConfirmTokenResponse {}

export interface ConfirmTransferKeyRequest {
  sender: Uint8Array;
  chain: string;
  txId: Uint8Array;
}

export interface ConfirmTransferKeyResponse {}

/**
 * MsgLink represents the message that links a cross chain address to a burner
 * address
 */
export interface LinkRequest {
  sender: Uint8Array;
  chain: string;
  recipientAddr: string;
  asset: string;
  recipientChain: string;
}

export interface LinkResponse {
  depositAddr: string;
}

/**
 * CreateBurnTokensRequest represents the message to create commands to burn
 * tokens with AxelarGateway
 */
export interface CreateBurnTokensRequest {
  sender: Uint8Array;
  chain: string;
}

export interface CreateBurnTokensResponse {}

/**
 * CreateDeployTokenRequest represents the message to create a deploy token
 * command for AxelarGateway
 */
export interface CreateDeployTokenRequest {
  sender: Uint8Array;
  chain: string;
  asset?: Asset | undefined;
  tokenDetails?: TokenDetails | undefined;
  address: Uint8Array;
  dailyMintLimit: string;
}

export interface CreateDeployTokenResponse {}

/**
 * CreatePendingTransfersRequest represents a message to trigger the creation of
 * commands handling all pending transfers
 */
export interface CreatePendingTransfersRequest {
  sender: Uint8Array;
  chain: string;
}

export interface CreatePendingTransfersResponse {}

/** @deprecated */
export interface CreateTransferOwnershipRequest {
  sender: Uint8Array;
  chain: string;
  keyId: string;
}

/** @deprecated */
export interface CreateTransferOwnershipResponse {}

export interface CreateTransferOperatorshipRequest {
  sender: Uint8Array;
  chain: string;
  keyId: string;
}

export interface CreateTransferOperatorshipResponse {}

export interface SignCommandsRequest {
  sender: Uint8Array;
  chain: string;
}

export interface SignCommandsResponse {
  batchedCommandsId: Uint8Array;
  commandCount: number;
}

export interface AddChainRequest {
  sender: Uint8Array;
  name: string;
  /** @deprecated */
  keyType: KeyType;
  params: Uint8Array;
}

export interface AddChainResponse {}

export interface RetryFailedEventRequest {
  sender: Uint8Array;
  chain: string;
  eventId: string;
}

export interface RetryFailedEventResponse {}

function createBaseSetGatewayRequest(): SetGatewayRequest {
  return { sender: new Uint8Array(0), chain: "", address: new Uint8Array(0) };
}

export const SetGatewayRequest = {
  encode(
    message: SetGatewayRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.address.length !== 0) {
      writer.uint32(26).bytes(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetGatewayRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetGatewayRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.address = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetGatewayRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(0),
    };
  },

  toJSON(message: SetGatewayRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SetGatewayRequest>, I>>(
    base?: I
  ): SetGatewayRequest {
    return SetGatewayRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetGatewayRequest>, I>>(
    object: I
  ): SetGatewayRequest {
    const message = createBaseSetGatewayRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.address = object.address ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSetGatewayResponse(): SetGatewayResponse {
  return {};
}

export const SetGatewayResponse = {
  encode(
    _: SetGatewayResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetGatewayResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetGatewayResponse();
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

  fromJSON(_: any): SetGatewayResponse {
    return {};
  },

  toJSON(_: SetGatewayResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SetGatewayResponse>, I>>(
    base?: I
  ): SetGatewayResponse {
    return SetGatewayResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetGatewayResponse>, I>>(
    _: I
  ): SetGatewayResponse {
    const message = createBaseSetGatewayResponse();
    return message;
  },
};

function createBaseConfirmGatewayTxRequest(): ConfirmGatewayTxRequest {
  return { sender: new Uint8Array(0), chain: "", txId: new Uint8Array(0) };
}

export const ConfirmGatewayTxRequest = {
  encode(
    message: ConfirmGatewayTxRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(26).bytes(message.txId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmGatewayTxRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmGatewayTxRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txId = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmGatewayTxRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ConfirmGatewayTxRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmGatewayTxRequest>, I>>(
    base?: I
  ): ConfirmGatewayTxRequest {
    return ConfirmGatewayTxRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmGatewayTxRequest>, I>>(
    object: I
  ): ConfirmGatewayTxRequest {
    const message = createBaseConfirmGatewayTxRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
    return message;
  },
};

function createBaseConfirmGatewayTxResponse(): ConfirmGatewayTxResponse {
  return {};
}

export const ConfirmGatewayTxResponse = {
  encode(
    _: ConfirmGatewayTxResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmGatewayTxResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmGatewayTxResponse();
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

  fromJSON(_: any): ConfirmGatewayTxResponse {
    return {};
  },

  toJSON(_: ConfirmGatewayTxResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmGatewayTxResponse>, I>>(
    base?: I
  ): ConfirmGatewayTxResponse {
    return ConfirmGatewayTxResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmGatewayTxResponse>, I>>(
    _: I
  ): ConfirmGatewayTxResponse {
    const message = createBaseConfirmGatewayTxResponse();
    return message;
  },
};

function createBaseConfirmGatewayTxsRequest(): ConfirmGatewayTxsRequest {
  return { sender: new Uint8Array(0), chain: "", txIds: [] };
}

export const ConfirmGatewayTxsRequest = {
  encode(
    message: ConfirmGatewayTxsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    for (const v of message.txIds) {
      writer.uint32(26).bytes(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmGatewayTxsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmGatewayTxsRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txIds.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmGatewayTxsRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txIds: globalThis.Array.isArray(object?.txIds)
        ? object.txIds.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: ConfirmGatewayTxsRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txIds?.length) {
      obj.txIds = message.txIds.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmGatewayTxsRequest>, I>>(
    base?: I
  ): ConfirmGatewayTxsRequest {
    return ConfirmGatewayTxsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmGatewayTxsRequest>, I>>(
    object: I
  ): ConfirmGatewayTxsRequest {
    const message = createBaseConfirmGatewayTxsRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.txIds = object.txIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseConfirmGatewayTxsResponse(): ConfirmGatewayTxsResponse {
  return {};
}

export const ConfirmGatewayTxsResponse = {
  encode(
    _: ConfirmGatewayTxsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmGatewayTxsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmGatewayTxsResponse();
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

  fromJSON(_: any): ConfirmGatewayTxsResponse {
    return {};
  },

  toJSON(_: ConfirmGatewayTxsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmGatewayTxsResponse>, I>>(
    base?: I
  ): ConfirmGatewayTxsResponse {
    return ConfirmGatewayTxsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmGatewayTxsResponse>, I>>(
    _: I
  ): ConfirmGatewayTxsResponse {
    const message = createBaseConfirmGatewayTxsResponse();
    return message;
  },
};

function createBaseConfirmDepositRequest(): ConfirmDepositRequest {
  return {
    sender: new Uint8Array(0),
    chain: "",
    txId: new Uint8Array(0),
    amount: new Uint8Array(0),
    burnerAddress: new Uint8Array(0),
  };
}

export const ConfirmDepositRequest = {
  encode(
    message: ConfirmDepositRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(26).bytes(message.txId);
    }
    if (message.amount.length !== 0) {
      writer.uint32(34).bytes(message.amount);
    }
    if (message.burnerAddress.length !== 0) {
      writer.uint32(42).bytes(message.burnerAddress);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmDepositRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmDepositRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txId = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.amount = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.burnerAddress = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmDepositRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
      amount: isSet(object.amount)
        ? bytesFromBase64(object.amount)
        : new Uint8Array(0),
      burnerAddress: isSet(object.burnerAddress)
        ? bytesFromBase64(object.burnerAddress)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ConfirmDepositRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    if (message.amount.length !== 0) {
      obj.amount = base64FromBytes(message.amount);
    }
    if (message.burnerAddress.length !== 0) {
      obj.burnerAddress = base64FromBytes(message.burnerAddress);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmDepositRequest>, I>>(
    base?: I
  ): ConfirmDepositRequest {
    return ConfirmDepositRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmDepositRequest>, I>>(
    object: I
  ): ConfirmDepositRequest {
    const message = createBaseConfirmDepositRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
    message.amount = object.amount ?? new Uint8Array(0);
    message.burnerAddress = object.burnerAddress ?? new Uint8Array(0);
    return message;
  },
};

function createBaseConfirmDepositResponse(): ConfirmDepositResponse {
  return {};
}

export const ConfirmDepositResponse = {
  encode(
    _: ConfirmDepositResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmDepositResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmDepositResponse();
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

  fromJSON(_: any): ConfirmDepositResponse {
    return {};
  },

  toJSON(_: ConfirmDepositResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmDepositResponse>, I>>(
    base?: I
  ): ConfirmDepositResponse {
    return ConfirmDepositResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmDepositResponse>, I>>(
    _: I
  ): ConfirmDepositResponse {
    const message = createBaseConfirmDepositResponse();
    return message;
  },
};

function createBaseConfirmTokenRequest(): ConfirmTokenRequest {
  return {
    sender: new Uint8Array(0),
    chain: "",
    txId: new Uint8Array(0),
    asset: undefined,
  };
}

export const ConfirmTokenRequest = {
  encode(
    message: ConfirmTokenRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(26).bytes(message.txId);
    }
    if (message.asset !== undefined) {
      Asset.encode(message.asset, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmTokenRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmTokenRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txId = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.asset = Asset.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmTokenRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
      asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined,
    };
  },

  toJSON(message: ConfirmTokenRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmTokenRequest>, I>>(
    base?: I
  ): ConfirmTokenRequest {
    return ConfirmTokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmTokenRequest>, I>>(
    object: I
  ): ConfirmTokenRequest {
    const message = createBaseConfirmTokenRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
    message.asset =
      object.asset !== undefined && object.asset !== null
        ? Asset.fromPartial(object.asset)
        : undefined;
    return message;
  },
};

function createBaseConfirmTokenResponse(): ConfirmTokenResponse {
  return {};
}

export const ConfirmTokenResponse = {
  encode(
    _: ConfirmTokenResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmTokenResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmTokenResponse();
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

  fromJSON(_: any): ConfirmTokenResponse {
    return {};
  },

  toJSON(_: ConfirmTokenResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmTokenResponse>, I>>(
    base?: I
  ): ConfirmTokenResponse {
    return ConfirmTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmTokenResponse>, I>>(
    _: I
  ): ConfirmTokenResponse {
    const message = createBaseConfirmTokenResponse();
    return message;
  },
};

function createBaseConfirmTransferKeyRequest(): ConfirmTransferKeyRequest {
  return { sender: new Uint8Array(0), chain: "", txId: new Uint8Array(0) };
}

export const ConfirmTransferKeyRequest = {
  encode(
    message: ConfirmTransferKeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(26).bytes(message.txId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmTransferKeyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmTransferKeyRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txId = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmTransferKeyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ConfirmTransferKeyRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmTransferKeyRequest>, I>>(
    base?: I
  ): ConfirmTransferKeyRequest {
    return ConfirmTransferKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmTransferKeyRequest>, I>>(
    object: I
  ): ConfirmTransferKeyRequest {
    const message = createBaseConfirmTransferKeyRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
    return message;
  },
};

function createBaseConfirmTransferKeyResponse(): ConfirmTransferKeyResponse {
  return {};
}

export const ConfirmTransferKeyResponse = {
  encode(
    _: ConfirmTransferKeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmTransferKeyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmTransferKeyResponse();
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

  fromJSON(_: any): ConfirmTransferKeyResponse {
    return {};
  },

  toJSON(_: ConfirmTransferKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmTransferKeyResponse>, I>>(
    base?: I
  ): ConfirmTransferKeyResponse {
    return ConfirmTransferKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConfirmTransferKeyResponse>, I>>(
    _: I
  ): ConfirmTransferKeyResponse {
    const message = createBaseConfirmTransferKeyResponse();
    return message;
  },
};

function createBaseLinkRequest(): LinkRequest {
  return {
    sender: new Uint8Array(0),
    chain: "",
    recipientAddr: "",
    asset: "",
    recipientChain: "",
  };
}

export const LinkRequest = {
  encode(
    message: LinkRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.recipientAddr !== "") {
      writer.uint32(26).string(message.recipientAddr);
    }
    if (message.asset !== "") {
      writer.uint32(34).string(message.asset);
    }
    if (message.recipientChain !== "") {
      writer.uint32(42).string(message.recipientChain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.recipientAddr = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.asset = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.recipientChain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LinkRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      recipientAddr: isSet(object.recipientAddr)
        ? globalThis.String(object.recipientAddr)
        : "",
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
      recipientChain: isSet(object.recipientChain)
        ? globalThis.String(object.recipientChain)
        : "",
    };
  },

  toJSON(message: LinkRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.recipientAddr !== "") {
      obj.recipientAddr = message.recipientAddr;
    }
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    if (message.recipientChain !== "") {
      obj.recipientChain = message.recipientChain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LinkRequest>, I>>(base?: I): LinkRequest {
    return LinkRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LinkRequest>, I>>(
    object: I
  ): LinkRequest {
    const message = createBaseLinkRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.recipientAddr = object.recipientAddr ?? "";
    message.asset = object.asset ?? "";
    message.recipientChain = object.recipientChain ?? "";
    return message;
  },
};

function createBaseLinkResponse(): LinkResponse {
  return { depositAddr: "" };
}

export const LinkResponse = {
  encode(
    message: LinkResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.depositAddr !== "") {
      writer.uint32(10).string(message.depositAddr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.depositAddr = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LinkResponse {
    return {
      depositAddr: isSet(object.depositAddr)
        ? globalThis.String(object.depositAddr)
        : "",
    };
  },

  toJSON(message: LinkResponse): unknown {
    const obj: any = {};
    if (message.depositAddr !== "") {
      obj.depositAddr = message.depositAddr;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LinkResponse>, I>>(
    base?: I
  ): LinkResponse {
    return LinkResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LinkResponse>, I>>(
    object: I
  ): LinkResponse {
    const message = createBaseLinkResponse();
    message.depositAddr = object.depositAddr ?? "";
    return message;
  },
};

function createBaseCreateBurnTokensRequest(): CreateBurnTokensRequest {
  return { sender: new Uint8Array(0), chain: "" };
}

export const CreateBurnTokensRequest = {
  encode(
    message: CreateBurnTokensRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateBurnTokensRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateBurnTokensRequest();
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

          message.chain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateBurnTokensRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: CreateBurnTokensRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateBurnTokensRequest>, I>>(
    base?: I
  ): CreateBurnTokensRequest {
    return CreateBurnTokensRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateBurnTokensRequest>, I>>(
    object: I
  ): CreateBurnTokensRequest {
    const message = createBaseCreateBurnTokensRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseCreateBurnTokensResponse(): CreateBurnTokensResponse {
  return {};
}

export const CreateBurnTokensResponse = {
  encode(
    _: CreateBurnTokensResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateBurnTokensResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateBurnTokensResponse();
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

  fromJSON(_: any): CreateBurnTokensResponse {
    return {};
  },

  toJSON(_: CreateBurnTokensResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateBurnTokensResponse>, I>>(
    base?: I
  ): CreateBurnTokensResponse {
    return CreateBurnTokensResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateBurnTokensResponse>, I>>(
    _: I
  ): CreateBurnTokensResponse {
    const message = createBaseCreateBurnTokensResponse();
    return message;
  },
};

function createBaseCreateDeployTokenRequest(): CreateDeployTokenRequest {
  return {
    sender: new Uint8Array(0),
    chain: "",
    asset: undefined,
    tokenDetails: undefined,
    address: new Uint8Array(0),
    dailyMintLimit: "",
  };
}

export const CreateDeployTokenRequest = {
  encode(
    message: CreateDeployTokenRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.asset !== undefined) {
      Asset.encode(message.asset, writer.uint32(26).fork()).ldelim();
    }
    if (message.tokenDetails !== undefined) {
      TokenDetails.encode(
        message.tokenDetails,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.address.length !== 0) {
      writer.uint32(50).bytes(message.address);
    }
    if (message.dailyMintLimit !== "") {
      writer.uint32(58).string(message.dailyMintLimit);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateDeployTokenRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateDeployTokenRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.asset = Asset.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenDetails = TokenDetails.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.dailyMintLimit = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateDeployTokenRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined,
      tokenDetails: isSet(object.tokenDetails)
        ? TokenDetails.fromJSON(object.tokenDetails)
        : undefined,
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(0),
      dailyMintLimit: isSet(object.dailyMintLimit)
        ? globalThis.String(object.dailyMintLimit)
        : "",
    };
  },

  toJSON(message: CreateDeployTokenRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    if (message.tokenDetails !== undefined) {
      obj.tokenDetails = TokenDetails.toJSON(message.tokenDetails);
    }
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    if (message.dailyMintLimit !== "") {
      obj.dailyMintLimit = message.dailyMintLimit;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateDeployTokenRequest>, I>>(
    base?: I
  ): CreateDeployTokenRequest {
    return CreateDeployTokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateDeployTokenRequest>, I>>(
    object: I
  ): CreateDeployTokenRequest {
    const message = createBaseCreateDeployTokenRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.asset =
      object.asset !== undefined && object.asset !== null
        ? Asset.fromPartial(object.asset)
        : undefined;
    message.tokenDetails =
      object.tokenDetails !== undefined && object.tokenDetails !== null
        ? TokenDetails.fromPartial(object.tokenDetails)
        : undefined;
    message.address = object.address ?? new Uint8Array(0);
    message.dailyMintLimit = object.dailyMintLimit ?? "";
    return message;
  },
};

function createBaseCreateDeployTokenResponse(): CreateDeployTokenResponse {
  return {};
}

export const CreateDeployTokenResponse = {
  encode(
    _: CreateDeployTokenResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateDeployTokenResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateDeployTokenResponse();
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

  fromJSON(_: any): CreateDeployTokenResponse {
    return {};
  },

  toJSON(_: CreateDeployTokenResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateDeployTokenResponse>, I>>(
    base?: I
  ): CreateDeployTokenResponse {
    return CreateDeployTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateDeployTokenResponse>, I>>(
    _: I
  ): CreateDeployTokenResponse {
    const message = createBaseCreateDeployTokenResponse();
    return message;
  },
};

function createBaseCreatePendingTransfersRequest(): CreatePendingTransfersRequest {
  return { sender: new Uint8Array(0), chain: "" };
}

export const CreatePendingTransfersRequest = {
  encode(
    message: CreatePendingTransfersRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreatePendingTransfersRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePendingTransfersRequest();
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

          message.chain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreatePendingTransfersRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: CreatePendingTransfersRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePendingTransfersRequest>, I>>(
    base?: I
  ): CreatePendingTransfersRequest {
    return CreatePendingTransfersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreatePendingTransfersRequest>, I>>(
    object: I
  ): CreatePendingTransfersRequest {
    const message = createBaseCreatePendingTransfersRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseCreatePendingTransfersResponse(): CreatePendingTransfersResponse {
  return {};
}

export const CreatePendingTransfersResponse = {
  encode(
    _: CreatePendingTransfersResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreatePendingTransfersResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePendingTransfersResponse();
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

  fromJSON(_: any): CreatePendingTransfersResponse {
    return {};
  },

  toJSON(_: CreatePendingTransfersResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePendingTransfersResponse>, I>>(
    base?: I
  ): CreatePendingTransfersResponse {
    return CreatePendingTransfersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreatePendingTransfersResponse>, I>>(
    _: I
  ): CreatePendingTransfersResponse {
    const message = createBaseCreatePendingTransfersResponse();
    return message;
  },
};

function createBaseCreateTransferOwnershipRequest(): CreateTransferOwnershipRequest {
  return { sender: new Uint8Array(0), chain: "", keyId: "" };
}

export const CreateTransferOwnershipRequest = {
  encode(
    message: CreateTransferOwnershipRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.keyId !== "") {
      writer.uint32(26).string(message.keyId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateTransferOwnershipRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransferOwnershipRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keyId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateTransferOwnershipRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
    };
  },

  toJSON(message: CreateTransferOwnershipRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransferOwnershipRequest>, I>>(
    base?: I
  ): CreateTransferOwnershipRequest {
    return CreateTransferOwnershipRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateTransferOwnershipRequest>, I>>(
    object: I
  ): CreateTransferOwnershipRequest {
    const message = createBaseCreateTransferOwnershipRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseCreateTransferOwnershipResponse(): CreateTransferOwnershipResponse {
  return {};
}

export const CreateTransferOwnershipResponse = {
  encode(
    _: CreateTransferOwnershipResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateTransferOwnershipResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransferOwnershipResponse();
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

  fromJSON(_: any): CreateTransferOwnershipResponse {
    return {};
  },

  toJSON(_: CreateTransferOwnershipResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransferOwnershipResponse>, I>>(
    base?: I
  ): CreateTransferOwnershipResponse {
    return CreateTransferOwnershipResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateTransferOwnershipResponse>, I>>(
    _: I
  ): CreateTransferOwnershipResponse {
    const message = createBaseCreateTransferOwnershipResponse();
    return message;
  },
};

function createBaseCreateTransferOperatorshipRequest(): CreateTransferOperatorshipRequest {
  return { sender: new Uint8Array(0), chain: "", keyId: "" };
}

export const CreateTransferOperatorshipRequest = {
  encode(
    message: CreateTransferOperatorshipRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.keyId !== "") {
      writer.uint32(26).string(message.keyId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateTransferOperatorshipRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransferOperatorshipRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keyId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateTransferOperatorshipRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
    };
  },

  toJSON(message: CreateTransferOperatorshipRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransferOperatorshipRequest>, I>>(
    base?: I
  ): CreateTransferOperatorshipRequest {
    return CreateTransferOperatorshipRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<CreateTransferOperatorshipRequest>, I>
  >(object: I): CreateTransferOperatorshipRequest {
    const message = createBaseCreateTransferOperatorshipRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseCreateTransferOperatorshipResponse(): CreateTransferOperatorshipResponse {
  return {};
}

export const CreateTransferOperatorshipResponse = {
  encode(
    _: CreateTransferOperatorshipResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateTransferOperatorshipResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransferOperatorshipResponse();
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

  fromJSON(_: any): CreateTransferOperatorshipResponse {
    return {};
  },

  toJSON(_: CreateTransferOperatorshipResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransferOperatorshipResponse>, I>>(
    base?: I
  ): CreateTransferOperatorshipResponse {
    return CreateTransferOperatorshipResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<CreateTransferOperatorshipResponse>, I>
  >(_: I): CreateTransferOperatorshipResponse {
    const message = createBaseCreateTransferOperatorshipResponse();
    return message;
  },
};

function createBaseSignCommandsRequest(): SignCommandsRequest {
  return { sender: new Uint8Array(0), chain: "" };
}

export const SignCommandsRequest = {
  encode(
    message: SignCommandsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignCommandsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignCommandsRequest();
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

          message.chain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SignCommandsRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: SignCommandsRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SignCommandsRequest>, I>>(
    base?: I
  ): SignCommandsRequest {
    return SignCommandsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignCommandsRequest>, I>>(
    object: I
  ): SignCommandsRequest {
    const message = createBaseSignCommandsRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseSignCommandsResponse(): SignCommandsResponse {
  return { batchedCommandsId: new Uint8Array(0), commandCount: 0 };
}

export const SignCommandsResponse = {
  encode(
    message: SignCommandsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.batchedCommandsId.length !== 0) {
      writer.uint32(10).bytes(message.batchedCommandsId);
    }
    if (message.commandCount !== 0) {
      writer.uint32(16).uint32(message.commandCount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SignCommandsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignCommandsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.batchedCommandsId = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.commandCount = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SignCommandsResponse {
    return {
      batchedCommandsId: isSet(object.batchedCommandsId)
        ? bytesFromBase64(object.batchedCommandsId)
        : new Uint8Array(0),
      commandCount: isSet(object.commandCount)
        ? globalThis.Number(object.commandCount)
        : 0,
    };
  },

  toJSON(message: SignCommandsResponse): unknown {
    const obj: any = {};
    if (message.batchedCommandsId.length !== 0) {
      obj.batchedCommandsId = base64FromBytes(message.batchedCommandsId);
    }
    if (message.commandCount !== 0) {
      obj.commandCount = Math.round(message.commandCount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SignCommandsResponse>, I>>(
    base?: I
  ): SignCommandsResponse {
    return SignCommandsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignCommandsResponse>, I>>(
    object: I
  ): SignCommandsResponse {
    const message = createBaseSignCommandsResponse();
    message.batchedCommandsId = object.batchedCommandsId ?? new Uint8Array(0);
    message.commandCount = object.commandCount ?? 0;
    return message;
  },
};

function createBaseAddChainRequest(): AddChainRequest {
  return {
    sender: new Uint8Array(0),
    name: "",
    keyType: 0,
    params: new Uint8Array(0),
  };
}

export const AddChainRequest = {
  encode(
    message: AddChainRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.keyType !== 0) {
      writer.uint32(32).int32(message.keyType);
    }
    if (message.params.length !== 0) {
      writer.uint32(42).bytes(message.params);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddChainRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddChainRequest();
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

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.keyType = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.params = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddChainRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      keyType: isSet(object.keyType) ? keyTypeFromJSON(object.keyType) : 0,
      params: isSet(object.params)
        ? bytesFromBase64(object.params)
        : new Uint8Array(0),
    };
  },

  toJSON(message: AddChainRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.keyType !== 0) {
      obj.keyType = keyTypeToJSON(message.keyType);
    }
    if (message.params.length !== 0) {
      obj.params = base64FromBytes(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddChainRequest>, I>>(
    base?: I
  ): AddChainRequest {
    return AddChainRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddChainRequest>, I>>(
    object: I
  ): AddChainRequest {
    const message = createBaseAddChainRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.name = object.name ?? "";
    message.keyType = object.keyType ?? 0;
    message.params = object.params ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAddChainResponse(): AddChainResponse {
  return {};
}

export const AddChainResponse = {
  encode(
    _: AddChainResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddChainResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddChainResponse();
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

  fromJSON(_: any): AddChainResponse {
    return {};
  },

  toJSON(_: AddChainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AddChainResponse>, I>>(
    base?: I
  ): AddChainResponse {
    return AddChainResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddChainResponse>, I>>(
    _: I
  ): AddChainResponse {
    const message = createBaseAddChainResponse();
    return message;
  },
};

function createBaseRetryFailedEventRequest(): RetryFailedEventRequest {
  return { sender: new Uint8Array(0), chain: "", eventId: "" };
}

export const RetryFailedEventRequest = {
  encode(
    message: RetryFailedEventRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(26).string(message.eventId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RetryFailedEventRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetryFailedEventRequest();
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

          message.chain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.eventId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetryFailedEventRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      eventId: isSet(object.eventId) ? globalThis.String(object.eventId) : "",
    };
  },

  toJSON(message: RetryFailedEventRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.eventId !== "") {
      obj.eventId = message.eventId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RetryFailedEventRequest>, I>>(
    base?: I
  ): RetryFailedEventRequest {
    return RetryFailedEventRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RetryFailedEventRequest>, I>>(
    object: I
  ): RetryFailedEventRequest {
    const message = createBaseRetryFailedEventRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    return message;
  },
};

function createBaseRetryFailedEventResponse(): RetryFailedEventResponse {
  return {};
}

export const RetryFailedEventResponse = {
  encode(
    _: RetryFailedEventResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RetryFailedEventResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetryFailedEventResponse();
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

  fromJSON(_: any): RetryFailedEventResponse {
    return {};
  },

  toJSON(_: RetryFailedEventResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RetryFailedEventResponse>, I>>(
    base?: I
  ): RetryFailedEventResponse {
    return RetryFailedEventResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RetryFailedEventResponse>, I>>(
    _: I
  ): RetryFailedEventResponse {
    const message = createBaseRetryFailedEventResponse();
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
