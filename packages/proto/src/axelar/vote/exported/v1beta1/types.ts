/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Any } from "../../../../google/protobuf/any";
import { Snapshot } from "../../../snapshot/exported/v1beta1/types";
import { Threshold } from "../../../utils/v1beta1/threshold";

export const protobufPackage = "axelar.vote.exported.v1beta1";

export enum PollState {
  POLL_STATE_UNSPECIFIED = 0,
  POLL_STATE_PENDING = 1,
  POLL_STATE_COMPLETED = 2,
  POLL_STATE_FAILED = 3,
  UNRECOGNIZED = -1,
}

export function pollStateFromJSON(object: any): PollState {
  switch (object) {
    case 0:
    case "POLL_STATE_UNSPECIFIED":
      return PollState.POLL_STATE_UNSPECIFIED;
    case 1:
    case "POLL_STATE_PENDING":
      return PollState.POLL_STATE_PENDING;
    case 2:
    case "POLL_STATE_COMPLETED":
      return PollState.POLL_STATE_COMPLETED;
    case 3:
    case "POLL_STATE_FAILED":
      return PollState.POLL_STATE_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PollState.UNRECOGNIZED;
  }
}

export function pollStateToJSON(object: PollState): string {
  switch (object) {
    case PollState.POLL_STATE_UNSPECIFIED:
      return "POLL_STATE_UNSPECIFIED";
    case PollState.POLL_STATE_PENDING:
      return "POLL_STATE_PENDING";
    case PollState.POLL_STATE_COMPLETED:
      return "POLL_STATE_COMPLETED";
    case PollState.POLL_STATE_FAILED:
      return "POLL_STATE_FAILED";
    case PollState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * PollMetadata represents a poll with write-in voting, i.e. the result of the
 * vote can have any data type
 */
export interface PollMetadata {
  expiresAt: Long;
  result?: Any | undefined;
  votingThreshold?: Threshold | undefined;
  state: PollState;
  minVoterCount: Long;
  rewardPoolName: string;
  gracePeriod: Long;
  completedAt: Long;
  id: Long;
  snapshot?: Snapshot | undefined;
  module: string;
  moduleMetadata?: Any | undefined;
}

/**
 * PollKey represents the key data for a poll
 *
 * @deprecated
 */
export interface PollKey {
  module: string;
  id: string;
}

/** PollParticipants should be embedded in poll events in other modules */
export interface PollParticipants {
  pollId: Long;
  participants: Uint8Array[];
}

function createBasePollMetadata(): PollMetadata {
  return {
    expiresAt: Long.ZERO,
    result: undefined,
    votingThreshold: undefined,
    state: 0,
    minVoterCount: Long.ZERO,
    rewardPoolName: "",
    gracePeriod: Long.ZERO,
    completedAt: Long.ZERO,
    id: Long.UZERO,
    snapshot: undefined,
    module: "",
    moduleMetadata: undefined,
  };
}

export const PollMetadata = {
  encode(
    message: PollMetadata,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.expiresAt.isZero()) {
      writer.uint32(24).int64(message.expiresAt);
    }
    if (message.result !== undefined) {
      Any.encode(message.result, writer.uint32(34).fork()).ldelim();
    }
    if (message.votingThreshold !== undefined) {
      Threshold.encode(
        message.votingThreshold,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(48).int32(message.state);
    }
    if (!message.minVoterCount.isZero()) {
      writer.uint32(56).int64(message.minVoterCount);
    }
    if (message.rewardPoolName !== "") {
      writer.uint32(82).string(message.rewardPoolName);
    }
    if (!message.gracePeriod.isZero()) {
      writer.uint32(88).int64(message.gracePeriod);
    }
    if (!message.completedAt.isZero()) {
      writer.uint32(96).int64(message.completedAt);
    }
    if (!message.id.isZero()) {
      writer.uint32(104).uint64(message.id);
    }
    if (message.snapshot !== undefined) {
      Snapshot.encode(message.snapshot, writer.uint32(122).fork()).ldelim();
    }
    if (message.module !== "") {
      writer.uint32(130).string(message.module);
    }
    if (message.moduleMetadata !== undefined) {
      Any.encode(message.moduleMetadata, writer.uint32(138).fork()).ldelim();
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
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiresAt = reader.int64() as Long;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.result = Any.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.votingThreshold = Threshold.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.minVoterCount = reader.int64() as Long;
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.rewardPoolName = reader.string();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.gracePeriod = reader.int64() as Long;
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.completedAt = reader.int64() as Long;
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.id = reader.uint64() as Long;
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.snapshot = Snapshot.decode(reader, reader.uint32());
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.module = reader.string();
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.moduleMetadata = Any.decode(reader, reader.uint32());
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
      expiresAt: isSet(object.expiresAt)
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO,
      result: isSet(object.result) ? Any.fromJSON(object.result) : undefined,
      votingThreshold: isSet(object.votingThreshold)
        ? Threshold.fromJSON(object.votingThreshold)
        : undefined,
      state: isSet(object.state) ? pollStateFromJSON(object.state) : 0,
      minVoterCount: isSet(object.minVoterCount)
        ? Long.fromValue(object.minVoterCount)
        : Long.ZERO,
      rewardPoolName: isSet(object.rewardPoolName)
        ? globalThis.String(object.rewardPoolName)
        : "",
      gracePeriod: isSet(object.gracePeriod)
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO,
      completedAt: isSet(object.completedAt)
        ? Long.fromValue(object.completedAt)
        : Long.ZERO,
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      snapshot: isSet(object.snapshot)
        ? Snapshot.fromJSON(object.snapshot)
        : undefined,
      module: isSet(object.module) ? globalThis.String(object.module) : "",
      moduleMetadata: isSet(object.moduleMetadata)
        ? Any.fromJSON(object.moduleMetadata)
        : undefined,
    };
  },

  toJSON(message: PollMetadata): unknown {
    const obj: any = {};
    if (!message.expiresAt.isZero()) {
      obj.expiresAt = (message.expiresAt || Long.ZERO).toString();
    }
    if (message.result !== undefined) {
      obj.result = Any.toJSON(message.result);
    }
    if (message.votingThreshold !== undefined) {
      obj.votingThreshold = Threshold.toJSON(message.votingThreshold);
    }
    if (message.state !== 0) {
      obj.state = pollStateToJSON(message.state);
    }
    if (!message.minVoterCount.isZero()) {
      obj.minVoterCount = (message.minVoterCount || Long.ZERO).toString();
    }
    if (message.rewardPoolName !== "") {
      obj.rewardPoolName = message.rewardPoolName;
    }
    if (!message.gracePeriod.isZero()) {
      obj.gracePeriod = (message.gracePeriod || Long.ZERO).toString();
    }
    if (!message.completedAt.isZero()) {
      obj.completedAt = (message.completedAt || Long.ZERO).toString();
    }
    if (!message.id.isZero()) {
      obj.id = (message.id || Long.UZERO).toString();
    }
    if (message.snapshot !== undefined) {
      obj.snapshot = Snapshot.toJSON(message.snapshot);
    }
    if (message.module !== "") {
      obj.module = message.module;
    }
    if (message.moduleMetadata !== undefined) {
      obj.moduleMetadata = Any.toJSON(message.moduleMetadata);
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
    message.expiresAt =
      object.expiresAt !== undefined && object.expiresAt !== null
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO;
    message.result =
      object.result !== undefined && object.result !== null
        ? Any.fromPartial(object.result)
        : undefined;
    message.votingThreshold =
      object.votingThreshold !== undefined && object.votingThreshold !== null
        ? Threshold.fromPartial(object.votingThreshold)
        : undefined;
    message.state = object.state ?? 0;
    message.minVoterCount =
      object.minVoterCount !== undefined && object.minVoterCount !== null
        ? Long.fromValue(object.minVoterCount)
        : Long.ZERO;
    message.rewardPoolName = object.rewardPoolName ?? "";
    message.gracePeriod =
      object.gracePeriod !== undefined && object.gracePeriod !== null
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO;
    message.completedAt =
      object.completedAt !== undefined && object.completedAt !== null
        ? Long.fromValue(object.completedAt)
        : Long.ZERO;
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.snapshot =
      object.snapshot !== undefined && object.snapshot !== null
        ? Snapshot.fromPartial(object.snapshot)
        : undefined;
    message.module = object.module ?? "";
    message.moduleMetadata =
      object.moduleMetadata !== undefined && object.moduleMetadata !== null
        ? Any.fromPartial(object.moduleMetadata)
        : undefined;
    return message;
  },
};

function createBasePollKey(): PollKey {
  return { module: "", id: "" };
}

export const PollKey = {
  encode(
    message: PollKey,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.module !== "") {
      writer.uint32(10).string(message.module);
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollKey {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.module = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): PollKey {
    return {
      module: isSet(object.module) ? globalThis.String(object.module) : "",
      id: isSet(object.id) ? globalThis.String(object.id) : "",
    };
  },

  toJSON(message: PollKey): unknown {
    const obj: any = {};
    if (message.module !== "") {
      obj.module = message.module;
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PollKey>, I>>(base?: I): PollKey {
    return PollKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PollKey>, I>>(object: I): PollKey {
    const message = createBasePollKey();
    message.module = object.module ?? "";
    message.id = object.id ?? "";
    return message;
  },
};

function createBasePollParticipants(): PollParticipants {
  return { pollId: Long.UZERO, participants: [] };
}

export const PollParticipants = {
  encode(
    message: PollParticipants,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.pollId.isZero()) {
      writer.uint32(8).uint64(message.pollId);
    }
    for (const v of message.participants) {
      writer.uint32(18).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollParticipants {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollParticipants();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.pollId = reader.uint64() as Long;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.participants.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PollParticipants {
    return {
      pollId: isSet(object.pollId) ? Long.fromValue(object.pollId) : Long.UZERO,
      participants: globalThis.Array.isArray(object?.participants)
        ? object.participants.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: PollParticipants): unknown {
    const obj: any = {};
    if (!message.pollId.isZero()) {
      obj.pollId = (message.pollId || Long.UZERO).toString();
    }
    if (message.participants?.length) {
      obj.participants = message.participants.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PollParticipants>, I>>(
    base?: I
  ): PollParticipants {
    return PollParticipants.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PollParticipants>, I>>(
    object: I
  ): PollParticipants {
    const message = createBasePollParticipants();
    message.pollId =
      object.pollId !== undefined && object.pollId !== null
        ? Long.fromValue(object.pollId)
        : Long.UZERO;
    message.participants = object.participants?.map((e) => e) || [];
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
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
  if (globalThis.Buffer) {
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
