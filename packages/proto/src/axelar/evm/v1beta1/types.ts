/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Any } from "../../../google/protobuf/any";

export const protobufPackage = "axelar.evm.v1beta1";

export enum Status {
  /**
   * STATUS_UNSPECIFIED - these enum values are used for bitwise operations, therefore they need to
   * be powers of 2
   */
  STATUS_UNSPECIFIED = 0,
  STATUS_INITIALIZED = 1,
  STATUS_PENDING = 2,
  STATUS_CONFIRMED = 4,
  UNRECOGNIZED = -1,
}

export function statusFromJSON(object: any): Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return Status.STATUS_UNSPECIFIED;
    case 1:
    case "STATUS_INITIALIZED":
      return Status.STATUS_INITIALIZED;
    case 2:
    case "STATUS_PENDING":
      return Status.STATUS_PENDING;
    case 4:
    case "STATUS_CONFIRMED":
      return Status.STATUS_CONFIRMED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Status.UNRECOGNIZED;
  }
}

export function statusToJSON(object: Status): string {
  switch (object) {
    case Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case Status.STATUS_INITIALIZED:
      return "STATUS_INITIALIZED";
    case Status.STATUS_PENDING:
      return "STATUS_PENDING";
    case Status.STATUS_CONFIRMED:
      return "STATUS_CONFIRMED";
    case Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum CommandType {
  COMMAND_TYPE_UNSPECIFIED = 0,
  COMMAND_TYPE_MINT_TOKEN = 1,
  COMMAND_TYPE_DEPLOY_TOKEN = 2,
  COMMAND_TYPE_BURN_TOKEN = 3,
  COMMAND_TYPE_TRANSFER_OPERATORSHIP = 4,
  COMMAND_TYPE_APPROVE_CONTRACT_CALL_WITH_MINT = 5,
  COMMAND_TYPE_APPROVE_CONTRACT_CALL = 6,
  UNRECOGNIZED = -1,
}

export function commandTypeFromJSON(object: any): CommandType {
  switch (object) {
    case 0:
    case "COMMAND_TYPE_UNSPECIFIED":
      return CommandType.COMMAND_TYPE_UNSPECIFIED;
    case 1:
    case "COMMAND_TYPE_MINT_TOKEN":
      return CommandType.COMMAND_TYPE_MINT_TOKEN;
    case 2:
    case "COMMAND_TYPE_DEPLOY_TOKEN":
      return CommandType.COMMAND_TYPE_DEPLOY_TOKEN;
    case 3:
    case "COMMAND_TYPE_BURN_TOKEN":
      return CommandType.COMMAND_TYPE_BURN_TOKEN;
    case 4:
    case "COMMAND_TYPE_TRANSFER_OPERATORSHIP":
      return CommandType.COMMAND_TYPE_TRANSFER_OPERATORSHIP;
    case 5:
    case "COMMAND_TYPE_APPROVE_CONTRACT_CALL_WITH_MINT":
      return CommandType.COMMAND_TYPE_APPROVE_CONTRACT_CALL_WITH_MINT;
    case 6:
    case "COMMAND_TYPE_APPROVE_CONTRACT_CALL":
      return CommandType.COMMAND_TYPE_APPROVE_CONTRACT_CALL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CommandType.UNRECOGNIZED;
  }
}

export function commandTypeToJSON(object: CommandType): string {
  switch (object) {
    case CommandType.COMMAND_TYPE_UNSPECIFIED:
      return "COMMAND_TYPE_UNSPECIFIED";
    case CommandType.COMMAND_TYPE_MINT_TOKEN:
      return "COMMAND_TYPE_MINT_TOKEN";
    case CommandType.COMMAND_TYPE_DEPLOY_TOKEN:
      return "COMMAND_TYPE_DEPLOY_TOKEN";
    case CommandType.COMMAND_TYPE_BURN_TOKEN:
      return "COMMAND_TYPE_BURN_TOKEN";
    case CommandType.COMMAND_TYPE_TRANSFER_OPERATORSHIP:
      return "COMMAND_TYPE_TRANSFER_OPERATORSHIP";
    case CommandType.COMMAND_TYPE_APPROVE_CONTRACT_CALL_WITH_MINT:
      return "COMMAND_TYPE_APPROVE_CONTRACT_CALL_WITH_MINT";
    case CommandType.COMMAND_TYPE_APPROVE_CONTRACT_CALL:
      return "COMMAND_TYPE_APPROVE_CONTRACT_CALL";
    case CommandType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum BatchedCommandsStatus {
  BATCHED_COMMANDS_STATUS_UNSPECIFIED = 0,
  BATCHED_COMMANDS_STATUS_SIGNING = 1,
  BATCHED_COMMANDS_STATUS_ABORTED = 2,
  BATCHED_COMMANDS_STATUS_SIGNED = 3,
  UNRECOGNIZED = -1,
}

export function batchedCommandsStatusFromJSON(
  object: any
): BatchedCommandsStatus {
  switch (object) {
    case 0:
    case "BATCHED_COMMANDS_STATUS_UNSPECIFIED":
      return BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_UNSPECIFIED;
    case 1:
    case "BATCHED_COMMANDS_STATUS_SIGNING":
      return BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_SIGNING;
    case 2:
    case "BATCHED_COMMANDS_STATUS_ABORTED":
      return BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_ABORTED;
    case 3:
    case "BATCHED_COMMANDS_STATUS_SIGNED":
      return BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_SIGNED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return BatchedCommandsStatus.UNRECOGNIZED;
  }
}

export function batchedCommandsStatusToJSON(
  object: BatchedCommandsStatus
): string {
  switch (object) {
    case BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_UNSPECIFIED:
      return "BATCHED_COMMANDS_STATUS_UNSPECIFIED";
    case BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_SIGNING:
      return "BATCHED_COMMANDS_STATUS_SIGNING";
    case BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_ABORTED:
      return "BATCHED_COMMANDS_STATUS_ABORTED";
    case BatchedCommandsStatus.BATCHED_COMMANDS_STATUS_SIGNED:
      return "BATCHED_COMMANDS_STATUS_SIGNED";
    case BatchedCommandsStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SigType {
  SIG_TYPE_UNSPECIFIED = 0,
  SIG_TYPE_TX = 1,
  SIG_TYPE_COMMAND = 2,
  UNRECOGNIZED = -1,
}

export function sigTypeFromJSON(object: any): SigType {
  switch (object) {
    case 0:
    case "SIG_TYPE_UNSPECIFIED":
      return SigType.SIG_TYPE_UNSPECIFIED;
    case 1:
    case "SIG_TYPE_TX":
      return SigType.SIG_TYPE_TX;
    case 2:
    case "SIG_TYPE_COMMAND":
      return SigType.SIG_TYPE_COMMAND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SigType.UNRECOGNIZED;
  }
}

export function sigTypeToJSON(object: SigType): string {
  switch (object) {
    case SigType.SIG_TYPE_UNSPECIFIED:
      return "SIG_TYPE_UNSPECIFIED";
    case SigType.SIG_TYPE_TX:
      return "SIG_TYPE_TX";
    case SigType.SIG_TYPE_COMMAND:
      return "SIG_TYPE_COMMAND";
    case SigType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum DepositStatus {
  DEPOSIT_STATUS_UNSPECIFIED = 0,
  DEPOSIT_STATUS_PENDING = 1,
  DEPOSIT_STATUS_CONFIRMED = 2,
  DEPOSIT_STATUS_BURNED = 3,
  UNRECOGNIZED = -1,
}

export function depositStatusFromJSON(object: any): DepositStatus {
  switch (object) {
    case 0:
    case "DEPOSIT_STATUS_UNSPECIFIED":
      return DepositStatus.DEPOSIT_STATUS_UNSPECIFIED;
    case 1:
    case "DEPOSIT_STATUS_PENDING":
      return DepositStatus.DEPOSIT_STATUS_PENDING;
    case 2:
    case "DEPOSIT_STATUS_CONFIRMED":
      return DepositStatus.DEPOSIT_STATUS_CONFIRMED;
    case 3:
    case "DEPOSIT_STATUS_BURNED":
      return DepositStatus.DEPOSIT_STATUS_BURNED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DepositStatus.UNRECOGNIZED;
  }
}

export function depositStatusToJSON(object: DepositStatus): string {
  switch (object) {
    case DepositStatus.DEPOSIT_STATUS_UNSPECIFIED:
      return "DEPOSIT_STATUS_UNSPECIFIED";
    case DepositStatus.DEPOSIT_STATUS_PENDING:
      return "DEPOSIT_STATUS_PENDING";
    case DepositStatus.DEPOSIT_STATUS_CONFIRMED:
      return "DEPOSIT_STATUS_CONFIRMED";
    case DepositStatus.DEPOSIT_STATUS_BURNED:
      return "DEPOSIT_STATUS_BURNED";
    case DepositStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface VoteEvents {
  chain: string;
  events: Event[];
}

export interface Event {
  chain: string;
  txId: Uint8Array;
  index: Long;
  status: Event_Status;
  tokenSent?: EventTokenSent | undefined;
  contractCall?: EventContractCall | undefined;
  contractCallWithToken?: EventContractCallWithToken | undefined;
  transfer?: EventTransfer | undefined;
  tokenDeployed?: EventTokenDeployed | undefined;
  /** @deprecated */
  multisigOwnershipTransferred?: EventMultisigOwnershipTransferred | undefined;
  multisigOperatorshipTransferred?:
    | EventMultisigOperatorshipTransferred
    | undefined;
}

export enum Event_Status {
  STATUS_UNSPECIFIED = 0,
  STATUS_CONFIRMED = 1,
  STATUS_COMPLETED = 2,
  STATUS_FAILED = 3,
  UNRECOGNIZED = -1,
}

export function event_StatusFromJSON(object: any): Event_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return Event_Status.STATUS_UNSPECIFIED;
    case 1:
    case "STATUS_CONFIRMED":
      return Event_Status.STATUS_CONFIRMED;
    case 2:
    case "STATUS_COMPLETED":
      return Event_Status.STATUS_COMPLETED;
    case 3:
    case "STATUS_FAILED":
      return Event_Status.STATUS_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Event_Status.UNRECOGNIZED;
  }
}

export function event_StatusToJSON(object: Event_Status): string {
  switch (object) {
    case Event_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case Event_Status.STATUS_CONFIRMED:
      return "STATUS_CONFIRMED";
    case Event_Status.STATUS_COMPLETED:
      return "STATUS_COMPLETED";
    case Event_Status.STATUS_FAILED:
      return "STATUS_FAILED";
    case Event_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface EventTokenSent {
  sender: Uint8Array;
  destinationChain: string;
  destinationAddress: string;
  symbol: string;
  amount: Uint8Array;
}

export interface EventContractCall {
  sender: Uint8Array;
  destinationChain: string;
  contractAddress: string;
  payloadHash: Uint8Array;
}

export interface EventContractCallWithToken {
  sender: Uint8Array;
  destinationChain: string;
  contractAddress: string;
  payloadHash: Uint8Array;
  symbol: string;
  amount: Uint8Array;
}

export interface EventTransfer {
  to: Uint8Array;
  amount: Uint8Array;
}

export interface EventTokenDeployed {
  symbol: string;
  tokenAddress: Uint8Array;
}

/** @deprecated */
export interface EventMultisigOwnershipTransferred {
  preOwners: Uint8Array[];
  prevThreshold: Uint8Array;
  newOwners: Uint8Array[];
  newThreshold: Uint8Array;
}

export interface EventMultisigOperatorshipTransferred {
  newOperators: Uint8Array[];
  newThreshold: Uint8Array;
  newWeights: Uint8Array[];
}

/** NetworkInfo describes information about a network */
export interface NetworkInfo {
  name: string;
  id: Uint8Array;
}

/**
 * BurnerInfo describes information required to burn token at an burner address
 * that is deposited by an user
 */
export interface BurnerInfo {
  burnerAddress: Uint8Array;
  tokenAddress: Uint8Array;
  destinationChain: string;
  symbol: string;
  asset: string;
  salt: Uint8Array;
}

/** ERC20Deposit contains information for an ERC20 deposit */
export interface ERC20Deposit {
  txId: Uint8Array;
  amount: Uint8Array;
  asset: string;
  destinationChain: string;
  burnerAddress: Uint8Array;
  logIndex: Long;
}

/** ERC20TokenMetadata describes information about an ERC20 token */
export interface ERC20TokenMetadata {
  asset: string;
  chainId: Uint8Array;
  details?: TokenDetails | undefined;
  tokenAddress: string;
  txHash: string;
  status: Status;
  isExternal: boolean;
  burnerCode: Uint8Array;
}

export interface TransactionMetadata {
  rawTx: Uint8Array;
  pubKey: Uint8Array;
}

export interface Command {
  id: Uint8Array;
  /** @deprecated */
  command: string;
  params: Uint8Array;
  keyId: string;
  maxGasCost: number;
  type: CommandType;
}

export interface CommandBatchMetadata {
  id: Uint8Array;
  commandIds: Uint8Array[];
  data: Uint8Array;
  sigHash: Uint8Array;
  status: BatchedCommandsStatus;
  keyId: string;
  prevBatchedCommandsId: Uint8Array;
  signature?: Any | undefined;
}

/**
 * SigMetadata stores necessary information for external apps to map signature
 * results to evm relay transaction types
 */
export interface SigMetadata {
  type: SigType;
  chain: string;
  commandBatchId: Uint8Array;
}

/** TransferKey contains information for a transfer operatorship */
export interface TransferKey {
  txId: Uint8Array;
  nextKeyId: string;
}

export interface Asset {
  chain: string;
  name: string;
}

export interface TokenDetails {
  tokenName: string;
  symbol: string;
  decimals: number;
  capacity: Uint8Array;
}

export interface Gateway {
  address: Uint8Array;
}

export interface PollMetadata {
  chain: string;
  txId: Uint8Array;
}

function createBaseVoteEvents(): VoteEvents {
  return { chain: "", events: [] };
}

export const VoteEvents = {
  encode(
    message: VoteEvents,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    for (const v of message.events) {
      Event.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VoteEvents {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVoteEvents();
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

          message.events.push(Event.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VoteEvents {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      events: globalThis.Array.isArray(object?.events)
        ? object.events.map((e: any) => Event.fromJSON(e))
        : [],
    };
  },

  toJSON(message: VoteEvents): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.events?.length) {
      obj.events = message.events.map((e) => Event.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VoteEvents>, I>>(base?: I): VoteEvents {
    return VoteEvents.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VoteEvents>, I>>(
    object: I
  ): VoteEvents {
    const message = createBaseVoteEvents();
    message.chain = object.chain ?? "";
    message.events = object.events?.map((e) => Event.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEvent(): Event {
  return {
    chain: "",
    txId: new Uint8Array(0),
    index: Long.UZERO,
    status: 0,
    tokenSent: undefined,
    contractCall: undefined,
    contractCallWithToken: undefined,
    transfer: undefined,
    tokenDeployed: undefined,
    multisigOwnershipTransferred: undefined,
    multisigOperatorshipTransferred: undefined,
  };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(18).bytes(message.txId);
    }
    if (!message.index.equals(Long.UZERO)) {
      writer.uint32(24).uint64(message.index);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.tokenSent !== undefined) {
      EventTokenSent.encode(
        message.tokenSent,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.contractCall !== undefined) {
      EventContractCall.encode(
        message.contractCall,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.contractCallWithToken !== undefined) {
      EventContractCallWithToken.encode(
        message.contractCallWithToken,
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.transfer !== undefined) {
      EventTransfer.encode(message.transfer, writer.uint32(66).fork()).ldelim();
    }
    if (message.tokenDeployed !== undefined) {
      EventTokenDeployed.encode(
        message.tokenDeployed,
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.multisigOwnershipTransferred !== undefined) {
      EventMultisigOwnershipTransferred.encode(
        message.multisigOwnershipTransferred,
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.multisigOperatorshipTransferred !== undefined) {
      EventMultisigOperatorshipTransferred.encode(
        message.multisigOperatorshipTransferred,
        writer.uint32(90).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
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

          message.txId = reader.bytes();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.index = reader.uint64() as Long;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.tokenSent = EventTokenSent.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.contractCall = EventContractCall.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.contractCallWithToken = EventContractCallWithToken.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.transfer = EventTransfer.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.tokenDeployed = EventTokenDeployed.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.multisigOwnershipTransferred =
            EventMultisigOwnershipTransferred.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.multisigOperatorshipTransferred =
            EventMultisigOperatorshipTransferred.decode(
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

  fromJSON(object: any): Event {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
      index: isSet(object.index) ? Long.fromValue(object.index) : Long.UZERO,
      status: isSet(object.status) ? event_StatusFromJSON(object.status) : 0,
      tokenSent: isSet(object.tokenSent)
        ? EventTokenSent.fromJSON(object.tokenSent)
        : undefined,
      contractCall: isSet(object.contractCall)
        ? EventContractCall.fromJSON(object.contractCall)
        : undefined,
      contractCallWithToken: isSet(object.contractCallWithToken)
        ? EventContractCallWithToken.fromJSON(object.contractCallWithToken)
        : undefined,
      transfer: isSet(object.transfer)
        ? EventTransfer.fromJSON(object.transfer)
        : undefined,
      tokenDeployed: isSet(object.tokenDeployed)
        ? EventTokenDeployed.fromJSON(object.tokenDeployed)
        : undefined,
      multisigOwnershipTransferred: isSet(object.multisigOwnershipTransferred)
        ? EventMultisigOwnershipTransferred.fromJSON(
            object.multisigOwnershipTransferred
          )
        : undefined,
      multisigOperatorshipTransferred: isSet(
        object.multisigOperatorshipTransferred
      )
        ? EventMultisigOperatorshipTransferred.fromJSON(
            object.multisigOperatorshipTransferred
          )
        : undefined,
    };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    if (!message.index.equals(Long.UZERO)) {
      obj.index = (message.index || Long.UZERO).toString();
    }
    if (message.status !== 0) {
      obj.status = event_StatusToJSON(message.status);
    }
    if (message.tokenSent !== undefined) {
      obj.tokenSent = EventTokenSent.toJSON(message.tokenSent);
    }
    if (message.contractCall !== undefined) {
      obj.contractCall = EventContractCall.toJSON(message.contractCall);
    }
    if (message.contractCallWithToken !== undefined) {
      obj.contractCallWithToken = EventContractCallWithToken.toJSON(
        message.contractCallWithToken
      );
    }
    if (message.transfer !== undefined) {
      obj.transfer = EventTransfer.toJSON(message.transfer);
    }
    if (message.tokenDeployed !== undefined) {
      obj.tokenDeployed = EventTokenDeployed.toJSON(message.tokenDeployed);
    }
    if (message.multisigOwnershipTransferred !== undefined) {
      obj.multisigOwnershipTransferred =
        EventMultisigOwnershipTransferred.toJSON(
          message.multisigOwnershipTransferred
        );
    }
    if (message.multisigOperatorshipTransferred !== undefined) {
      obj.multisigOperatorshipTransferred =
        EventMultisigOperatorshipTransferred.toJSON(
          message.multisigOperatorshipTransferred
        );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Event>, I>>(base?: I): Event {
    return Event.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event {
    const message = createBaseEvent();
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
    message.index =
      object.index !== undefined && object.index !== null
        ? Long.fromValue(object.index)
        : Long.UZERO;
    message.status = object.status ?? 0;
    message.tokenSent =
      object.tokenSent !== undefined && object.tokenSent !== null
        ? EventTokenSent.fromPartial(object.tokenSent)
        : undefined;
    message.contractCall =
      object.contractCall !== undefined && object.contractCall !== null
        ? EventContractCall.fromPartial(object.contractCall)
        : undefined;
    message.contractCallWithToken =
      object.contractCallWithToken !== undefined &&
      object.contractCallWithToken !== null
        ? EventContractCallWithToken.fromPartial(object.contractCallWithToken)
        : undefined;
    message.transfer =
      object.transfer !== undefined && object.transfer !== null
        ? EventTransfer.fromPartial(object.transfer)
        : undefined;
    message.tokenDeployed =
      object.tokenDeployed !== undefined && object.tokenDeployed !== null
        ? EventTokenDeployed.fromPartial(object.tokenDeployed)
        : undefined;
    message.multisigOwnershipTransferred =
      object.multisigOwnershipTransferred !== undefined &&
      object.multisigOwnershipTransferred !== null
        ? EventMultisigOwnershipTransferred.fromPartial(
            object.multisigOwnershipTransferred
          )
        : undefined;
    message.multisigOperatorshipTransferred =
      object.multisigOperatorshipTransferred !== undefined &&
      object.multisigOperatorshipTransferred !== null
        ? EventMultisigOperatorshipTransferred.fromPartial(
            object.multisigOperatorshipTransferred
          )
        : undefined;
    return message;
  },
};

function createBaseEventTokenSent(): EventTokenSent {
  return {
    sender: new Uint8Array(0),
    destinationChain: "",
    destinationAddress: "",
    symbol: "",
    amount: new Uint8Array(0),
  };
}

export const EventTokenSent = {
  encode(
    message: EventTokenSent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(18).string(message.destinationChain);
    }
    if (message.destinationAddress !== "") {
      writer.uint32(26).string(message.destinationAddress);
    }
    if (message.symbol !== "") {
      writer.uint32(34).string(message.symbol);
    }
    if (message.amount.length !== 0) {
      writer.uint32(42).bytes(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventTokenSent {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventTokenSent();
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

          message.destinationChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.destinationAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.amount = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventTokenSent {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      destinationAddress: isSet(object.destinationAddress)
        ? globalThis.String(object.destinationAddress)
        : "",
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      amount: isSet(object.amount)
        ? bytesFromBase64(object.amount)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventTokenSent): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.destinationAddress !== "") {
      obj.destinationAddress = message.destinationAddress;
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.amount.length !== 0) {
      obj.amount = base64FromBytes(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventTokenSent>, I>>(
    base?: I
  ): EventTokenSent {
    return EventTokenSent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventTokenSent>, I>>(
    object: I
  ): EventTokenSent {
    const message = createBaseEventTokenSent();
    message.sender = object.sender ?? new Uint8Array(0);
    message.destinationChain = object.destinationChain ?? "";
    message.destinationAddress = object.destinationAddress ?? "";
    message.symbol = object.symbol ?? "";
    message.amount = object.amount ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventContractCall(): EventContractCall {
  return {
    sender: new Uint8Array(0),
    destinationChain: "",
    contractAddress: "",
    payloadHash: new Uint8Array(0),
  };
}

export const EventContractCall = {
  encode(
    message: EventContractCall,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(18).string(message.destinationChain);
    }
    if (message.contractAddress !== "") {
      writer.uint32(26).string(message.contractAddress);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(34).bytes(message.payloadHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventContractCall {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventContractCall();
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

          message.destinationChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contractAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.payloadHash = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventContractCall {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      contractAddress: isSet(object.contractAddress)
        ? globalThis.String(object.contractAddress)
        : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventContractCall): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    if (message.payloadHash.length !== 0) {
      obj.payloadHash = base64FromBytes(message.payloadHash);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventContractCall>, I>>(
    base?: I
  ): EventContractCall {
    return EventContractCall.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventContractCall>, I>>(
    object: I
  ): EventContractCall {
    const message = createBaseEventContractCall();
    message.sender = object.sender ?? new Uint8Array(0);
    message.destinationChain = object.destinationChain ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventContractCallWithToken(): EventContractCallWithToken {
  return {
    sender: new Uint8Array(0),
    destinationChain: "",
    contractAddress: "",
    payloadHash: new Uint8Array(0),
    symbol: "",
    amount: new Uint8Array(0),
  };
}

export const EventContractCallWithToken = {
  encode(
    message: EventContractCallWithToken,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.destinationChain !== "") {
      writer.uint32(18).string(message.destinationChain);
    }
    if (message.contractAddress !== "") {
      writer.uint32(26).string(message.contractAddress);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(34).bytes(message.payloadHash);
    }
    if (message.symbol !== "") {
      writer.uint32(42).string(message.symbol);
    }
    if (message.amount.length !== 0) {
      writer.uint32(50).bytes(message.amount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): EventContractCallWithToken {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventContractCallWithToken();
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

          message.destinationChain = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contractAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.payloadHash = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.amount = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventContractCallWithToken {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      contractAddress: isSet(object.contractAddress)
        ? globalThis.String(object.contractAddress)
        : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(0),
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      amount: isSet(object.amount)
        ? bytesFromBase64(object.amount)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventContractCallWithToken): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    if (message.payloadHash.length !== 0) {
      obj.payloadHash = base64FromBytes(message.payloadHash);
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.amount.length !== 0) {
      obj.amount = base64FromBytes(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventContractCallWithToken>, I>>(
    base?: I
  ): EventContractCallWithToken {
    return EventContractCallWithToken.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventContractCallWithToken>, I>>(
    object: I
  ): EventContractCallWithToken {
    const message = createBaseEventContractCallWithToken();
    message.sender = object.sender ?? new Uint8Array(0);
    message.destinationChain = object.destinationChain ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array(0);
    message.symbol = object.symbol ?? "";
    message.amount = object.amount ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventTransfer(): EventTransfer {
  return { to: new Uint8Array(0), amount: new Uint8Array(0) };
}

export const EventTransfer = {
  encode(
    message: EventTransfer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.to.length !== 0) {
      writer.uint32(10).bytes(message.to);
    }
    if (message.amount.length !== 0) {
      writer.uint32(18).bytes(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventTransfer {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventTransfer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.to = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.amount = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventTransfer {
    return {
      to: isSet(object.to) ? bytesFromBase64(object.to) : new Uint8Array(0),
      amount: isSet(object.amount)
        ? bytesFromBase64(object.amount)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventTransfer): unknown {
    const obj: any = {};
    if (message.to.length !== 0) {
      obj.to = base64FromBytes(message.to);
    }
    if (message.amount.length !== 0) {
      obj.amount = base64FromBytes(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventTransfer>, I>>(
    base?: I
  ): EventTransfer {
    return EventTransfer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventTransfer>, I>>(
    object: I
  ): EventTransfer {
    const message = createBaseEventTransfer();
    message.to = object.to ?? new Uint8Array(0);
    message.amount = object.amount ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventTokenDeployed(): EventTokenDeployed {
  return { symbol: "", tokenAddress: new Uint8Array(0) };
}

export const EventTokenDeployed = {
  encode(
    message: EventTokenDeployed,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    if (message.tokenAddress.length !== 0) {
      writer.uint32(18).bytes(message.tokenAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventTokenDeployed {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventTokenDeployed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenAddress = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventTokenDeployed {
    return {
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      tokenAddress: isSet(object.tokenAddress)
        ? bytesFromBase64(object.tokenAddress)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventTokenDeployed): unknown {
    const obj: any = {};
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.tokenAddress.length !== 0) {
      obj.tokenAddress = base64FromBytes(message.tokenAddress);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventTokenDeployed>, I>>(
    base?: I
  ): EventTokenDeployed {
    return EventTokenDeployed.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EventTokenDeployed>, I>>(
    object: I
  ): EventTokenDeployed {
    const message = createBaseEventTokenDeployed();
    message.symbol = object.symbol ?? "";
    message.tokenAddress = object.tokenAddress ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventMultisigOwnershipTransferred(): EventMultisigOwnershipTransferred {
  return {
    preOwners: [],
    prevThreshold: new Uint8Array(0),
    newOwners: [],
    newThreshold: new Uint8Array(0),
  };
}

export const EventMultisigOwnershipTransferred = {
  encode(
    message: EventMultisigOwnershipTransferred,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.preOwners) {
      writer.uint32(10).bytes(v!);
    }
    if (message.prevThreshold.length !== 0) {
      writer.uint32(18).bytes(message.prevThreshold);
    }
    for (const v of message.newOwners) {
      writer.uint32(26).bytes(v!);
    }
    if (message.newThreshold.length !== 0) {
      writer.uint32(34).bytes(message.newThreshold);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): EventMultisigOwnershipTransferred {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventMultisigOwnershipTransferred();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.preOwners.push(reader.bytes());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.prevThreshold = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.newOwners.push(reader.bytes());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.newThreshold = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventMultisigOwnershipTransferred {
    return {
      preOwners: globalThis.Array.isArray(object?.preOwners)
        ? object.preOwners.map((e: any) => bytesFromBase64(e))
        : [],
      prevThreshold: isSet(object.prevThreshold)
        ? bytesFromBase64(object.prevThreshold)
        : new Uint8Array(0),
      newOwners: globalThis.Array.isArray(object?.newOwners)
        ? object.newOwners.map((e: any) => bytesFromBase64(e))
        : [],
      newThreshold: isSet(object.newThreshold)
        ? bytesFromBase64(object.newThreshold)
        : new Uint8Array(0),
    };
  },

  toJSON(message: EventMultisigOwnershipTransferred): unknown {
    const obj: any = {};
    if (message.preOwners?.length) {
      obj.preOwners = message.preOwners.map((e) => base64FromBytes(e));
    }
    if (message.prevThreshold.length !== 0) {
      obj.prevThreshold = base64FromBytes(message.prevThreshold);
    }
    if (message.newOwners?.length) {
      obj.newOwners = message.newOwners.map((e) => base64FromBytes(e));
    }
    if (message.newThreshold.length !== 0) {
      obj.newThreshold = base64FromBytes(message.newThreshold);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventMultisigOwnershipTransferred>, I>>(
    base?: I
  ): EventMultisigOwnershipTransferred {
    return EventMultisigOwnershipTransferred.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<EventMultisigOwnershipTransferred>, I>,
  >(object: I): EventMultisigOwnershipTransferred {
    const message = createBaseEventMultisigOwnershipTransferred();
    message.preOwners = object.preOwners?.map((e) => e) || [];
    message.prevThreshold = object.prevThreshold ?? new Uint8Array(0);
    message.newOwners = object.newOwners?.map((e) => e) || [];
    message.newThreshold = object.newThreshold ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventMultisigOperatorshipTransferred(): EventMultisigOperatorshipTransferred {
  return { newOperators: [], newThreshold: new Uint8Array(0), newWeights: [] };
}

export const EventMultisigOperatorshipTransferred = {
  encode(
    message: EventMultisigOperatorshipTransferred,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.newOperators) {
      writer.uint32(26).bytes(v!);
    }
    if (message.newThreshold.length !== 0) {
      writer.uint32(34).bytes(message.newThreshold);
    }
    for (const v of message.newWeights) {
      writer.uint32(42).bytes(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): EventMultisigOperatorshipTransferred {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventMultisigOperatorshipTransferred();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          if (tag !== 26) {
            break;
          }

          message.newOperators.push(reader.bytes());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.newThreshold = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.newWeights.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventMultisigOperatorshipTransferred {
    return {
      newOperators: globalThis.Array.isArray(object?.newOperators)
        ? object.newOperators.map((e: any) => bytesFromBase64(e))
        : [],
      newThreshold: isSet(object.newThreshold)
        ? bytesFromBase64(object.newThreshold)
        : new Uint8Array(0),
      newWeights: globalThis.Array.isArray(object?.newWeights)
        ? object.newWeights.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: EventMultisigOperatorshipTransferred): unknown {
    const obj: any = {};
    if (message.newOperators?.length) {
      obj.newOperators = message.newOperators.map((e) => base64FromBytes(e));
    }
    if (message.newThreshold.length !== 0) {
      obj.newThreshold = base64FromBytes(message.newThreshold);
    }
    if (message.newWeights?.length) {
      obj.newWeights = message.newWeights.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventMultisigOperatorshipTransferred>, I>>(
    base?: I
  ): EventMultisigOperatorshipTransferred {
    return EventMultisigOperatorshipTransferred.fromPartial(
      base ?? ({} as any)
    );
  },
  fromPartial<
    I extends Exact<DeepPartial<EventMultisigOperatorshipTransferred>, I>,
  >(object: I): EventMultisigOperatorshipTransferred {
    const message = createBaseEventMultisigOperatorshipTransferred();
    message.newOperators = object.newOperators?.map((e) => e) || [];
    message.newThreshold = object.newThreshold ?? new Uint8Array(0);
    message.newWeights = object.newWeights?.map((e) => e) || [];
    return message;
  },
};

function createBaseNetworkInfo(): NetworkInfo {
  return { name: "", id: new Uint8Array(0) };
}

export const NetworkInfo = {
  encode(
    message: NetworkInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.id.length !== 0) {
      writer.uint32(18).bytes(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NetworkInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNetworkInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NetworkInfo {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(0),
    };
  },

  toJSON(message: NetworkInfo): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.id.length !== 0) {
      obj.id = base64FromBytes(message.id);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NetworkInfo>, I>>(base?: I): NetworkInfo {
    return NetworkInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NetworkInfo>, I>>(
    object: I
  ): NetworkInfo {
    const message = createBaseNetworkInfo();
    message.name = object.name ?? "";
    message.id = object.id ?? new Uint8Array(0);
    return message;
  },
};

function createBaseBurnerInfo(): BurnerInfo {
  return {
    burnerAddress: new Uint8Array(0),
    tokenAddress: new Uint8Array(0),
    destinationChain: "",
    symbol: "",
    asset: "",
    salt: new Uint8Array(0),
  };
}

export const BurnerInfo = {
  encode(
    message: BurnerInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.burnerAddress.length !== 0) {
      writer.uint32(10).bytes(message.burnerAddress);
    }
    if (message.tokenAddress.length !== 0) {
      writer.uint32(18).bytes(message.tokenAddress);
    }
    if (message.destinationChain !== "") {
      writer.uint32(26).string(message.destinationChain);
    }
    if (message.symbol !== "") {
      writer.uint32(34).string(message.symbol);
    }
    if (message.asset !== "") {
      writer.uint32(42).string(message.asset);
    }
    if (message.salt.length !== 0) {
      writer.uint32(50).bytes(message.salt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BurnerInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBurnerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.burnerAddress = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenAddress = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.destinationChain = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.asset = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.salt = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BurnerInfo {
    return {
      burnerAddress: isSet(object.burnerAddress)
        ? bytesFromBase64(object.burnerAddress)
        : new Uint8Array(0),
      tokenAddress: isSet(object.tokenAddress)
        ? bytesFromBase64(object.tokenAddress)
        : new Uint8Array(0),
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
      salt: isSet(object.salt)
        ? bytesFromBase64(object.salt)
        : new Uint8Array(0),
    };
  },

  toJSON(message: BurnerInfo): unknown {
    const obj: any = {};
    if (message.burnerAddress.length !== 0) {
      obj.burnerAddress = base64FromBytes(message.burnerAddress);
    }
    if (message.tokenAddress.length !== 0) {
      obj.tokenAddress = base64FromBytes(message.tokenAddress);
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    if (message.salt.length !== 0) {
      obj.salt = base64FromBytes(message.salt);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BurnerInfo>, I>>(base?: I): BurnerInfo {
    return BurnerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BurnerInfo>, I>>(
    object: I
  ): BurnerInfo {
    const message = createBaseBurnerInfo();
    message.burnerAddress = object.burnerAddress ?? new Uint8Array(0);
    message.tokenAddress = object.tokenAddress ?? new Uint8Array(0);
    message.destinationChain = object.destinationChain ?? "";
    message.symbol = object.symbol ?? "";
    message.asset = object.asset ?? "";
    message.salt = object.salt ?? new Uint8Array(0);
    return message;
  },
};

function createBaseERC20Deposit(): ERC20Deposit {
  return {
    txId: new Uint8Array(0),
    amount: new Uint8Array(0),
    asset: "",
    destinationChain: "",
    burnerAddress: new Uint8Array(0),
    logIndex: Long.UZERO,
  };
}

export const ERC20Deposit = {
  encode(
    message: ERC20Deposit,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.amount.length !== 0) {
      writer.uint32(18).bytes(message.amount);
    }
    if (message.asset !== "") {
      writer.uint32(26).string(message.asset);
    }
    if (message.destinationChain !== "") {
      writer.uint32(34).string(message.destinationChain);
    }
    if (message.burnerAddress.length !== 0) {
      writer.uint32(42).bytes(message.burnerAddress);
    }
    if (!message.logIndex.equals(Long.UZERO)) {
      writer.uint32(48).uint64(message.logIndex);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20Deposit {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20Deposit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.txId = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.amount = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.asset = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.destinationChain = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.burnerAddress = reader.bytes();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.logIndex = reader.uint64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ERC20Deposit {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
      amount: isSet(object.amount)
        ? bytesFromBase64(object.amount)
        : new Uint8Array(0),
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
      destinationChain: isSet(object.destinationChain)
        ? globalThis.String(object.destinationChain)
        : "",
      burnerAddress: isSet(object.burnerAddress)
        ? bytesFromBase64(object.burnerAddress)
        : new Uint8Array(0),
      logIndex: isSet(object.logIndex)
        ? Long.fromValue(object.logIndex)
        : Long.UZERO,
    };
  },

  toJSON(message: ERC20Deposit): unknown {
    const obj: any = {};
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    if (message.amount.length !== 0) {
      obj.amount = base64FromBytes(message.amount);
    }
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    if (message.destinationChain !== "") {
      obj.destinationChain = message.destinationChain;
    }
    if (message.burnerAddress.length !== 0) {
      obj.burnerAddress = base64FromBytes(message.burnerAddress);
    }
    if (!message.logIndex.equals(Long.UZERO)) {
      obj.logIndex = (message.logIndex || Long.UZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ERC20Deposit>, I>>(
    base?: I
  ): ERC20Deposit {
    return ERC20Deposit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ERC20Deposit>, I>>(
    object: I
  ): ERC20Deposit {
    const message = createBaseERC20Deposit();
    message.txId = object.txId ?? new Uint8Array(0);
    message.amount = object.amount ?? new Uint8Array(0);
    message.asset = object.asset ?? "";
    message.destinationChain = object.destinationChain ?? "";
    message.burnerAddress = object.burnerAddress ?? new Uint8Array(0);
    message.logIndex =
      object.logIndex !== undefined && object.logIndex !== null
        ? Long.fromValue(object.logIndex)
        : Long.UZERO;
    return message;
  },
};

function createBaseERC20TokenMetadata(): ERC20TokenMetadata {
  return {
    asset: "",
    chainId: new Uint8Array(0),
    details: undefined,
    tokenAddress: "",
    txHash: "",
    status: 0,
    isExternal: false,
    burnerCode: new Uint8Array(0),
  };
}

export const ERC20TokenMetadata = {
  encode(
    message: ERC20TokenMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.asset !== "") {
      writer.uint32(10).string(message.asset);
    }
    if (message.chainId.length !== 0) {
      writer.uint32(18).bytes(message.chainId);
    }
    if (message.details !== undefined) {
      TokenDetails.encode(message.details, writer.uint32(26).fork()).ldelim();
    }
    if (message.tokenAddress !== "") {
      writer.uint32(34).string(message.tokenAddress);
    }
    if (message.txHash !== "") {
      writer.uint32(42).string(message.txHash);
    }
    if (message.status !== 0) {
      writer.uint32(56).int32(message.status);
    }
    if (message.isExternal !== false) {
      writer.uint32(64).bool(message.isExternal);
    }
    if (message.burnerCode.length !== 0) {
      writer.uint32(74).bytes(message.burnerCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20TokenMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20TokenMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.asset = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chainId = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.details = TokenDetails.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tokenAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.txHash = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.isExternal = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.burnerCode = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ERC20TokenMetadata {
    return {
      asset: isSet(object.asset) ? globalThis.String(object.asset) : "",
      chainId: isSet(object.chainId)
        ? bytesFromBase64(object.chainId)
        : new Uint8Array(0),
      details: isSet(object.details)
        ? TokenDetails.fromJSON(object.details)
        : undefined,
      tokenAddress: isSet(object.tokenAddress)
        ? globalThis.String(object.tokenAddress)
        : "",
      txHash: isSet(object.txHash) ? globalThis.String(object.txHash) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
      isExternal: isSet(object.isExternal)
        ? globalThis.Boolean(object.isExternal)
        : false,
      burnerCode: isSet(object.burnerCode)
        ? bytesFromBase64(object.burnerCode)
        : new Uint8Array(0),
    };
  },

  toJSON(message: ERC20TokenMetadata): unknown {
    const obj: any = {};
    if (message.asset !== "") {
      obj.asset = message.asset;
    }
    if (message.chainId.length !== 0) {
      obj.chainId = base64FromBytes(message.chainId);
    }
    if (message.details !== undefined) {
      obj.details = TokenDetails.toJSON(message.details);
    }
    if (message.tokenAddress !== "") {
      obj.tokenAddress = message.tokenAddress;
    }
    if (message.txHash !== "") {
      obj.txHash = message.txHash;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    if (message.isExternal !== false) {
      obj.isExternal = message.isExternal;
    }
    if (message.burnerCode.length !== 0) {
      obj.burnerCode = base64FromBytes(message.burnerCode);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ERC20TokenMetadata>, I>>(
    base?: I
  ): ERC20TokenMetadata {
    return ERC20TokenMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ERC20TokenMetadata>, I>>(
    object: I
  ): ERC20TokenMetadata {
    const message = createBaseERC20TokenMetadata();
    message.asset = object.asset ?? "";
    message.chainId = object.chainId ?? new Uint8Array(0);
    message.details =
      object.details !== undefined && object.details !== null
        ? TokenDetails.fromPartial(object.details)
        : undefined;
    message.tokenAddress = object.tokenAddress ?? "";
    message.txHash = object.txHash ?? "";
    message.status = object.status ?? 0;
    message.isExternal = object.isExternal ?? false;
    message.burnerCode = object.burnerCode ?? new Uint8Array(0);
    return message;
  },
};

function createBaseTransactionMetadata(): TransactionMetadata {
  return { rawTx: new Uint8Array(0), pubKey: new Uint8Array(0) };
}

export const TransactionMetadata = {
  encode(
    message: TransactionMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.rawTx.length !== 0) {
      writer.uint32(10).bytes(message.rawTx);
    }
    if (message.pubKey.length !== 0) {
      writer.uint32(18).bytes(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rawTx = reader.bytes();
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

  fromJSON(object: any): TransactionMetadata {
    return {
      rawTx: isSet(object.rawTx)
        ? bytesFromBase64(object.rawTx)
        : new Uint8Array(0),
      pubKey: isSet(object.pubKey)
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array(0),
    };
  },

  toJSON(message: TransactionMetadata): unknown {
    const obj: any = {};
    if (message.rawTx.length !== 0) {
      obj.rawTx = base64FromBytes(message.rawTx);
    }
    if (message.pubKey.length !== 0) {
      obj.pubKey = base64FromBytes(message.pubKey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionMetadata>, I>>(
    base?: I
  ): TransactionMetadata {
    return TransactionMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionMetadata>, I>>(
    object: I
  ): TransactionMetadata {
    const message = createBaseTransactionMetadata();
    message.rawTx = object.rawTx ?? new Uint8Array(0);
    message.pubKey = object.pubKey ?? new Uint8Array(0);
    return message;
  },
};

function createBaseCommand(): Command {
  return {
    id: new Uint8Array(0),
    command: "",
    params: new Uint8Array(0),
    keyId: "",
    maxGasCost: 0,
    type: 0,
  };
}

export const Command = {
  encode(
    message: Command,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
    }
    if (message.command !== "") {
      writer.uint32(18).string(message.command);
    }
    if (message.params.length !== 0) {
      writer.uint32(26).bytes(message.params);
    }
    if (message.keyId !== "") {
      writer.uint32(34).string(message.keyId);
    }
    if (message.maxGasCost !== 0) {
      writer.uint32(40).uint32(message.maxGasCost);
    }
    if (message.type !== 0) {
      writer.uint32(48).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Command {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.command = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.params = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keyId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.maxGasCost = reader.uint32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Command {
    return {
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(0),
      command: isSet(object.command) ? globalThis.String(object.command) : "",
      params: isSet(object.params)
        ? bytesFromBase64(object.params)
        : new Uint8Array(0),
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      maxGasCost: isSet(object.maxGasCost)
        ? globalThis.Number(object.maxGasCost)
        : 0,
      type: isSet(object.type) ? commandTypeFromJSON(object.type) : 0,
    };
  },

  toJSON(message: Command): unknown {
    const obj: any = {};
    if (message.id.length !== 0) {
      obj.id = base64FromBytes(message.id);
    }
    if (message.command !== "") {
      obj.command = message.command;
    }
    if (message.params.length !== 0) {
      obj.params = base64FromBytes(message.params);
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.maxGasCost !== 0) {
      obj.maxGasCost = Math.round(message.maxGasCost);
    }
    if (message.type !== 0) {
      obj.type = commandTypeToJSON(message.type);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Command>, I>>(base?: I): Command {
    return Command.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Command>, I>>(object: I): Command {
    const message = createBaseCommand();
    message.id = object.id ?? new Uint8Array(0);
    message.command = object.command ?? "";
    message.params = object.params ?? new Uint8Array(0);
    message.keyId = object.keyId ?? "";
    message.maxGasCost = object.maxGasCost ?? 0;
    message.type = object.type ?? 0;
    return message;
  },
};

function createBaseCommandBatchMetadata(): CommandBatchMetadata {
  return {
    id: new Uint8Array(0),
    commandIds: [],
    data: new Uint8Array(0),
    sigHash: new Uint8Array(0),
    status: 0,
    keyId: "",
    prevBatchedCommandsId: new Uint8Array(0),
    signature: undefined,
  };
}

export const CommandBatchMetadata = {
  encode(
    message: CommandBatchMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
    }
    for (const v of message.commandIds) {
      writer.uint32(18).bytes(v!);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    if (message.sigHash.length !== 0) {
      writer.uint32(34).bytes(message.sigHash);
    }
    if (message.status !== 0) {
      writer.uint32(40).int32(message.status);
    }
    if (message.keyId !== "") {
      writer.uint32(50).string(message.keyId);
    }
    if (message.prevBatchedCommandsId.length !== 0) {
      writer.uint32(58).bytes(message.prevBatchedCommandsId);
    }
    if (message.signature !== undefined) {
      Any.encode(message.signature, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommandBatchMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommandBatchMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.commandIds.push(reader.bytes());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.sigHash = reader.bytes();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.keyId = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.prevBatchedCommandsId = reader.bytes();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.signature = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CommandBatchMetadata {
    return {
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(0),
      commandIds: globalThis.Array.isArray(object?.commandIds)
        ? object.commandIds.map((e: any) => bytesFromBase64(e))
        : [],
      data: isSet(object.data)
        ? bytesFromBase64(object.data)
        : new Uint8Array(0),
      sigHash: isSet(object.sigHash)
        ? bytesFromBase64(object.sigHash)
        : new Uint8Array(0),
      status: isSet(object.status)
        ? batchedCommandsStatusFromJSON(object.status)
        : 0,
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      prevBatchedCommandsId: isSet(object.prevBatchedCommandsId)
        ? bytesFromBase64(object.prevBatchedCommandsId)
        : new Uint8Array(0),
      signature: isSet(object.signature)
        ? Any.fromJSON(object.signature)
        : undefined,
    };
  },

  toJSON(message: CommandBatchMetadata): unknown {
    const obj: any = {};
    if (message.id.length !== 0) {
      obj.id = base64FromBytes(message.id);
    }
    if (message.commandIds?.length) {
      obj.commandIds = message.commandIds.map((e) => base64FromBytes(e));
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    if (message.sigHash.length !== 0) {
      obj.sigHash = base64FromBytes(message.sigHash);
    }
    if (message.status !== 0) {
      obj.status = batchedCommandsStatusToJSON(message.status);
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.prevBatchedCommandsId.length !== 0) {
      obj.prevBatchedCommandsId = base64FromBytes(
        message.prevBatchedCommandsId
      );
    }
    if (message.signature !== undefined) {
      obj.signature = Any.toJSON(message.signature);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CommandBatchMetadata>, I>>(
    base?: I
  ): CommandBatchMetadata {
    return CommandBatchMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CommandBatchMetadata>, I>>(
    object: I
  ): CommandBatchMetadata {
    const message = createBaseCommandBatchMetadata();
    message.id = object.id ?? new Uint8Array(0);
    message.commandIds = object.commandIds?.map((e) => e) || [];
    message.data = object.data ?? new Uint8Array(0);
    message.sigHash = object.sigHash ?? new Uint8Array(0);
    message.status = object.status ?? 0;
    message.keyId = object.keyId ?? "";
    message.prevBatchedCommandsId =
      object.prevBatchedCommandsId ?? new Uint8Array(0);
    message.signature =
      object.signature !== undefined && object.signature !== null
        ? Any.fromPartial(object.signature)
        : undefined;
    return message;
  },
};

function createBaseSigMetadata(): SigMetadata {
  return { type: 0, chain: "", commandBatchId: new Uint8Array(0) };
}

export const SigMetadata = {
  encode(
    message: SigMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.commandBatchId.length !== 0) {
      writer.uint32(26).bytes(message.commandBatchId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SigMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSigMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
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

          message.commandBatchId = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SigMetadata {
    return {
      type: isSet(object.type) ? sigTypeFromJSON(object.type) : 0,
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      commandBatchId: isSet(object.commandBatchId)
        ? bytesFromBase64(object.commandBatchId)
        : new Uint8Array(0),
    };
  },

  toJSON(message: SigMetadata): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = sigTypeToJSON(message.type);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.commandBatchId.length !== 0) {
      obj.commandBatchId = base64FromBytes(message.commandBatchId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SigMetadata>, I>>(base?: I): SigMetadata {
    return SigMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SigMetadata>, I>>(
    object: I
  ): SigMetadata {
    const message = createBaseSigMetadata();
    message.type = object.type ?? 0;
    message.chain = object.chain ?? "";
    message.commandBatchId = object.commandBatchId ?? new Uint8Array(0);
    return message;
  },
};

function createBaseTransferKey(): TransferKey {
  return { txId: new Uint8Array(0), nextKeyId: "" };
}

export const TransferKey = {
  encode(
    message: TransferKey,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.txId.length !== 0) {
      writer.uint32(10).bytes(message.txId);
    }
    if (message.nextKeyId !== "") {
      writer.uint32(26).string(message.nextKeyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferKey {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.txId = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nextKeyId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferKey {
    return {
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
      nextKeyId: isSet(object.nextKeyId)
        ? globalThis.String(object.nextKeyId)
        : "",
    };
  },

  toJSON(message: TransferKey): unknown {
    const obj: any = {};
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    if (message.nextKeyId !== "") {
      obj.nextKeyId = message.nextKeyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferKey>, I>>(base?: I): TransferKey {
    return TransferKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferKey>, I>>(
    object: I
  ): TransferKey {
    const message = createBaseTransferKey();
    message.txId = object.txId ?? new Uint8Array(0);
    message.nextKeyId = object.nextKeyId ?? "";
    return message;
  },
};

function createBaseAsset(): Asset {
  return { chain: "", name: "" };
}

export const Asset = {
  encode(message: Asset, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Asset {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAsset();
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

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Asset {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
    };
  },

  toJSON(message: Asset): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset>, I>>(base?: I): Asset {
    return Asset.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset>, I>>(object: I): Asset {
    const message = createBaseAsset();
    message.chain = object.chain ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseTokenDetails(): TokenDetails {
  return {
    tokenName: "",
    symbol: "",
    decimals: 0,
    capacity: new Uint8Array(0),
  };
}

export const TokenDetails = {
  encode(
    message: TokenDetails,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenName !== "") {
      writer.uint32(10).string(message.tokenName);
    }
    if (message.symbol !== "") {
      writer.uint32(18).string(message.symbol);
    }
    if (message.decimals !== 0) {
      writer.uint32(24).uint32(message.decimals);
    }
    if (message.capacity.length !== 0) {
      writer.uint32(34).bytes(message.capacity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenDetails {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tokenName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.decimals = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.capacity = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenDetails {
    return {
      tokenName: isSet(object.tokenName)
        ? globalThis.String(object.tokenName)
        : "",
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      decimals: isSet(object.decimals) ? globalThis.Number(object.decimals) : 0,
      capacity: isSet(object.capacity)
        ? bytesFromBase64(object.capacity)
        : new Uint8Array(0),
    };
  },

  toJSON(message: TokenDetails): unknown {
    const obj: any = {};
    if (message.tokenName !== "") {
      obj.tokenName = message.tokenName;
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.decimals !== 0) {
      obj.decimals = Math.round(message.decimals);
    }
    if (message.capacity.length !== 0) {
      obj.capacity = base64FromBytes(message.capacity);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenDetails>, I>>(
    base?: I
  ): TokenDetails {
    return TokenDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenDetails>, I>>(
    object: I
  ): TokenDetails {
    const message = createBaseTokenDetails();
    message.tokenName = object.tokenName ?? "";
    message.symbol = object.symbol ?? "";
    message.decimals = object.decimals ?? 0;
    message.capacity = object.capacity ?? new Uint8Array(0);
    return message;
  },
};

function createBaseGateway(): Gateway {
  return { address: new Uint8Array(0) };
}

export const Gateway = {
  encode(
    message: Gateway,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Gateway {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGateway();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): Gateway {
    return {
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Gateway): unknown {
    const obj: any = {};
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Gateway>, I>>(base?: I): Gateway {
    return Gateway.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Gateway>, I>>(object: I): Gateway {
    const message = createBaseGateway();
    message.address = object.address ?? new Uint8Array(0);
    return message;
  },
};

function createBasePollMetadata(): PollMetadata {
  return { chain: "", txId: new Uint8Array(0) };
}

export const PollMetadata = {
  encode(
    message: PollMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.txId.length !== 0) {
      writer.uint32(18).bytes(message.txId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollMetadata();
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

  fromJSON(object: any): PollMetadata {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      txId: isSet(object.txId)
        ? bytesFromBase64(object.txId)
        : new Uint8Array(0),
    };
  },

  toJSON(message: PollMetadata): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.txId.length !== 0) {
      obj.txId = base64FromBytes(message.txId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PollMetadata>, I>>(
    base?: I
  ): PollMetadata {
    return PollMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PollMetadata>, I>>(
    object: I
  ): PollMetadata {
    const message = createBasePollMetadata();
    message.chain = object.chain ?? "";
    message.txId = object.txId ?? new Uint8Array(0);
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
