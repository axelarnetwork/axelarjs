/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { PollParticipants } from "../../vote/exported/v1beta1/types";
import { TokenDetails } from "./types";

export const protobufPackage = "axelar.evm.v1beta1";

export interface PollFailed {
  txId: Uint8Array;
  chain: string;
  pollId: Long;
}

export interface PollExpired {
  txId: Uint8Array;
  chain: string;
  pollId: Long;
}

export interface PollCompleted {
  txId: Uint8Array;
  chain: string;
  pollId: Long;
}

export interface NoEventsConfirmed {
  txId: Uint8Array;
  chain: string;
  pollId: Long;
}

export interface ConfirmKeyTransferStarted {
  chain: string;
  txId: Uint8Array;
  gatewayAddress: Uint8Array;
  confirmationHeight: Long;
  participants?: PollParticipants;
}

export interface ConfirmGatewayTxStarted {
  txId: Uint8Array;
  chain: string;
  gatewayAddress: Uint8Array;
  confirmationHeight: Long;
  participants?: PollParticipants;
}

export interface ConfirmDepositStarted {
  txId: Uint8Array;
  chain: string;
  depositAddress: Uint8Array;
  tokenAddress: Uint8Array;
  confirmationHeight: Long;
  participants?: PollParticipants;
  asset: string;
}

export interface ConfirmTokenStarted {
  txId: Uint8Array;
  chain: string;
  gatewayAddress: Uint8Array;
  tokenAddress: Uint8Array;
  tokenDetails?: TokenDetails;
  confirmationHeight: Long;
  participants?: PollParticipants;
}

export interface ChainAdded {
  chain: string;
}

export interface CommandBatchSigned {
  chain: string;
  commandBatchId: Uint8Array;
}

export interface CommandBatchAborted {
  chain: string;
  commandBatchId: Uint8Array;
}

export interface EVMEventConfirmed {
  chain: string;
  eventId: string;
  type: string;
}

export interface EVMEventCompleted {
  chain: string;
  eventId: string;
  type: string;
}

export interface EVMEventFailed {
  chain: string;
  eventId: string;
  type: string;
}

export interface EVMEventRetryFailed {
  chain: string;
  eventId: string;
  type: string;
}

export interface ContractCallApproved {
  chain: string;
  eventId: string;
  commandId: Uint8Array;
  sender: string;
  destinationChain: string;
  contractAddress: string;
  payloadHash: Uint8Array;
}

export interface ContractCallFailed {
  chain: string;
  msgId: string;
}

export interface ContractCallWithMintApproved {
  chain: string;
  eventId: string;
  commandId: Uint8Array;
  sender: string;
  destinationChain: string;
  contractAddress: string;
  payloadHash: Uint8Array;
  asset?: Coin;
}

export interface TokenSent {
  chain: string;
  eventId: string;
  transferId: Long;
  sender: string;
  destinationChain: string;
  destinationAddress: string;
  asset?: Coin;
}

export interface MintCommand {
  chain: string;
  transferId: Long;
  commandId: Uint8Array;
  destinationChain: string;
  destinationAddress: string;
  asset?: Coin;
}

export interface BurnCommand {
  chain: string;
  commandId: Uint8Array;
  destinationChain: string;
  depositAddress: string;
  asset: string;
}

function createBasePollFailed(): PollFailed {
  return { txId: new Uint8Array(), chain: "", pollId: Long.UZERO };
}

export const PollFailed = {
  encode(
    message: PollFailed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (!message.pollId.isZero()) {
      writer.uint32(24).uint64(message.pollId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollFailed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollFailed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.pollId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollFailed {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
    };
  },

  toJSON(message: PollFailed): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.pollId !== undefined &&
      (obj.pollId = (message.pollId || Long.UZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<PollFailed>, I>>(base?: I): PollFailed {
    return PollFailed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PollFailed>, I>>(
    object: I
  ): PollFailed {
    const message = createBasePollFailed();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    return message;
  },
};

function createBasePollExpired(): PollExpired {
  return { txId: new Uint8Array(), chain: "", pollId: Long.UZERO };
}

export const PollExpired = {
  encode(
    message: PollExpired,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (!message.pollId.isZero()) {
      writer.uint32(24).uint64(message.pollId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollExpired {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollExpired();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.pollId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollExpired {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
    };
  },

  toJSON(message: PollExpired): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.pollId !== undefined &&
      (obj.pollId = (message.pollId || Long.UZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<PollExpired>, I>>(base?: I): PollExpired {
    return PollExpired.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PollExpired>, I>>(
    object: I
  ): PollExpired {
    const message = createBasePollExpired();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    return message;
  },
};

function createBasePollCompleted(): PollCompleted {
  return { txId: new Uint8Array(), chain: "", pollId: Long.UZERO };
}

export const PollCompleted = {
  encode(
    message: PollCompleted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (!message.pollId.isZero()) {
      writer.uint32(24).uint64(message.pollId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollCompleted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollCompleted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.pollId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollCompleted {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
    };
  },

  toJSON(message: PollCompleted): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.pollId !== undefined &&
      (obj.pollId = (message.pollId || Long.UZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<PollCompleted>, I>>(
    base?: I
  ): PollCompleted {
    return PollCompleted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PollCompleted>, I>>(
    object: I
  ): PollCompleted {
    const message = createBasePollCompleted();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    return message;
  },
};

function createBaseNoEventsConfirmed(): NoEventsConfirmed {
  return { txId: new Uint8Array(), chain: "", pollId: Long.UZERO };
}

export const NoEventsConfirmed = {
  encode(
    message: NoEventsConfirmed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (!message.pollId.isZero()) {
      writer.uint32(24).uint64(message.pollId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoEventsConfirmed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoEventsConfirmed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.pollId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NoEventsConfirmed {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
    };
  },

  toJSON(message: NoEventsConfirmed): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.pollId !== undefined &&
      (obj.pollId = (message.pollId || Long.UZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<NoEventsConfirmed>, I>>(
    base?: I
  ): NoEventsConfirmed {
    return NoEventsConfirmed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<NoEventsConfirmed>, I>>(
    object: I
  ): NoEventsConfirmed {
    const message = createBaseNoEventsConfirmed();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    return message;
  },
};

function createBaseConfirmKeyTransferStarted(): ConfirmKeyTransferStarted {
  return {
    chain: "",
    txId: new Uint8Array(),
    gatewayAddress: new Uint8Array(),
    confirmationHeight: Long.UZERO,
    participants: undefined,
  };
}

export const ConfirmKeyTransferStarted = {
  encode(
    message: ConfirmKeyTransferStarted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(18).bytes(message.txId);
    }
    if (message.gatewayAddress.length !== 0) {
      writer.uint32(26).bytes(message.gatewayAddress);
    }
    if (!message.confirmationHeight.isZero()) {
      writer.uint32(32).uint64(message.confirmationHeight);
    }
    if (message.participants !== undefined) {
      PollParticipants.encode(
        message.participants,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmKeyTransferStarted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmKeyTransferStarted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.txId = reader.bytes();
          break;
        case 3:
          message.gatewayAddress = reader.bytes();
          break;
        case 4:
          message.confirmationHeight = reader.uint64() as Long;
          break;
        case 5:
          message.participants = PollParticipants.decode(
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

  fromJSON(object: any): ConfirmKeyTransferStarted {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      gatewayAddress: isSet(object.gatewayAddress)
        ? bytesFromBase64(object.gatewayAddress)
        : new Uint8Array(),
      confirmationHeight: isSet(object.confirmationHeight)
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO,
      participants: isSet(object.participants)
        ? PollParticipants.fromJSON(object.participants)
        : undefined,
    };
  },

  toJSON(message: ConfirmKeyTransferStarted): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.gatewayAddress !== undefined &&
      (obj.gatewayAddress = base64FromBytes(
        message.gatewayAddress !== undefined
          ? message.gatewayAddress
          : new Uint8Array()
      ));
    message.confirmationHeight !== undefined &&
      (obj.confirmationHeight = (
        message.confirmationHeight || Long.UZERO
      ).toString());
    message.participants !== undefined &&
      (obj.participants = message.participants
        ? PollParticipants.toJSON(message.participants)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmKeyTransferStarted>, I>>(
    base?: I
  ): ConfirmKeyTransferStarted {
    return ConfirmKeyTransferStarted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmKeyTransferStarted>, I>>(
    object: I
  ): ConfirmKeyTransferStarted {
    const message = createBaseConfirmKeyTransferStarted();
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array();
    message.gatewayAddress = object.gatewayAddress ?? new Uint8Array();
    message.confirmationHeight =
      object.confirmationHeight !== undefined &&
      object.confirmationHeight !== null
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO;
    message.participants =
      object.participants !== undefined && object.participants !== null
        ? PollParticipants.fromPartial(object.participants)
        : undefined;
    return message;
  },
};

function createBaseConfirmGatewayTxStarted(): ConfirmGatewayTxStarted {
  return {
    txId: new Uint8Array(),
    chain: "",
    gatewayAddress: new Uint8Array(),
    confirmationHeight: Long.UZERO,
    participants: undefined,
  };
}

export const ConfirmGatewayTxStarted = {
  encode(
    message: ConfirmGatewayTxStarted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.gatewayAddress.length !== 0) {
      writer.uint32(26).bytes(message.gatewayAddress);
    }
    if (!message.confirmationHeight.isZero()) {
      writer.uint32(32).uint64(message.confirmationHeight);
    }
    if (message.participants !== undefined) {
      PollParticipants.encode(
        message.participants,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmGatewayTxStarted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmGatewayTxStarted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.gatewayAddress = reader.bytes();
          break;
        case 4:
          message.confirmationHeight = reader.uint64() as Long;
          break;
        case 5:
          message.participants = PollParticipants.decode(
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

  fromJSON(object: any): ConfirmGatewayTxStarted {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      gatewayAddress: isSet(object.gatewayAddress)
        ? bytesFromBase64(object.gatewayAddress)
        : new Uint8Array(),
      confirmationHeight: isSet(object.confirmationHeight)
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO,
      participants: isSet(object.participants)
        ? PollParticipants.fromJSON(object.participants)
        : undefined,
    };
  },

  toJSON(message: ConfirmGatewayTxStarted): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.gatewayAddress !== undefined &&
      (obj.gatewayAddress = base64FromBytes(
        message.gatewayAddress !== undefined
          ? message.gatewayAddress
          : new Uint8Array()
      ));
    message.confirmationHeight !== undefined &&
      (obj.confirmationHeight = (
        message.confirmationHeight || Long.UZERO
      ).toString());
    message.participants !== undefined &&
      (obj.participants = message.participants
        ? PollParticipants.toJSON(message.participants)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmGatewayTxStarted>, I>>(
    base?: I
  ): ConfirmGatewayTxStarted {
    return ConfirmGatewayTxStarted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmGatewayTxStarted>, I>>(
    object: I
  ): ConfirmGatewayTxStarted {
    const message = createBaseConfirmGatewayTxStarted();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.gatewayAddress = object.gatewayAddress ?? new Uint8Array();
    message.confirmationHeight =
      object.confirmationHeight !== undefined &&
      object.confirmationHeight !== null
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO;
    message.participants =
      object.participants !== undefined && object.participants !== null
        ? PollParticipants.fromPartial(object.participants)
        : undefined;
    return message;
  },
};

function createBaseConfirmDepositStarted(): ConfirmDepositStarted {
  return {
    txId: new Uint8Array(),
    chain: "",
    depositAddress: new Uint8Array(),
    tokenAddress: new Uint8Array(),
    confirmationHeight: Long.UZERO,
    participants: undefined,
    asset: "",
  };
}

export const ConfirmDepositStarted = {
  encode(
    message: ConfirmDepositStarted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.depositAddress.length !== 0) {
      writer.uint32(26).bytes(message.depositAddress);
    }
    if (message.tokenAddress.length !== 0) {
      writer.uint32(34).bytes(message.tokenAddress);
    }
    if (!message.confirmationHeight.isZero()) {
      writer.uint32(40).uint64(message.confirmationHeight);
    }
    if (message.participants !== undefined) {
      PollParticipants.encode(
        message.participants,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.asset !== "") {
      writer.uint32(58).string(message.asset);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConfirmDepositStarted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmDepositStarted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.depositAddress = reader.bytes();
          break;
        case 4:
          message.tokenAddress = reader.bytes();
          break;
        case 5:
          message.confirmationHeight = reader.uint64() as Long;
          break;
        case 6:
          message.participants = PollParticipants.decode(
            reader,
            reader.uint32()
          );
          break;
        case 7:
          message.asset = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfirmDepositStarted {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      depositAddress: isSet(object.depositAddress)
        ? bytesFromBase64(object.depositAddress)
        : new Uint8Array(),
      tokenAddress: isSet(object.tokenAddress)
        ? bytesFromBase64(object.tokenAddress)
        : new Uint8Array(),
      confirmationHeight: isSet(object.confirmationHeight)
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO,
      participants: isSet(object.participants)
        ? PollParticipants.fromJSON(object.participants)
        : undefined,
      asset: isSet(object.asset) ? String(object.asset) : "",
    };
  },

  toJSON(message: ConfirmDepositStarted): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.depositAddress !== undefined &&
      (obj.depositAddress = base64FromBytes(
        message.depositAddress !== undefined
          ? message.depositAddress
          : new Uint8Array()
      ));
    message.tokenAddress !== undefined &&
      (obj.tokenAddress = base64FromBytes(
        message.tokenAddress !== undefined
          ? message.tokenAddress
          : new Uint8Array()
      ));
    message.confirmationHeight !== undefined &&
      (obj.confirmationHeight = (
        message.confirmationHeight || Long.UZERO
      ).toString());
    message.participants !== undefined &&
      (obj.participants = message.participants
        ? PollParticipants.toJSON(message.participants)
        : undefined);
    message.asset !== undefined && (obj.asset = message.asset);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmDepositStarted>, I>>(
    base?: I
  ): ConfirmDepositStarted {
    return ConfirmDepositStarted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmDepositStarted>, I>>(
    object: I
  ): ConfirmDepositStarted {
    const message = createBaseConfirmDepositStarted();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.depositAddress = object.depositAddress ?? new Uint8Array();
    message.tokenAddress = object.tokenAddress ?? new Uint8Array();
    message.confirmationHeight =
      object.confirmationHeight !== undefined &&
      object.confirmationHeight !== null
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO;
    message.participants =
      object.participants !== undefined && object.participants !== null
        ? PollParticipants.fromPartial(object.participants)
        : undefined;
    message.asset = object.asset ?? "";
    return message;
  },
};

function createBaseConfirmTokenStarted(): ConfirmTokenStarted {
  return {
    txId: new Uint8Array(),
    chain: "",
    gatewayAddress: new Uint8Array(),
    tokenAddress: new Uint8Array(),
    tokenDetails: undefined,
    confirmationHeight: Long.UZERO,
    participants: undefined,
  };
}

export const ConfirmTokenStarted = {
  encode(
    message: ConfirmTokenStarted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.gatewayAddress.length !== 0) {
      writer.uint32(26).bytes(message.gatewayAddress);
    }
    if (message.tokenAddress.length !== 0) {
      writer.uint32(34).bytes(message.tokenAddress);
    }
    if (message.tokenDetails !== undefined) {
      TokenDetails.encode(
        message.tokenDetails,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (!message.confirmationHeight.isZero()) {
      writer.uint32(48).uint64(message.confirmationHeight);
    }
    if (message.participants !== undefined) {
      PollParticipants.encode(
        message.participants,
        writer.uint32(58).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmTokenStarted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmTokenStarted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.bytes();
          break;
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.gatewayAddress = reader.bytes();
          break;
        case 4:
          message.tokenAddress = reader.bytes();
          break;
        case 5:
          message.tokenDetails = TokenDetails.decode(reader, reader.uint32());
          break;
        case 6:
          message.confirmationHeight = reader.uint64() as Long;
          break;
        case 7:
          message.participants = PollParticipants.decode(
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

  fromJSON(object: any): ConfirmTokenStarted {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(),
      chain: isSet(object.chain) ? String(object.chain) : "",
      gatewayAddress: isSet(object.gatewayAddress)
        ? bytesFromBase64(object.gatewayAddress)
        : new Uint8Array(),
      tokenAddress: isSet(object.tokenAddress)
        ? bytesFromBase64(object.tokenAddress)
        : new Uint8Array(),
      tokenDetails: isSet(object.tokenDetails)
        ? TokenDetails.fromJSON(object.tokenDetails)
        : undefined,
      confirmationHeight: isSet(object.confirmationHeight)
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO,
      participants: isSet(object.participants)
        ? PollParticipants.fromJSON(object.participants)
        : undefined,
    };
  },

  toJSON(message: ConfirmTokenStarted): unknown {
    const obj: any = {};
    message.txId !== undefined &&
      (obj.txId = base64FromBytes(
        message.txId !== undefined ? message.txId : new Uint8Array()
      ));
    message.chain !== undefined && (obj.chain = message.chain);
    message.gatewayAddress !== undefined &&
      (obj.gatewayAddress = base64FromBytes(
        message.gatewayAddress !== undefined
          ? message.gatewayAddress
          : new Uint8Array()
      ));
    message.tokenAddress !== undefined &&
      (obj.tokenAddress = base64FromBytes(
        message.tokenAddress !== undefined
          ? message.tokenAddress
          : new Uint8Array()
      ));
    message.tokenDetails !== undefined &&
      (obj.tokenDetails = message.tokenDetails
        ? TokenDetails.toJSON(message.tokenDetails)
        : undefined);
    message.confirmationHeight !== undefined &&
      (obj.confirmationHeight = (
        message.confirmationHeight || Long.UZERO
      ).toString());
    message.participants !== undefined &&
      (obj.participants = message.participants
        ? PollParticipants.toJSON(message.participants)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmTokenStarted>, I>>(
    base?: I
  ): ConfirmTokenStarted {
    return ConfirmTokenStarted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmTokenStarted>, I>>(
    object: I
  ): ConfirmTokenStarted {
    const message = createBaseConfirmTokenStarted();
    message.txId = object.txId ?? new Uint8Array();
    message.chain = object.chain ?? "";
    message.gatewayAddress = object.gatewayAddress ?? new Uint8Array();
    message.tokenAddress = object.tokenAddress ?? new Uint8Array();
    message.tokenDetails =
      object.tokenDetails !== undefined && object.tokenDetails !== null
        ? TokenDetails.fromPartial(object.tokenDetails)
        : undefined;
    message.confirmationHeight =
      object.confirmationHeight !== undefined &&
      object.confirmationHeight !== null
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO;
    message.participants =
      object.participants !== undefined && object.participants !== null
        ? PollParticipants.fromPartial(object.participants)
        : undefined;
    return message;
  },
};

function createBaseChainAdded(): ChainAdded {
  return { chain: "" };
}

export const ChainAdded = {
  encode(
    message: ChainAdded,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainAdded {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainAdded();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChainAdded {
    return { chain: isSet(object.chain) ? String(object.chain) : "" };
  },

  toJSON(message: ChainAdded): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainAdded>, I>>(base?: I): ChainAdded {
    return ChainAdded.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ChainAdded>, I>>(
    object: I
  ): ChainAdded {
    const message = createBaseChainAdded();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseCommandBatchSigned(): CommandBatchSigned {
  return { chain: "", commandBatchId: new Uint8Array() };
}

export const CommandBatchSigned = {
  encode(
    message: CommandBatchSigned,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.commandBatchId.length !== 0) {
      writer.uint32(26).bytes(message.commandBatchId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommandBatchSigned {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommandBatchSigned();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.commandBatchId = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommandBatchSigned {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      commandBatchId: isSet(object.commandBatchId)
        ? bytesFromBase64(object.commandBatchId)
        : new Uint8Array(),
    };
  },

  toJSON(message: CommandBatchSigned): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.commandBatchId !== undefined &&
      (obj.commandBatchId = base64FromBytes(
        message.commandBatchId !== undefined
          ? message.commandBatchId
          : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<CommandBatchSigned>, I>>(
    base?: I
  ): CommandBatchSigned {
    return CommandBatchSigned.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommandBatchSigned>, I>>(
    object: I
  ): CommandBatchSigned {
    const message = createBaseCommandBatchSigned();
    message.chain = object.chain ?? "";
    message.commandBatchId = object.commandBatchId ?? new Uint8Array();
    return message;
  },
};

function createBaseCommandBatchAborted(): CommandBatchAborted {
  return { chain: "", commandBatchId: new Uint8Array() };
}

export const CommandBatchAborted = {
  encode(
    message: CommandBatchAborted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.commandBatchId.length !== 0) {
      writer.uint32(26).bytes(message.commandBatchId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommandBatchAborted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommandBatchAborted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.chain = reader.string();
          break;
        case 3:
          message.commandBatchId = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommandBatchAborted {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      commandBatchId: isSet(object.commandBatchId)
        ? bytesFromBase64(object.commandBatchId)
        : new Uint8Array(),
    };
  },

  toJSON(message: CommandBatchAborted): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.commandBatchId !== undefined &&
      (obj.commandBatchId = base64FromBytes(
        message.commandBatchId !== undefined
          ? message.commandBatchId
          : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<CommandBatchAborted>, I>>(
    base?: I
  ): CommandBatchAborted {
    return CommandBatchAborted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommandBatchAborted>, I>>(
    object: I
  ): CommandBatchAborted {
    const message = createBaseCommandBatchAborted();
    message.chain = object.chain ?? "";
    message.commandBatchId = object.commandBatchId ?? new Uint8Array();
    return message;
  },
};

function createBaseEVMEventConfirmed(): EVMEventConfirmed {
  return { chain: "", eventId: "", type: "" };
}

export const EVMEventConfirmed = {
  encode(
    message: EVMEventConfirmed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EVMEventConfirmed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEVMEventConfirmed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EVMEventConfirmed {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: EVMEventConfirmed): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<EVMEventConfirmed>, I>>(
    base?: I
  ): EVMEventConfirmed {
    return EVMEventConfirmed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EVMEventConfirmed>, I>>(
    object: I
  ): EVMEventConfirmed {
    const message = createBaseEVMEventConfirmed();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseEVMEventCompleted(): EVMEventCompleted {
  return { chain: "", eventId: "", type: "" };
}

export const EVMEventCompleted = {
  encode(
    message: EVMEventCompleted,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EVMEventCompleted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEVMEventCompleted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EVMEventCompleted {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: EVMEventCompleted): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<EVMEventCompleted>, I>>(
    base?: I
  ): EVMEventCompleted {
    return EVMEventCompleted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EVMEventCompleted>, I>>(
    object: I
  ): EVMEventCompleted {
    const message = createBaseEVMEventCompleted();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseEVMEventFailed(): EVMEventFailed {
  return { chain: "", eventId: "", type: "" };
}

export const EVMEventFailed = {
  encode(
    message: EVMEventFailed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EVMEventFailed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEVMEventFailed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EVMEventFailed {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: EVMEventFailed): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<EVMEventFailed>, I>>(
    base?: I
  ): EVMEventFailed {
    return EVMEventFailed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EVMEventFailed>, I>>(
    object: I
  ): EVMEventFailed {
    const message = createBaseEVMEventFailed();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseEVMEventRetryFailed(): EVMEventRetryFailed {
  return { chain: "", eventId: "", type: "" };
}

export const EVMEventRetryFailed = {
  encode(
    message: EVMEventRetryFailed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EVMEventRetryFailed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEVMEventRetryFailed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EVMEventRetryFailed {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: EVMEventRetryFailed): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<EVMEventRetryFailed>, I>>(
    base?: I
  ): EVMEventRetryFailed {
    return EVMEventRetryFailed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EVMEventRetryFailed>, I>>(
    object: I
  ): EVMEventRetryFailed {
    const message = createBaseEVMEventRetryFailed();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseContractCallApproved(): ContractCallApproved {
  return {
    chain: "",
    eventId: "",
    commandId: new Uint8Array(),
    sender: "",
    destinationChain: "",
    contractAddress: "",
    payloadHash: new Uint8Array(),
  };
}

export const ContractCallApproved = {
  encode(
    message: ContractCallApproved,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.commandId.length !== 0) {
      writer.uint32(26).bytes(message.commandId);
    }
    if (message.sender !== "") {
      writer.uint32(34).string(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(42).string(message.destinationChain);
    }
    if (message.contractAddress !== "") {
      writer.uint32(50).string(message.contractAddress);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(58).bytes(message.payloadHash);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ContractCallApproved {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallApproved();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.commandId = reader.bytes();
          break;
        case 4:
          message.sender = reader.string();
          break;
        case 5:
          message.destinationChain = reader.string();
          break;
        case 6:
          message.contractAddress = reader.string();
          break;
        case 7:
          message.payloadHash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallApproved {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      commandId: isSet(object.commandId)
        ? bytesFromBase64(object.commandId)
        : new Uint8Array(),
      sender: isSet(object.sender) ? String(object.sender) : "",
      destinationChain: isSet(object.destinationChain)
        ? String(object.destinationChain)
        : "",
      contractAddress: isSet(object.contractAddress)
        ? String(object.contractAddress)
        : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(),
    };
  },

  toJSON(message: ContractCallApproved): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.commandId !== undefined &&
      (obj.commandId = base64FromBytes(
        message.commandId !== undefined ? message.commandId : new Uint8Array()
      ));
    message.sender !== undefined && (obj.sender = message.sender);
    message.destinationChain !== undefined &&
      (obj.destinationChain = message.destinationChain);
    message.contractAddress !== undefined &&
      (obj.contractAddress = message.contractAddress);
    message.payloadHash !== undefined &&
      (obj.payloadHash = base64FromBytes(
        message.payloadHash !== undefined
          ? message.payloadHash
          : new Uint8Array()
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<ContractCallApproved>, I>>(
    base?: I
  ): ContractCallApproved {
    return ContractCallApproved.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallApproved>, I>>(
    object: I
  ): ContractCallApproved {
    const message = createBaseContractCallApproved();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.commandId = object.commandId ?? new Uint8Array();
    message.sender = object.sender ?? "";
    message.destinationChain = object.destinationChain ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array();
    return message;
  },
};

function createBaseContractCallFailed(): ContractCallFailed {
  return { chain: "", msgId: "" };
}

export const ContractCallFailed = {
  encode(
    message: ContractCallFailed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.msgId !== "") {
      writer.uint32(18).string(message.msgId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallFailed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallFailed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.msgId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallFailed {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      msgId: isSet(object.msgId) ? String(object.msgId) : "",
    };
  },

  toJSON(message: ContractCallFailed): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.msgId !== undefined && (obj.msgId = message.msgId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ContractCallFailed>, I>>(
    base?: I
  ): ContractCallFailed {
    return ContractCallFailed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallFailed>, I>>(
    object: I
  ): ContractCallFailed {
    const message = createBaseContractCallFailed();
    message.chain = object.chain ?? "";
    message.msgId = object.msgId ?? "";
    return message;
  },
};

function createBaseContractCallWithMintApproved(): ContractCallWithMintApproved {
  return {
    chain: "",
    eventId: "",
    commandId: new Uint8Array(),
    sender: "",
    destinationChain: "",
    contractAddress: "",
    payloadHash: new Uint8Array(),
    asset: undefined,
  };
}

export const ContractCallWithMintApproved = {
  encode(
    message: ContractCallWithMintApproved,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (message.commandId.length !== 0) {
      writer.uint32(26).bytes(message.commandId);
    }
    if (message.sender !== "") {
      writer.uint32(34).string(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(42).string(message.destinationChain);
    }
    if (message.contractAddress !== "") {
      writer.uint32(50).string(message.contractAddress);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(58).bytes(message.payloadHash);
    }
    if (message.asset !== undefined) {
      Coin.encode(message.asset, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ContractCallWithMintApproved {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallWithMintApproved();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.commandId = reader.bytes();
          break;
        case 4:
          message.sender = reader.string();
          break;
        case 5:
          message.destinationChain = reader.string();
          break;
        case 6:
          message.contractAddress = reader.string();
          break;
        case 7:
          message.payloadHash = reader.bytes();
          break;
        case 8:
          message.asset = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallWithMintApproved {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      commandId: isSet(object.commandId)
        ? bytesFromBase64(object.commandId)
        : new Uint8Array(),
      sender: isSet(object.sender) ? String(object.sender) : "",
      destinationChain: isSet(object.destinationChain)
        ? String(object.destinationChain)
        : "",
      contractAddress: isSet(object.contractAddress)
        ? String(object.contractAddress)
        : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(),
      asset: isSet(object.asset) ? Coin.fromJSON(object.asset) : undefined,
    };
  },

  toJSON(message: ContractCallWithMintApproved): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.commandId !== undefined &&
      (obj.commandId = base64FromBytes(
        message.commandId !== undefined ? message.commandId : new Uint8Array()
      ));
    message.sender !== undefined && (obj.sender = message.sender);
    message.destinationChain !== undefined &&
      (obj.destinationChain = message.destinationChain);
    message.contractAddress !== undefined &&
      (obj.contractAddress = message.contractAddress);
    message.payloadHash !== undefined &&
      (obj.payloadHash = base64FromBytes(
        message.payloadHash !== undefined
          ? message.payloadHash
          : new Uint8Array()
      ));
    message.asset !== undefined &&
      (obj.asset = message.asset ? Coin.toJSON(message.asset) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ContractCallWithMintApproved>, I>>(
    base?: I
  ): ContractCallWithMintApproved {
    return ContractCallWithMintApproved.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallWithMintApproved>, I>>(
    object: I
  ): ContractCallWithMintApproved {
    const message = createBaseContractCallWithMintApproved();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.commandId = object.commandId ?? new Uint8Array();
    message.sender = object.sender ?? "";
    message.destinationChain = object.destinationChain ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array();
    message.asset =
      object.asset !== undefined && object.asset !== null
        ? Coin.fromPartial(object.asset)
        : undefined;
    return message;
  },
};

function createBaseTokenSent(): TokenSent {
  return {
    chain: "",
    eventId: "",
    transferId: Long.UZERO,
    sender: "",
    destinationChain: "",
    destinationAddress: "",
    asset: undefined,
  };
}

export const TokenSent = {
  encode(
    message: TokenSent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.eventId !== "") {
      writer.uint32(18).string(message.eventId);
    }
    if (!message.transferId.isZero()) {
      writer.uint32(24).uint64(message.transferId);
    }
    if (message.sender !== "") {
      writer.uint32(34).string(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(42).string(message.destinationChain);
    }
    if (message.destinationAddress !== "") {
      writer.uint32(50).string(message.destinationAddress);
    }
    if (message.asset !== undefined) {
      Coin.encode(message.asset, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenSent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenSent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.eventId = reader.string();
          break;
        case 3:
          message.transferId = reader.uint64() as Long;
          break;
        case 4:
          message.sender = reader.string();
          break;
        case 5:
          message.destinationChain = reader.string();
          break;
        case 6:
          message.destinationAddress = reader.string();
          break;
        case 7:
          message.asset = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenSent {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
      transferId: isSet(object.transferId)
        ? Long.fromValue(object.transferId)
        : Long.UZERO,
      sender: isSet(object.sender) ? String(object.sender) : "",
      destinationChain: isSet(object.destinationChain)
        ? String(object.destinationChain)
        : "",
      destinationAddress: isSet(object.destinationAddress)
        ? String(object.destinationAddress)
        : "",
      asset: isSet(object.asset) ? Coin.fromJSON(object.asset) : undefined,
    };
  },

  toJSON(message: TokenSent): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.eventId !== undefined && (obj.eventId = message.eventId);
    message.transferId !== undefined &&
      (obj.transferId = (message.transferId || Long.UZERO).toString());
    message.sender !== undefined && (obj.sender = message.sender);
    message.destinationChain !== undefined &&
      (obj.destinationChain = message.destinationChain);
    message.destinationAddress !== undefined &&
      (obj.destinationAddress = message.destinationAddress);
    message.asset !== undefined &&
      (obj.asset = message.asset ? Coin.toJSON(message.asset) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenSent>, I>>(base?: I): TokenSent {
    return TokenSent.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TokenSent>, I>>(
    object: I
  ): TokenSent {
    const message = createBaseTokenSent();
    message.chain = object.chain ?? "";
    message.eventId = object.eventId ?? "";
    message.transferId =
      object.transferId !== undefined && object.transferId !== null
        ? Long.fromValue(object.transferId)
        : Long.UZERO;
    message.sender = object.sender ?? "";
    message.destinationChain = object.destinationChain ?? "";
    message.destinationAddress = object.destinationAddress ?? "";
    message.asset =
      object.asset !== undefined && object.asset !== null
        ? Coin.fromPartial(object.asset)
        : undefined;
    return message;
  },
};

function createBaseMintCommand(): MintCommand {
  return {
    chain: "",
    transferId: Long.UZERO,
    commandId: new Uint8Array(),
    destinationChain: "",
    destinationAddress: "",
    asset: undefined,
  };
}

export const MintCommand = {
  encode(
    message: MintCommand,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (!message.transferId.isZero()) {
      writer.uint32(16).uint64(message.transferId);
    }
    if (message.commandId.length !== 0) {
      writer.uint32(26).bytes(message.commandId);
    }
    if (message.destinationChain !== "") {
      writer.uint32(34).string(message.destinationChain);
    }
    if (message.destinationAddress !== "") {
      writer.uint32(42).string(message.destinationAddress);
    }
    if (message.asset !== undefined) {
      Coin.encode(message.asset, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MintCommand {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMintCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.transferId = reader.uint64() as Long;
          break;
        case 3:
          message.commandId = reader.bytes();
          break;
        case 4:
          message.destinationChain = reader.string();
          break;
        case 5:
          message.destinationAddress = reader.string();
          break;
        case 6:
          message.asset = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MintCommand {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      transferId: isSet(object.transferId)
        ? Long.fromValue(object.transferId)
        : Long.UZERO,
      commandId: isSet(object.commandId)
        ? bytesFromBase64(object.commandId)
        : new Uint8Array(),
      destinationChain: isSet(object.destinationChain)
        ? String(object.destinationChain)
        : "",
      destinationAddress: isSet(object.destinationAddress)
        ? String(object.destinationAddress)
        : "",
      asset: isSet(object.asset) ? Coin.fromJSON(object.asset) : undefined,
    };
  },

  toJSON(message: MintCommand): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.transferId !== undefined &&
      (obj.transferId = (message.transferId || Long.UZERO).toString());
    message.commandId !== undefined &&
      (obj.commandId = base64FromBytes(
        message.commandId !== undefined ? message.commandId : new Uint8Array()
      ));
    message.destinationChain !== undefined &&
      (obj.destinationChain = message.destinationChain);
    message.destinationAddress !== undefined &&
      (obj.destinationAddress = message.destinationAddress);
    message.asset !== undefined &&
      (obj.asset = message.asset ? Coin.toJSON(message.asset) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MintCommand>, I>>(base?: I): MintCommand {
    return MintCommand.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MintCommand>, I>>(
    object: I
  ): MintCommand {
    const message = createBaseMintCommand();
    message.chain = object.chain ?? "";
    message.transferId =
      object.transferId !== undefined && object.transferId !== null
        ? Long.fromValue(object.transferId)
        : Long.UZERO;
    message.commandId = object.commandId ?? new Uint8Array();
    message.destinationChain = object.destinationChain ?? "";
    message.destinationAddress = object.destinationAddress ?? "";
    message.asset =
      object.asset !== undefined && object.asset !== null
        ? Coin.fromPartial(object.asset)
        : undefined;
    return message;
  },
};

function createBaseBurnCommand(): BurnCommand {
  return {
    chain: "",
    commandId: new Uint8Array(),
    destinationChain: "",
    depositAddress: "",
    asset: "",
  };
}

export const BurnCommand = {
  encode(
    message: BurnCommand,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.commandId.length !== 0) {
      writer.uint32(18).bytes(message.commandId);
    }
    if (message.destinationChain !== "") {
      writer.uint32(26).string(message.destinationChain);
    }
    if (message.depositAddress !== "") {
      writer.uint32(34).string(message.depositAddress);
    }
    if (message.asset !== "") {
      writer.uint32(42).string(message.asset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BurnCommand {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBurnCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.commandId = reader.bytes();
          break;
        case 3:
          message.destinationChain = reader.string();
          break;
        case 4:
          message.depositAddress = reader.string();
          break;
        case 5:
          message.asset = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BurnCommand {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      commandId: isSet(object.commandId)
        ? bytesFromBase64(object.commandId)
        : new Uint8Array(),
      destinationChain: isSet(object.destinationChain)
        ? String(object.destinationChain)
        : "",
      depositAddress: isSet(object.depositAddress)
        ? String(object.depositAddress)
        : "",
      asset: isSet(object.asset) ? String(object.asset) : "",
    };
  },

  toJSON(message: BurnCommand): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.commandId !== undefined &&
      (obj.commandId = base64FromBytes(
        message.commandId !== undefined ? message.commandId : new Uint8Array()
      ));
    message.destinationChain !== undefined &&
      (obj.destinationChain = message.destinationChain);
    message.depositAddress !== undefined &&
      (obj.depositAddress = message.depositAddress);
    message.asset !== undefined && (obj.asset = message.asset);
    return obj;
  },

  create<I extends Exact<DeepPartial<BurnCommand>, I>>(base?: I): BurnCommand {
    return BurnCommand.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BurnCommand>, I>>(
    object: I
  ): BurnCommand {
    const message = createBaseBurnCommand();
    message.chain = object.chain ?? "";
    message.commandId = object.commandId ?? new Uint8Array();
    message.destinationChain = object.destinationChain ?? "";
    message.depositAddress = object.depositAddress ?? "";
    message.asset = object.asset ?? "";
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
