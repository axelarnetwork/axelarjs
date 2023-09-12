/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Timestamp } from "../../../google/protobuf/timestamp";
import {
  KeyState,
  keyStateFromJSON,
  keyStateToJSON,
  MultisigState,
  multisigStateFromJSON,
  multisigStateToJSON,
} from "../exported/v1beta1/types";
import { Params } from "./params";

export const protobufPackage = "axelar.multisig.v1beta1";

export interface KeyIDRequest {
  chain: string;
}

/** KeyIDResponse contains the key ID of the key assigned to a given chain. */
export interface KeyIDResponse {
  keyId: string;
}

export interface NextKeyIDRequest {
  chain: string;
}

/**
 * NextKeyIDResponse contains the key ID for the next rotation on the given
 * chain
 */
export interface NextKeyIDResponse {
  keyId: string;
}

export interface KeyRequest {
  keyId: string;
}

export interface KeygenParticipant {
  address: string;
  weight: Uint8Array;
  pubKey: string;
}

/** KeyResponse contains the key corresponding to a given key id. */
export interface KeyResponse {
  keyId: string;
  state: KeyState;
  startedAt: Long;
  startedAtTimestamp?: Date | undefined;
  thresholdWeight: Uint8Array;
  bondedWeight: Uint8Array;
  /** Keygen participants in descending order by weight */
  participants: KeygenParticipant[];
}

export interface KeygenSessionRequest {
  keyId: string;
}

/** KeygenSessionResponse contains the keygen session info for a given key ID. */
export interface KeygenSessionResponse {
  startedAt: Long;
  startedAtTimestamp?: Date | undefined;
  expiresAt: Long;
  completedAt: Long;
  gracePeriod: Long;
  state: MultisigState;
  keygenThresholdWeight: Uint8Array;
  signingThresholdWeight: Uint8Array;
  bondedWeight: Uint8Array;
  /** Keygen candidates in descending order by weight */
  participants: KeygenParticipant[];
}

/** ParamsRequest represents a message that queries the params */
export interface ParamsRequest {}

export interface ParamsResponse {
  params?: Params | undefined;
}

function createBaseKeyIDRequest(): KeyIDRequest {
  return { chain: "" };
}

export const KeyIDRequest = {
  encode(
    message: KeyIDRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyIDRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyIDRequest();
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

  fromJSON(object: any): KeyIDRequest {
    return { chain: isSet(object.chain) ? String(object.chain) : "" };
  },

  toJSON(message: KeyIDRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyIDRequest>, I>>(
    base?: I
  ): KeyIDRequest {
    return KeyIDRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyIDRequest>, I>>(
    object: I
  ): KeyIDRequest {
    const message = createBaseKeyIDRequest();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseKeyIDResponse(): KeyIDResponse {
  return { keyId: "" };
}

export const KeyIDResponse = {
  encode(
    message: KeyIDResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyIDResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyIDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): KeyIDResponse {
    return { keyId: isSet(object.keyId) ? String(object.keyId) : "" };
  },

  toJSON(message: KeyIDResponse): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyIDResponse>, I>>(
    base?: I
  ): KeyIDResponse {
    return KeyIDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyIDResponse>, I>>(
    object: I
  ): KeyIDResponse {
    const message = createBaseKeyIDResponse();
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseNextKeyIDRequest(): NextKeyIDRequest {
  return { chain: "" };
}

export const NextKeyIDRequest = {
  encode(
    message: NextKeyIDRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NextKeyIDRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNextKeyIDRequest();
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

  fromJSON(object: any): NextKeyIDRequest {
    return { chain: isSet(object.chain) ? String(object.chain) : "" };
  },

  toJSON(message: NextKeyIDRequest): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NextKeyIDRequest>, I>>(
    base?: I
  ): NextKeyIDRequest {
    return NextKeyIDRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NextKeyIDRequest>, I>>(
    object: I
  ): NextKeyIDRequest {
    const message = createBaseNextKeyIDRequest();
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseNextKeyIDResponse(): NextKeyIDResponse {
  return { keyId: "" };
}

export const NextKeyIDResponse = {
  encode(
    message: NextKeyIDResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NextKeyIDResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNextKeyIDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): NextKeyIDResponse {
    return { keyId: isSet(object.keyId) ? String(object.keyId) : "" };
  },

  toJSON(message: NextKeyIDResponse): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NextKeyIDResponse>, I>>(
    base?: I
  ): NextKeyIDResponse {
    return NextKeyIDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NextKeyIDResponse>, I>>(
    object: I
  ): NextKeyIDResponse {
    const message = createBaseNextKeyIDResponse();
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseKeyRequest(): KeyRequest {
  return { keyId: "" };
}

export const KeyRequest = {
  encode(
    message: KeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): KeyRequest {
    return { keyId: isSet(object.keyId) ? String(object.keyId) : "" };
  },

  toJSON(message: KeyRequest): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyRequest>, I>>(base?: I): KeyRequest {
    return KeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyRequest>, I>>(
    object: I
  ): KeyRequest {
    const message = createBaseKeyRequest();
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseKeygenParticipant(): KeygenParticipant {
  return { address: "", weight: new Uint8Array(0), pubKey: "" };
}

export const KeygenParticipant = {
  encode(
    message: KeygenParticipant,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.weight.length !== 0) {
      writer.uint32(18).bytes(message.weight);
    }
    if (message.pubKey !== "") {
      writer.uint32(26).string(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeygenParticipant {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenParticipant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.weight = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pubKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeygenParticipant {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      weight: isSet(object.weight)
        ? bytesFromBase64(object.weight)
        : new Uint8Array(0),
      pubKey: isSet(object.pubKey) ? String(object.pubKey) : "",
    };
  },

  toJSON(message: KeygenParticipant): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.weight.length !== 0) {
      obj.weight = base64FromBytes(message.weight);
    }
    if (message.pubKey !== "") {
      obj.pubKey = message.pubKey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenParticipant>, I>>(
    base?: I
  ): KeygenParticipant {
    return KeygenParticipant.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeygenParticipant>, I>>(
    object: I
  ): KeygenParticipant {
    const message = createBaseKeygenParticipant();
    message.address = object.address ?? "";
    message.weight = object.weight ?? new Uint8Array(0);
    message.pubKey = object.pubKey ?? "";
    return message;
  },
};

function createBaseKeyResponse(): KeyResponse {
  return {
    keyId: "",
    state: 0,
    startedAt: Long.ZERO,
    startedAtTimestamp: undefined,
    thresholdWeight: new Uint8Array(0),
    bondedWeight: new Uint8Array(0),
    participants: [],
  };
}

export const KeyResponse = {
  encode(
    message: KeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    if (message.state !== 0) {
      writer.uint32(16).int32(message.state);
    }
    if (!message.startedAt.isZero()) {
      writer.uint32(24).int64(message.startedAt);
    }
    if (message.startedAtTimestamp !== undefined) {
      Timestamp.encode(
        toTimestamp(message.startedAtTimestamp),
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.thresholdWeight.length !== 0) {
      writer.uint32(42).bytes(message.thresholdWeight);
    }
    if (message.bondedWeight.length !== 0) {
      writer.uint32(50).bytes(message.bondedWeight);
    }
    for (const v of message.participants) {
      KeygenParticipant.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.keyId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.startedAt = reader.int64() as Long;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.startedAtTimestamp = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.thresholdWeight = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.bondedWeight = reader.bytes();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.participants.push(
            KeygenParticipant.decode(reader, reader.uint32())
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

  fromJSON(object: any): KeyResponse {
    return {
      keyId: isSet(object.keyId) ? String(object.keyId) : "",
      state: isSet(object.state) ? keyStateFromJSON(object.state) : 0,
      startedAt: isSet(object.startedAt)
        ? Long.fromValue(object.startedAt)
        : Long.ZERO,
      startedAtTimestamp: isSet(object.startedAtTimestamp)
        ? fromJsonTimestamp(object.startedAtTimestamp)
        : undefined,
      thresholdWeight: isSet(object.thresholdWeight)
        ? bytesFromBase64(object.thresholdWeight)
        : new Uint8Array(0),
      bondedWeight: isSet(object.bondedWeight)
        ? bytesFromBase64(object.bondedWeight)
        : new Uint8Array(0),
      participants: Array.isArray(object?.participants)
        ? object.participants.map((e: any) => KeygenParticipant.fromJSON(e))
        : [],
    };
  },

  toJSON(message: KeyResponse): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.state !== 0) {
      obj.state = keyStateToJSON(message.state);
    }
    if (!message.startedAt.isZero()) {
      obj.startedAt = (message.startedAt || Long.ZERO).toString();
    }
    if (message.startedAtTimestamp !== undefined) {
      obj.startedAtTimestamp = message.startedAtTimestamp.toISOString();
    }
    if (message.thresholdWeight.length !== 0) {
      obj.thresholdWeight = base64FromBytes(message.thresholdWeight);
    }
    if (message.bondedWeight.length !== 0) {
      obj.bondedWeight = base64FromBytes(message.bondedWeight);
    }
    if (message.participants?.length) {
      obj.participants = message.participants.map((e) =>
        KeygenParticipant.toJSON(e)
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyResponse>, I>>(base?: I): KeyResponse {
    return KeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyResponse>, I>>(
    object: I
  ): KeyResponse {
    const message = createBaseKeyResponse();
    message.keyId = object.keyId ?? "";
    message.state = object.state ?? 0;
    message.startedAt =
      object.startedAt !== undefined && object.startedAt !== null
        ? Long.fromValue(object.startedAt)
        : Long.ZERO;
    message.startedAtTimestamp = object.startedAtTimestamp ?? undefined;
    message.thresholdWeight = object.thresholdWeight ?? new Uint8Array(0);
    message.bondedWeight = object.bondedWeight ?? new Uint8Array(0);
    message.participants =
      object.participants?.map((e) => KeygenParticipant.fromPartial(e)) || [];
    return message;
  },
};

function createBaseKeygenSessionRequest(): KeygenSessionRequest {
  return { keyId: "" };
}

export const KeygenSessionRequest = {
  encode(
    message: KeygenSessionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): KeygenSessionRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): KeygenSessionRequest {
    return { keyId: isSet(object.keyId) ? String(object.keyId) : "" };
  },

  toJSON(message: KeygenSessionRequest): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenSessionRequest>, I>>(
    base?: I
  ): KeygenSessionRequest {
    return KeygenSessionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeygenSessionRequest>, I>>(
    object: I
  ): KeygenSessionRequest {
    const message = createBaseKeygenSessionRequest();
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseKeygenSessionResponse(): KeygenSessionResponse {
  return {
    startedAt: Long.ZERO,
    startedAtTimestamp: undefined,
    expiresAt: Long.ZERO,
    completedAt: Long.ZERO,
    gracePeriod: Long.ZERO,
    state: 0,
    keygenThresholdWeight: new Uint8Array(0),
    signingThresholdWeight: new Uint8Array(0),
    bondedWeight: new Uint8Array(0),
    participants: [],
  };
}

export const KeygenSessionResponse = {
  encode(
    message: KeygenSessionResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.startedAt.isZero()) {
      writer.uint32(8).int64(message.startedAt);
    }
    if (message.startedAtTimestamp !== undefined) {
      Timestamp.encode(
        toTimestamp(message.startedAtTimestamp),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (!message.expiresAt.isZero()) {
      writer.uint32(24).int64(message.expiresAt);
    }
    if (!message.completedAt.isZero()) {
      writer.uint32(32).int64(message.completedAt);
    }
    if (!message.gracePeriod.isZero()) {
      writer.uint32(40).int64(message.gracePeriod);
    }
    if (message.state !== 0) {
      writer.uint32(48).int32(message.state);
    }
    if (message.keygenThresholdWeight.length !== 0) {
      writer.uint32(58).bytes(message.keygenThresholdWeight);
    }
    if (message.signingThresholdWeight.length !== 0) {
      writer.uint32(66).bytes(message.signingThresholdWeight);
    }
    if (message.bondedWeight.length !== 0) {
      writer.uint32(74).bytes(message.bondedWeight);
    }
    for (const v of message.participants) {
      KeygenParticipant.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): KeygenSessionResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.startedAt = reader.int64() as Long;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.startedAtTimestamp = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiresAt = reader.int64() as Long;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.completedAt = reader.int64() as Long;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gracePeriod = reader.int64() as Long;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.keygenThresholdWeight = reader.bytes();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.signingThresholdWeight = reader.bytes();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.bondedWeight = reader.bytes();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.participants.push(
            KeygenParticipant.decode(reader, reader.uint32())
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

  fromJSON(object: any): KeygenSessionResponse {
    return {
      startedAt: isSet(object.startedAt)
        ? Long.fromValue(object.startedAt)
        : Long.ZERO,
      startedAtTimestamp: isSet(object.startedAtTimestamp)
        ? fromJsonTimestamp(object.startedAtTimestamp)
        : undefined,
      expiresAt: isSet(object.expiresAt)
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO,
      completedAt: isSet(object.completedAt)
        ? Long.fromValue(object.completedAt)
        : Long.ZERO,
      gracePeriod: isSet(object.gracePeriod)
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO,
      state: isSet(object.state) ? multisigStateFromJSON(object.state) : 0,
      keygenThresholdWeight: isSet(object.keygenThresholdWeight)
        ? bytesFromBase64(object.keygenThresholdWeight)
        : new Uint8Array(0),
      signingThresholdWeight: isSet(object.signingThresholdWeight)
        ? bytesFromBase64(object.signingThresholdWeight)
        : new Uint8Array(0),
      bondedWeight: isSet(object.bondedWeight)
        ? bytesFromBase64(object.bondedWeight)
        : new Uint8Array(0),
      participants: Array.isArray(object?.participants)
        ? object.participants.map((e: any) => KeygenParticipant.fromJSON(e))
        : [],
    };
  },

  toJSON(message: KeygenSessionResponse): unknown {
    const obj: any = {};
    if (!message.startedAt.isZero()) {
      obj.startedAt = (message.startedAt || Long.ZERO).toString();
    }
    if (message.startedAtTimestamp !== undefined) {
      obj.startedAtTimestamp = message.startedAtTimestamp.toISOString();
    }
    if (!message.expiresAt.isZero()) {
      obj.expiresAt = (message.expiresAt || Long.ZERO).toString();
    }
    if (!message.completedAt.isZero()) {
      obj.completedAt = (message.completedAt || Long.ZERO).toString();
    }
    if (!message.gracePeriod.isZero()) {
      obj.gracePeriod = (message.gracePeriod || Long.ZERO).toString();
    }
    if (message.state !== 0) {
      obj.state = multisigStateToJSON(message.state);
    }
    if (message.keygenThresholdWeight.length !== 0) {
      obj.keygenThresholdWeight = base64FromBytes(
        message.keygenThresholdWeight
      );
    }
    if (message.signingThresholdWeight.length !== 0) {
      obj.signingThresholdWeight = base64FromBytes(
        message.signingThresholdWeight
      );
    }
    if (message.bondedWeight.length !== 0) {
      obj.bondedWeight = base64FromBytes(message.bondedWeight);
    }
    if (message.participants?.length) {
      obj.participants = message.participants.map((e) =>
        KeygenParticipant.toJSON(e)
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenSessionResponse>, I>>(
    base?: I
  ): KeygenSessionResponse {
    return KeygenSessionResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeygenSessionResponse>, I>>(
    object: I
  ): KeygenSessionResponse {
    const message = createBaseKeygenSessionResponse();
    message.startedAt =
      object.startedAt !== undefined && object.startedAt !== null
        ? Long.fromValue(object.startedAt)
        : Long.ZERO;
    message.startedAtTimestamp = object.startedAtTimestamp ?? undefined;
    message.expiresAt =
      object.expiresAt !== undefined && object.expiresAt !== null
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO;
    message.completedAt =
      object.completedAt !== undefined && object.completedAt !== null
        ? Long.fromValue(object.completedAt)
        : Long.ZERO;
    message.gracePeriod =
      object.gracePeriod !== undefined && object.gracePeriod !== null
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO;
    message.state = object.state ?? 0;
    message.keygenThresholdWeight =
      object.keygenThresholdWeight ?? new Uint8Array(0);
    message.signingThresholdWeight =
      object.signingThresholdWeight ?? new Uint8Array(0);
    message.bondedWeight = object.bondedWeight ?? new Uint8Array(0);
    message.participants =
      object.participants?.map((e) => KeygenParticipant.fromPartial(e)) || [];
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

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds.toNumber() || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
