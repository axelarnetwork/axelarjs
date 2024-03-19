/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import {
  PageRequest,
  PageResponse,
} from "../../../cosmos/base/query/v1beta1/pagination";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
import {
  CrossChainTransfer,
  FeeInfo,
  GeneralMessage,
  TransferState,
  transferStateFromJSON,
  transferStateToJSON,
} from "../exported/v1beta1/types";
import { Params } from "./params";
import { ChainState } from "./types";

export const protobufPackage = "axelar.nexus.v1beta1";

export enum ChainStatus {
  CHAIN_STATUS_UNSPECIFIED = 0,
  CHAIN_STATUS_ACTIVATED = 1,
  CHAIN_STATUS_DEACTIVATED = 2,
  UNRECOGNIZED = -1,
}

export function chainStatusFromJSON(object: any): ChainStatus {
  switch (object) {
    case 0:
    case "CHAIN_STATUS_UNSPECIFIED":
      return ChainStatus.CHAIN_STATUS_UNSPECIFIED;
    case 1:
    case "CHAIN_STATUS_ACTIVATED":
      return ChainStatus.CHAIN_STATUS_ACTIVATED;
    case 2:
    case "CHAIN_STATUS_DEACTIVATED":
      return ChainStatus.CHAIN_STATUS_DEACTIVATED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChainStatus.UNRECOGNIZED;
  }
}

export function chainStatusToJSON(object: ChainStatus): string {
  switch (object) {
    case ChainStatus.CHAIN_STATUS_UNSPECIFIED:
      return "CHAIN_STATUS_UNSPECIFIED";
    case ChainStatus.CHAIN_STATUS_ACTIVATED:
      return "CHAIN_STATUS_ACTIVATED";
    case ChainStatus.CHAIN_STATUS_DEACTIVATED:
      return "CHAIN_STATUS_DEACTIVATED";
    case ChainStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * ChainMaintainersRequest represents a message that queries
 * the chain maintainers for the specified chain
 */
export interface ChainMaintainersRequest {
  chain: string;
}

export interface ChainMaintainersResponse {
  maintainers: Uint8Array[];
}

/**
 * LatestDepositAddressRequest represents a message that queries a deposit
 * address by recipient address
 */
export interface LatestDepositAddressRequest {
  recipientAddr: string;
  recipientChain: string;
  depositChain: string;
}

export interface LatestDepositAddressResponse {
  depositAddr: string;
}

/**
 * TransfersForChainRequest represents a message that queries the
 * transfers for the specified chain
 */
export interface TransfersForChainRequest {
  chain: string;
  state: TransferState;
  pagination?: PageRequest | undefined;
}

export interface TransfersForChainResponse {
  transfers: CrossChainTransfer[];
  pagination?: PageResponse | undefined;
}

/**
 * FeeInfoRequest represents a message that queries the transfer fees associated
 * to an asset on a chain
 */
export interface FeeInfoRequest {
  chain: string;
  asset: string;
}

export interface FeeInfoResponse {
  feeInfo?: FeeInfo | undefined;
}

/**
 * TransferFeeRequest represents a message that queries the fees charged by
 * the network for a cross-chain transfer
 */
export interface TransferFeeRequest {
  sourceChain: string;
  destinationChain: string;
  amount: string;
}

export interface TransferFeeResponse {
  fee?: Coin | undefined;
}

/**
 * ChainsRequest represents a message that queries the chains
 * registered on the network
 */
export interface ChainsRequest {
  status: ChainStatus;
}

export interface ChainsResponse {
  chains: string[];
}

/**
 * AssetsRequest represents a message that queries the registered assets of a
 * chain
 */
export interface AssetsRequest {
  chain: string;
}

export interface AssetsResponse {
  assets: string[];
}

/**
 * ChainStateRequest represents a message that queries the state of a chain
 * registered on the network
 */
export interface ChainStateRequest {
  chain: string;
}

export interface ChainStateResponse {
  state?: ChainState | undefined;
}

/**
 * ChainsByAssetRequest represents a message that queries the chains
 * that support an asset on the network
 */
export interface ChainsByAssetRequest {
  asset: string;
}

export interface ChainsByAssetResponse {
  chains: string[];
}

/**
 * RecipientAddressRequest represents a message that queries the registered
 * recipient address for a given deposit address
 */
export interface RecipientAddressRequest {
  depositAddr: string;
  depositChain: string;
}

export interface RecipientAddressResponse {
  recipientAddr: string;
  recipientChain: string;
}

/**
 * TransferRateLimitRequest represents a message that queries the registered
 * transfer rate limit and current transfer amounts for a given chain and asset
 */
export interface TransferRateLimitRequest {
  chain: string;
  asset: string;
}

export interface TransferRateLimitResponse {
  transferRateLimit?: TransferRateLimit | undefined;
}

export interface TransferRateLimit {
  limit: Uint8Array;
  window?: Duration | undefined;
  /** @deprecated */
  incoming: Uint8Array;
  /** @deprecated */
  outgoing: Uint8Array;
  /** time_left indicates the time left in the rate limit window */
  timeLeft?: Duration | undefined;
  from: Uint8Array;
  to: Uint8Array;
}

export interface MessageRequest {
  id: string;
}

export interface MessageResponse {
  message?: GeneralMessage | undefined;
}

/** ParamsRequest represents a message that queries the params */
export interface ParamsRequest {}

export interface ParamsResponse {
  params?: Params | undefined;
}

function createBaseChainMaintainersRequest(): ChainMaintainersRequest {
  return { chain: "" };
}

export const ChainMaintainersRequest = {
  encode(
    message: ChainMaintainersRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ChainMaintainersRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainMaintainersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): ChainMaintainersRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: ChainMaintainersRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainMaintainersRequest>, I>>(
    base?: I
  ): ChainMaintainersRequest {
    return ChainMaintainersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainMaintainersRequest>, I>>(
    object: I
  ): ChainMaintainersRequest {
    const message = createBaseChainMaintainersRequest();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseChainMaintainersResponse(): ChainMaintainersResponse {
  return { maintainers: [] };
}

export const ChainMaintainersResponse = {
  encode(
    message: ChainMaintainersResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.maintainers) {
      writer.uint32(10).bytes(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ChainMaintainersResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainMaintainersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.maintainers.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainMaintainersResponse {
    return {
      maintainers: globalThis.Array.isArray(object?.maintainers)
        ? object.maintainers.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: ChainMaintainersResponse): unknown {
    const obj: any = {};
    if (message.maintainers?.length) {
      obj.maintainers = message.maintainers.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainMaintainersResponse>, I>>(
    base?: I
  ): ChainMaintainersResponse {
    return ChainMaintainersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainMaintainersResponse>, I>>(
    object: I
  ): ChainMaintainersResponse {
    const message = createBaseChainMaintainersResponse();
    message.maintainers = object.maintainers?.map((e) => e) || [];
    return message;
  },
};

function createBaseLatestDepositAddressRequest(): LatestDepositAddressRequest {
  return { recipientAddr: "", recipientChain: "", depositChain: "" };
}

export const LatestDepositAddressRequest = {
  encode(
    message: LatestDepositAddressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recipientAddr !== "") {
      writer.uint32(10).string(message.recipientAddr);
    }
    if (message.recipientChain !== "") {
      writer.uint32(18).string(message.recipientChain);
    }
    if (message.depositChain !== "") {
      writer.uint32(26).string(message.depositChain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): LatestDepositAddressRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLatestDepositAddressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.recipientAddr = reader.string();
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

          message.depositChain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LatestDepositAddressRequest {
    return {
      recipientAddr: isSet(object.recipientAddr)
        ? globalThis.String(object.recipientAddr)
        : "",
      recipientChain: isSet(object.recipientChain)
        ? globalThis.String(object.recipientChain)
        : "",
      depositChain: isSet(object.depositChain)
        ? globalThis.String(object.depositChain)
        : "",
    };
  },

  toJSON(message: LatestDepositAddressRequest): unknown {
    const obj: any = {};
    if (message.recipientAddr !== "") {
      obj.recipientAddr = message.recipientAddr;
    }
    if (message.recipientChain !== "") {
      obj.recipientChain = message.recipientChain;
    }
    if (message.depositChain !== "") {
      obj.depositChain = message.depositChain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LatestDepositAddressRequest>, I>>(
    base?: I
  ): LatestDepositAddressRequest {
    return LatestDepositAddressRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LatestDepositAddressRequest>, I>>(
    object: I
  ): LatestDepositAddressRequest {
    const message = createBaseLatestDepositAddressRequest();
    message.recipientAddr = object.recipientAddr ?? "";
    message.recipientChain = object.recipientChain ?? "";
    message.depositChain = object.depositChain ?? "";
    return message;
  },
};

function createBaseLatestDepositAddressResponse(): LatestDepositAddressResponse {
  return { depositAddr: "" };
}

export const LatestDepositAddressResponse = {
  encode(
    message: LatestDepositAddressResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.depositAddr !== "") {
      writer.uint32(10).string(message.depositAddr);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): LatestDepositAddressResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLatestDepositAddressResponse();
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

  fromJSON(object: any): LatestDepositAddressResponse {
    return {
      depositAddr: isSet(object.depositAddr)
        ? globalThis.String(object.depositAddr)
        : "",
    };
  },

  toJSON(message: LatestDepositAddressResponse): unknown {
    const obj: any = {};
    if (message.depositAddr !== "") {
      obj.depositAddr = message.depositAddr;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LatestDepositAddressResponse>, I>>(
    base?: I
  ): LatestDepositAddressResponse {
    return LatestDepositAddressResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LatestDepositAddressResponse>, I>>(
    object: I
  ): LatestDepositAddressResponse {
    const message = createBaseLatestDepositAddressResponse();
    message.depositAddr = object.depositAddr ?? "";
    return message;
  },
};

function createBaseTransfersForChainRequest(): TransfersForChainRequest {
  return { chain: "", state: 0, pagination: undefined };
}

export const TransfersForChainRequest = {
  encode(
    message: TransfersForChainRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.state !== 0) {
      writer.uint32(16).int32(message.state);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TransfersForChainRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransfersForChainRequest();
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
          if (tag !== 16) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransfersForChainRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      state: isSet(object.state) ? transferStateFromJSON(object.state) : 0,
      pagination: isSet(object.pagination)
        ? PageRequest.fromJSON(object.pagination)
        : undefined,
    };
  },

  toJSON(message: TransfersForChainRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.state !== 0) {
      obj.state = transferStateToJSON(message.state);
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransfersForChainRequest>, I>>(
    base?: I
  ): TransfersForChainRequest {
    return TransfersForChainRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransfersForChainRequest>, I>>(
    object: I
  ): TransfersForChainRequest {
    const message = createBaseTransfersForChainRequest();
    message.chain = object.chain ?? "";
    message.state = object.state ?? 0;
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseTransfersForChainResponse(): TransfersForChainResponse {
  return { transfers: [], pagination: undefined };
}

export const TransfersForChainResponse = {
  encode(
    message: TransfersForChainResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.transfers) {
      CrossChainTransfer.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TransfersForChainResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransfersForChainResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.transfers.push(
            CrossChainTransfer.decode(reader, reader.uint32())
          );
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransfersForChainResponse {
    return {
      transfers: globalThis.Array.isArray(object?.transfers)
        ? object.transfers.map((e: any) => CrossChainTransfer.fromJSON(e))
        : [],
      pagination: isSet(object.pagination)
        ? PageResponse.fromJSON(object.pagination)
        : undefined,
    };
  },

  toJSON(message: TransfersForChainResponse): unknown {
    const obj: any = {};
    if (message.transfers?.length) {
      obj.transfers = message.transfers.map((e) =>
        CrossChainTransfer.toJSON(e)
      );
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransfersForChainResponse>, I>>(
    base?: I
  ): TransfersForChainResponse {
    return TransfersForChainResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransfersForChainResponse>, I>>(
    object: I
  ): TransfersForChainResponse {
    const message = createBaseTransfersForChainResponse();
    message.transfers =
      object.transfers?.map((e) => CrossChainTransfer.fromPartial(e)) || [];
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageResponse.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseFeeInfoRequest(): FeeInfoRequest {
  return { chain: "", asset: "" };
}

export const FeeInfoRequest = {
  encode(
    message: FeeInfoRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.asset !== "") {
      writer.uint32(18).string(message.asset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeInfoRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeInfoRequest();
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

          message.asset = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeeInfoRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
    };
  },

  toJSON(message: FeeInfoRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeeInfoRequest>, I>>(
    base?: I
  ): FeeInfoRequest {
    return FeeInfoRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeeInfoRequest>, I>>(
    object: I
  ): FeeInfoRequest {
    const message = createBaseFeeInfoRequest();
    message.chain = object.chain ?? "";
    message.asset = object.asset ?? "";
    return message;
  },
};

function createBaseFeeInfoResponse(): FeeInfoResponse {
  return { feeInfo: undefined };
}

export const FeeInfoResponse = {
  encode(
    message: FeeInfoResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.feeInfo !== undefined) {
      FeeInfo.encode(message.feeInfo, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeInfoResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feeInfo = FeeInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeeInfoResponse {
    return {
      feeInfo: isSet(object.feeInfo)
        ? FeeInfo.fromJSON(object.feeInfo)
        : undefined,
    };
  },

  toJSON(message: FeeInfoResponse): unknown {
    const obj: any = {};
    if (message.feeInfo !== undefined) {
      obj.feeInfo = FeeInfo.toJSON(message.feeInfo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeeInfoResponse>, I>>(
    base?: I
  ): FeeInfoResponse {
    return FeeInfoResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeeInfoResponse>, I>>(
    object: I
  ): FeeInfoResponse {
    const message = createBaseFeeInfoResponse();
    message.feeInfo =
      object.feeInfo !== undefined && object.feeInfo !== null
        ? FeeInfo.fromPartial(object.feeInfo)
        : undefined;
    return message;
  },
};

function createBaseTransferFeeRequest(): TransferFeeRequest {
  return { sourceChain: "", destinationChain: "", amount: "" };
}

export const TransferFeeRequest = {
  encode(
    message: TransferFeeRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sourceChain !== "") {
      writer.uint32(10).string(message.sourceChain);
    }
    if (message.destinationChain !== "") {
      writer.uint32(18).string(message.destinationChain);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferFeeRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferFeeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sourceChain = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.destinationChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.amount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferFeeRequest {
    return {
      sourceChain: isSet(object.sourceChain)
        ? globalThis.String(object.sourceChain)
        : "",
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
    };
  },

  toJSON(message: TransferFeeRequest): unknown {
    const obj: any = {};
    if (message.sourceChain !== "") {
      obj.sourceChain = message.sourceChain;
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferFeeRequest>, I>>(
    base?: I
  ): TransferFeeRequest {
    return TransferFeeRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferFeeRequest>, I>>(
    object: I
  ): TransferFeeRequest {
    const message = createBaseTransferFeeRequest();
    message.sourceChain = object.sourceChain ?? "";
    message.destinationChain = object.destinationChain ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseTransferFeeResponse(): TransferFeeResponse {
  return { fee: undefined };
}

export const TransferFeeResponse = {
  encode(
    message: TransferFeeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.fee !== undefined) {
      Coin.encode(message.fee, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferFeeResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): TransferFeeResponse {
    return { fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined };
  },

  toJSON(message: TransferFeeResponse): unknown {
    const obj: any = {};
    if (message.fee !== undefined) {
      obj.fee = Coin.toJSON(message.fee);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferFeeResponse>, I>>(
    base?: I
  ): TransferFeeResponse {
    return TransferFeeResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferFeeResponse>, I>>(
    object: I
  ): TransferFeeResponse {
    const message = createBaseTransferFeeResponse();
    message.fee =
      object.fee !== undefined && object.fee !== null
        ? Coin.fromPartial(object.fee)
        : undefined;
    return message;
  },
};

function createBaseChainsRequest(): ChainsRequest {
  return { status: 0 };
}

export const ChainsRequest = {
  encode(
    message: ChainsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainsRequest {
    return {
      status: isSet(object.status) ? chainStatusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: ChainsRequest): unknown {
    const obj: any = {};
    if (message.status !== 0) {
      obj.status = chainStatusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainsRequest>, I>>(
    base?: I
  ): ChainsRequest {
    return ChainsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainsRequest>, I>>(
    object: I
  ): ChainsRequest {
    const message = createBaseChainsRequest();
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseChainsResponse(): ChainsResponse {
  return { chains: [] };
}

export const ChainsResponse = {
  encode(
    message: ChainsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.chains) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainsResponse {
    return {
      chains: globalThis.Array.isArray(object?.chains)
        ? object.chains.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ChainsResponse): unknown {
    const obj: any = {};
    if (message.chains?.length) {
      obj.chains = message.chains;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainsResponse>, I>>(
    base?: I
  ): ChainsResponse {
    return ChainsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainsResponse>, I>>(
    object: I
  ): ChainsResponse {
    const message = createBaseChainsResponse();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseAssetsRequest(): AssetsRequest {
  return { chain: "" };
}

export const AssetsRequest = {
  encode(
    message: AssetsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): AssetsRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: AssetsRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AssetsRequest>, I>>(
    base?: I
  ): AssetsRequest {
    return AssetsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AssetsRequest>, I>>(
    object: I
  ): AssetsRequest {
    const message = createBaseAssetsRequest();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseAssetsResponse(): AssetsResponse {
  return { assets: [] };
}

export const AssetsResponse = {
  encode(
    message: AssetsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.assets) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssetsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.assets.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AssetsResponse {
    return {
      assets: globalThis.Array.isArray(object?.assets)
        ? object.assets.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: AssetsResponse): unknown {
    const obj: any = {};
    if (message.assets?.length) {
      obj.assets = message.assets;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AssetsResponse>, I>>(
    base?: I
  ): AssetsResponse {
    return AssetsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AssetsResponse>, I>>(
    object: I
  ): AssetsResponse {
    const message = createBaseAssetsResponse();
    message.assets = object.assets?.map((e) => e) || [];
    return message;
  },
};

function createBaseChainStateRequest(): ChainStateRequest {
  return { chain: "" };
}

export const ChainStateRequest = {
  encode(
    message: ChainStateRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainStateRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainStateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): ChainStateRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: ChainStateRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainStateRequest>, I>>(
    base?: I
  ): ChainStateRequest {
    return ChainStateRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainStateRequest>, I>>(
    object: I
  ): ChainStateRequest {
    const message = createBaseChainStateRequest();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseChainStateResponse(): ChainStateResponse {
  return { state: undefined };
}

export const ChainStateResponse = {
  encode(
    message: ChainStateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.state !== undefined) {
      ChainState.encode(message.state, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainStateResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainStateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.state = ChainState.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainStateResponse {
    return {
      state: isSet(object.state)
        ? ChainState.fromJSON(object.state)
        : undefined,
    };
  },

  toJSON(message: ChainStateResponse): unknown {
    const obj: any = {};
    if (message.state !== undefined) {
      obj.state = ChainState.toJSON(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainStateResponse>, I>>(
    base?: I
  ): ChainStateResponse {
    return ChainStateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainStateResponse>, I>>(
    object: I
  ): ChainStateResponse {
    const message = createBaseChainStateResponse();
    message.state =
      object.state !== undefined && object.state !== null
        ? ChainState.fromPartial(object.state)
        : undefined;
    return message;
  },
};

function createBaseChainsByAssetRequest(): ChainsByAssetRequest {
  return { asset: "" };
}

export const ChainsByAssetRequest = {
  encode(
    message: ChainsByAssetRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.asset !== "") {
      writer.uint32(10).string(message.asset);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ChainsByAssetRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainsByAssetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.asset = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainsByAssetRequest {
    return {
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
    };
  },

  toJSON(message: ChainsByAssetRequest): unknown {
    const obj: any = {};
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainsByAssetRequest>, I>>(
    base?: I
  ): ChainsByAssetRequest {
    return ChainsByAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainsByAssetRequest>, I>>(
    object: I
  ): ChainsByAssetRequest {
    const message = createBaseChainsByAssetRequest();
    message.asset = object.asset ?? "";
    return message;
  },
};

function createBaseChainsByAssetResponse(): ChainsByAssetResponse {
  return { chains: [] };
}

export const ChainsByAssetResponse = {
  encode(
    message: ChainsByAssetResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.chains) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ChainsByAssetResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainsByAssetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chains.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChainsByAssetResponse {
    return {
      chains: globalThis.Array.isArray(object?.chains)
        ? object.chains.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ChainsByAssetResponse): unknown {
    const obj: any = {};
    if (message.chains?.length) {
      obj.chains = message.chains;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainsByAssetResponse>, I>>(
    base?: I
  ): ChainsByAssetResponse {
    return ChainsByAssetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainsByAssetResponse>, I>>(
    object: I
  ): ChainsByAssetResponse {
    const message = createBaseChainsByAssetResponse();
    message.chains = object.chains?.map((e) => e) || [];
    return message;
  },
};

function createBaseRecipientAddressRequest(): RecipientAddressRequest {
  return { depositAddr: "", depositChain: "" };
}

export const RecipientAddressRequest = {
  encode(
    message: RecipientAddressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.depositAddr !== "") {
      writer.uint32(10).string(message.depositAddr);
    }
    if (message.depositChain !== "") {
      writer.uint32(18).string(message.depositChain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RecipientAddressRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecipientAddressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.depositAddr = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.depositChain = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RecipientAddressRequest {
    return {
      depositAddr: isSet(object.depositAddr)
        ? globalThis.String(object.depositAddr)
        : "",
      depositChain: isSet(object.depositChain)
        ? globalThis.String(object.depositChain)
        : "",
    };
  },

  toJSON(message: RecipientAddressRequest): unknown {
    const obj: any = {};
    if (message.depositAddr !== "") {
      obj.depositAddr = message.depositAddr;
    }
    if (message.depositChain !== "") {
      obj.depositChain = message.depositChain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RecipientAddressRequest>, I>>(
    base?: I
  ): RecipientAddressRequest {
    return RecipientAddressRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RecipientAddressRequest>, I>>(
    object: I
  ): RecipientAddressRequest {
    const message = createBaseRecipientAddressRequest();
    message.depositAddr = object.depositAddr ?? "";
    message.depositChain = object.depositChain ?? "";
    return message;
  },
};

function createBaseRecipientAddressResponse(): RecipientAddressResponse {
  return { recipientAddr: "", recipientChain: "" };
}

export const RecipientAddressResponse = {
  encode(
    message: RecipientAddressResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recipientAddr !== "") {
      writer.uint32(10).string(message.recipientAddr);
    }
    if (message.recipientChain !== "") {
      writer.uint32(18).string(message.recipientChain);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RecipientAddressResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecipientAddressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.recipientAddr = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): RecipientAddressResponse {
    return {
      recipientAddr: isSet(object.recipientAddr)
        ? globalThis.String(object.recipientAddr)
        : "",
      recipientChain: isSet(object.recipientChain)
        ? globalThis.String(object.recipientChain)
        : "",
    };
  },

  toJSON(message: RecipientAddressResponse): unknown {
    const obj: any = {};
    if (message.recipientAddr !== "") {
      obj.recipientAddr = message.recipientAddr;
    }
    if (message.recipientChain !== "") {
      obj.recipientChain = message.recipientChain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RecipientAddressResponse>, I>>(
    base?: I
  ): RecipientAddressResponse {
    return RecipientAddressResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RecipientAddressResponse>, I>>(
    object: I
  ): RecipientAddressResponse {
    const message = createBaseRecipientAddressResponse();
    message.recipientAddr = object.recipientAddr ?? "";
    message.recipientChain = object.recipientChain ?? "";
    return message;
  },
};

function createBaseTransferRateLimitRequest(): TransferRateLimitRequest {
  return { chain: "", asset: "" };
}

export const TransferRateLimitRequest = {
  encode(
    message: TransferRateLimitRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.asset !== "") {
      writer.uint32(18).string(message.asset);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TransferRateLimitRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferRateLimitRequest();
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

          message.asset = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferRateLimitRequest {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
    };
  },

  toJSON(message: TransferRateLimitRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferRateLimitRequest>, I>>(
    base?: I
  ): TransferRateLimitRequest {
    return TransferRateLimitRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferRateLimitRequest>, I>>(
    object: I
  ): TransferRateLimitRequest {
    const message = createBaseTransferRateLimitRequest();
    message.chain = object.chain ?? "";
    message.asset = object.asset ?? "";
    return message;
  },
};

function createBaseTransferRateLimitResponse(): TransferRateLimitResponse {
  return { transferRateLimit: undefined };
}

export const TransferRateLimitResponse = {
  encode(
    message: TransferRateLimitResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.transferRateLimit !== undefined) {
      TransferRateLimit.encode(
        message.transferRateLimit,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TransferRateLimitResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferRateLimitResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.transferRateLimit = TransferRateLimit.decode(
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

  fromJSON(object: any): TransferRateLimitResponse {
    return {
      transferRateLimit: isSet(object.transferRateLimit)
        ? TransferRateLimit.fromJSON(object.transferRateLimit)
        : undefined,
    };
  },

  toJSON(message: TransferRateLimitResponse): unknown {
    const obj: any = {};
    if (message.transferRateLimit !== undefined) {
      obj.transferRateLimit = TransferRateLimit.toJSON(
        message.transferRateLimit
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferRateLimitResponse>, I>>(
    base?: I
  ): TransferRateLimitResponse {
    return TransferRateLimitResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferRateLimitResponse>, I>>(
    object: I
  ): TransferRateLimitResponse {
    const message = createBaseTransferRateLimitResponse();
    message.transferRateLimit =
      object.transferRateLimit !== undefined &&
      object.transferRateLimit !== null
        ? TransferRateLimit.fromPartial(object.transferRateLimit)
        : undefined;
    return message;
  },
};

function createBaseTransferRateLimit(): TransferRateLimit {
  return {
    limit: new Uint8Array(0),
    window: undefined,
    incoming: new Uint8Array(0),
    outgoing: new Uint8Array(0),
    timeLeft: undefined,
    from: new Uint8Array(0),
    to: new Uint8Array(0),
  };
}

export const TransferRateLimit = {
  encode(
    message: TransferRateLimit,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.limit.length !== 0) {
      writer.uint32(10).bytes(message.limit);
    }
    if (message.window !== undefined) {
      Duration.encode(message.window, writer.uint32(18).fork()).ldelim();
    }
    if (message.incoming.length !== 0) {
      writer.uint32(26).bytes(message.incoming);
    }
    if (message.outgoing.length !== 0) {
      writer.uint32(34).bytes(message.outgoing);
    }
    if (message.timeLeft !== undefined) {
      Duration.encode(message.timeLeft, writer.uint32(42).fork()).ldelim();
    }
    if (message.from.length !== 0) {
      writer.uint32(50).bytes(message.from);
    }
    if (message.to.length !== 0) {
      writer.uint32(58).bytes(message.to);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferRateLimit {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferRateLimit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.limit = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.window = Duration.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.incoming = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.outgoing = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.timeLeft = Duration.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.from = reader.bytes();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.to = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferRateLimit {
    return {
      limit: isSet(object.limit)
        ? bytesFromBase64(object.limit)
        : new Uint8Array(0),
      window: isSet(object.window)
        ? Duration.fromJSON(object.window)
        : undefined,
      incoming: isSet(object.incoming)
        ? bytesFromBase64(object.incoming)
        : new Uint8Array(0),
      outgoing: isSet(object.outgoing)
        ? bytesFromBase64(object.outgoing)
        : new Uint8Array(0),
      timeLeft: isSet(object.timeLeft)
        ? Duration.fromJSON(object.timeLeft)
        : undefined,
      from: isSet(object.from)
        ? bytesFromBase64(object.from)
        : new Uint8Array(0),
      to: isSet(object.to) ? bytesFromBase64(object.to) : new Uint8Array(0),
    };
  },

  toJSON(message: TransferRateLimit): unknown {
    const obj: any = {};
    if (message.limit.length !== 0) {
      obj.limit = base64FromBytes(message.limit);
    }
    if (message.window !== undefined) {
      obj.window = Duration.toJSON(message.window);
    }
    if (message.incoming.length !== 0) {
      obj.incoming = base64FromBytes(message.incoming);
    }
    if (message.outgoing.length !== 0) {
      obj.outgoing = base64FromBytes(message.outgoing);
    }
    if (message.timeLeft !== undefined) {
      obj.timeLeft = Duration.toJSON(message.timeLeft);
    }
    if (message.from.length !== 0) {
      obj.from = base64FromBytes(message.from);
    }
    if (message.to.length !== 0) {
      obj.to = base64FromBytes(message.to);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferRateLimit>, I>>(
    base?: I
  ): TransferRateLimit {
    return TransferRateLimit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferRateLimit>, I>>(
    object: I
  ): TransferRateLimit {
    const message = createBaseTransferRateLimit();
    message.limit = object.limit ?? new Uint8Array(0);
    message.window =
      object.window !== undefined && object.window !== null
        ? Duration.fromPartial(object.window)
        : undefined;
    message.incoming = object.incoming ?? new Uint8Array(0);
    message.outgoing = object.outgoing ?? new Uint8Array(0);
    message.timeLeft =
      object.timeLeft !== undefined && object.timeLeft !== null
        ? Duration.fromPartial(object.timeLeft)
        : undefined;
    message.from = object.from ?? new Uint8Array(0);
    message.to = object.to ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMessageRequest(): MessageRequest {
  return { id: "" };
}

export const MessageRequest = {
  encode(
    message: MessageRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageRequest();
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

  fromJSON(object: any): MessageRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: MessageRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageRequest>, I>>(
    base?: I
  ): MessageRequest {
    return MessageRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageRequest>, I>>(
    object: I
  ): MessageRequest {
    const message = createBaseMessageRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseMessageResponse(): MessageResponse {
  return { message: undefined };
}

export const MessageResponse = {
  encode(
    message: MessageResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.message !== undefined) {
      GeneralMessage.encode(message.message, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = GeneralMessage.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageResponse {
    return {
      message: isSet(object.message)
        ? GeneralMessage.fromJSON(object.message)
        : undefined,
    };
  },

  toJSON(message: MessageResponse): unknown {
    const obj: any = {};
    if (message.message !== undefined) {
      obj.message = GeneralMessage.toJSON(message.message);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageResponse>, I>>(
    base?: I
  ): MessageResponse {
    return MessageResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageResponse>, I>>(
    object: I
  ): MessageResponse {
    const message = createBaseMessageResponse();
    message.message =
      object.message !== undefined && object.message !== null
        ? GeneralMessage.fromPartial(object.message)
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
