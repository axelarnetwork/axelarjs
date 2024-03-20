/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Any } from "../../../google/protobuf/any";
import { Snapshot } from "../../snapshot/exported/v1beta1/types";
import { Threshold } from "../../utils/v1beta1/threshold";
import {
  KeyState,
  keyStateFromJSON,
  keyStateToJSON,
  MultisigState,
  multisigStateFromJSON,
  multisigStateToJSON,
} from "../exported/v1beta1/types";

export const protobufPackage = "axelar.multisig.v1beta1";

export interface Key {
  id: string;
  snapshot?: Snapshot | undefined;
  pubKeys: { [key: string]: Uint8Array };
  signingThreshold?: Threshold | undefined;
  state: KeyState;
}

export interface Key_PubKeysEntry {
  key: string;
  value: Uint8Array;
}

export interface KeygenSession {
  key?: Key | undefined;
  state: MultisigState;
  keygenThreshold?: Threshold | undefined;
  expiresAt: Long;
  completedAt: Long;
  isPubKeyReceived: { [key: string]: boolean };
  gracePeriod: Long;
}

export interface KeygenSession_IsPubKeyReceivedEntry {
  key: string;
  value: boolean;
}

export interface MultiSig {
  keyId: string;
  payloadHash: Uint8Array;
  sigs: { [key: string]: Uint8Array };
}

export interface MultiSig_SigsEntry {
  key: string;
  value: Uint8Array;
}

export interface SigningSession {
  id: Long;
  multiSig?: MultiSig | undefined;
  state: MultisigState;
  key?: Key | undefined;
  expiresAt: Long;
  completedAt: Long;
  gracePeriod: Long;
  module: string;
  moduleMetadata?: Any | undefined;
}

export interface KeyEpoch {
  epoch: Long;
  chain: string;
  keyId: string;
}

function createBaseKey(): Key {
  return {
    id: "",
    snapshot: undefined,
    pubKeys: {},
    signingThreshold: undefined,
    state: 0,
  };
}

export const Key = {
  encode(message: Key, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.snapshot !== undefined) {
      Snapshot.encode(message.snapshot, writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.pubKeys).forEach(([key, value]) => {
      Key_PubKeysEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork(),
      ).ldelim();
    });
    if (message.signingThreshold !== undefined) {
      Threshold.encode(
        message.signingThreshold,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(40).int32(message.state);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Key {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.snapshot = Snapshot.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = Key_PubKeysEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.pubKeys[entry3.key] = entry3.value;
          }
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.signingThreshold = Threshold.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Key {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      snapshot: isSet(object.snapshot)
        ? Snapshot.fromJSON(object.snapshot)
        : undefined,
      pubKeys: isObject(object.pubKeys)
        ? Object.entries(object.pubKeys).reduce<{ [key: string]: Uint8Array }>(
            (acc, [key, value]) => {
              acc[key] = bytesFromBase64(value as string);
              return acc;
            },
            {},
          )
        : {},
      signingThreshold: isSet(object.signingThreshold)
        ? Threshold.fromJSON(object.signingThreshold)
        : undefined,
      state: isSet(object.state) ? keyStateFromJSON(object.state) : 0,
    };
  },

  toJSON(message: Key): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.snapshot !== undefined) {
      obj.snapshot = Snapshot.toJSON(message.snapshot);
    }
    if (message.pubKeys) {
      const entries = Object.entries(message.pubKeys);
      if (entries.length > 0) {
        obj.pubKeys = {};
        entries.forEach(([k, v]) => {
          obj.pubKeys[k] = base64FromBytes(v);
        });
      }
    }
    if (message.signingThreshold !== undefined) {
      obj.signingThreshold = Threshold.toJSON(message.signingThreshold);
    }
    if (message.state !== 0) {
      obj.state = keyStateToJSON(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Key>, I>>(base?: I): Key {
    return Key.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Key>, I>>(object: I): Key {
    const message = createBaseKey();
    message.id = object.id ?? "";
    message.snapshot =
      object.snapshot !== undefined && object.snapshot !== null
        ? Snapshot.fromPartial(object.snapshot)
        : undefined;
    message.pubKeys = Object.entries(object.pubKeys ?? {}).reduce<{
      [key: string]: Uint8Array;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    message.signingThreshold =
      object.signingThreshold !== undefined && object.signingThreshold !== null
        ? Threshold.fromPartial(object.signingThreshold)
        : undefined;
    message.state = object.state ?? 0;
    return message;
  },
};

function createBaseKey_PubKeysEntry(): Key_PubKeysEntry {
  return { key: "", value: new Uint8Array(0) };
}

export const Key_PubKeysEntry = {
  encode(
    message: Key_PubKeysEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Key_PubKeysEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKey_PubKeysEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Key_PubKeysEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value)
        ? bytesFromBase64(object.value)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Key_PubKeysEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Key_PubKeysEntry>, I>>(
    base?: I,
  ): Key_PubKeysEntry {
    return Key_PubKeysEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Key_PubKeysEntry>, I>>(
    object: I,
  ): Key_PubKeysEntry {
    const message = createBaseKey_PubKeysEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function createBaseKeygenSession(): KeygenSession {
  return {
    key: undefined,
    state: 0,
    keygenThreshold: undefined,
    expiresAt: Long.ZERO,
    completedAt: Long.ZERO,
    isPubKeyReceived: {},
    gracePeriod: Long.ZERO,
  };
}

export const KeygenSession = {
  encode(
    message: KeygenSession,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== undefined) {
      Key.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(16).int32(message.state);
    }
    if (message.keygenThreshold !== undefined) {
      Threshold.encode(
        message.keygenThreshold,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    if (!message.expiresAt.isZero()) {
      writer.uint32(32).int64(message.expiresAt);
    }
    if (!message.completedAt.isZero()) {
      writer.uint32(40).int64(message.completedAt);
    }
    Object.entries(message.isPubKeyReceived).forEach(([key, value]) => {
      KeygenSession_IsPubKeyReceivedEntry.encode(
        { key: key as any, value },
        writer.uint32(50).fork(),
      ).ldelim();
    });
    if (!message.gracePeriod.isZero()) {
      writer.uint32(56).int64(message.gracePeriod);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeygenSession {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenSession();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = Key.decode(reader, reader.uint32());
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

          message.keygenThreshold = Threshold.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.expiresAt = reader.int64() as Long;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.completedAt = reader.int64() as Long;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          const entry6 = KeygenSession_IsPubKeyReceivedEntry.decode(
            reader,
            reader.uint32(),
          );
          if (entry6.value !== undefined) {
            message.isPubKeyReceived[entry6.key] = entry6.value;
          }
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.gracePeriod = reader.int64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeygenSession {
    return {
      key: isSet(object.key) ? Key.fromJSON(object.key) : undefined,
      state: isSet(object.state) ? multisigStateFromJSON(object.state) : 0,
      keygenThreshold: isSet(object.keygenThreshold)
        ? Threshold.fromJSON(object.keygenThreshold)
        : undefined,
      expiresAt: isSet(object.expiresAt)
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO,
      completedAt: isSet(object.completedAt)
        ? Long.fromValue(object.completedAt)
        : Long.ZERO,
      isPubKeyReceived: isObject(object.isPubKeyReceived)
        ? Object.entries(object.isPubKeyReceived).reduce<{
            [key: string]: boolean;
          }>((acc, [key, value]) => {
            acc[key] = Boolean(value);
            return acc;
          }, {})
        : {},
      gracePeriod: isSet(object.gracePeriod)
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO,
    };
  },

  toJSON(message: KeygenSession): unknown {
    const obj: any = {};
    if (message.key !== undefined) {
      obj.key = Key.toJSON(message.key);
    }
    if (message.state !== 0) {
      obj.state = multisigStateToJSON(message.state);
    }
    if (message.keygenThreshold !== undefined) {
      obj.keygenThreshold = Threshold.toJSON(message.keygenThreshold);
    }
    if (!message.expiresAt.isZero()) {
      obj.expiresAt = (message.expiresAt || Long.ZERO).toString();
    }
    if (!message.completedAt.isZero()) {
      obj.completedAt = (message.completedAt || Long.ZERO).toString();
    }
    if (message.isPubKeyReceived) {
      const entries = Object.entries(message.isPubKeyReceived);
      if (entries.length > 0) {
        obj.isPubKeyReceived = {};
        entries.forEach(([k, v]) => {
          obj.isPubKeyReceived[k] = v;
        });
      }
    }
    if (!message.gracePeriod.isZero()) {
      obj.gracePeriod = (message.gracePeriod || Long.ZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenSession>, I>>(
    base?: I,
  ): KeygenSession {
    return KeygenSession.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeygenSession>, I>>(
    object: I,
  ): KeygenSession {
    const message = createBaseKeygenSession();
    message.key =
      object.key !== undefined && object.key !== null
        ? Key.fromPartial(object.key)
        : undefined;
    message.state = object.state ?? 0;
    message.keygenThreshold =
      object.keygenThreshold !== undefined && object.keygenThreshold !== null
        ? Threshold.fromPartial(object.keygenThreshold)
        : undefined;
    message.expiresAt =
      object.expiresAt !== undefined && object.expiresAt !== null
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO;
    message.completedAt =
      object.completedAt !== undefined && object.completedAt !== null
        ? Long.fromValue(object.completedAt)
        : Long.ZERO;
    message.isPubKeyReceived = Object.entries(
      object.isPubKeyReceived ?? {},
    ).reduce<{ [key: string]: boolean }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = globalThis.Boolean(value);
      }
      return acc;
    }, {});
    message.gracePeriod =
      object.gracePeriod !== undefined && object.gracePeriod !== null
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO;
    return message;
  },
};

function createBaseKeygenSession_IsPubKeyReceivedEntry(): KeygenSession_IsPubKeyReceivedEntry {
  return { key: "", value: false };
}

export const KeygenSession_IsPubKeyReceivedEntry = {
  encode(
    message: KeygenSession_IsPubKeyReceivedEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value === true) {
      writer.uint32(16).bool(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): KeygenSession_IsPubKeyReceivedEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenSession_IsPubKeyReceivedEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeygenSession_IsPubKeyReceivedEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Boolean(object.value) : false,
    };
  },

  toJSON(message: KeygenSession_IsPubKeyReceivedEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value === true) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenSession_IsPubKeyReceivedEntry>, I>>(
    base?: I,
  ): KeygenSession_IsPubKeyReceivedEntry {
    return KeygenSession_IsPubKeyReceivedEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<KeygenSession_IsPubKeyReceivedEntry>, I>,
  >(object: I): KeygenSession_IsPubKeyReceivedEntry {
    const message = createBaseKeygenSession_IsPubKeyReceivedEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? false;
    return message;
  },
};

function createBaseMultiSig(): MultiSig {
  return { keyId: "", payloadHash: new Uint8Array(0), sigs: {} };
}

export const MultiSig = {
  encode(
    message: MultiSig,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    if (message.payloadHash.length !== 0) {
      writer.uint32(18).bytes(message.payloadHash);
    }
    Object.entries(message.sigs).forEach(([key, value]) => {
      MultiSig_SigsEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork(),
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiSig {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiSig();
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
          if (tag !== 18) {
            break;
          }

          message.payloadHash = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = MultiSig_SigsEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.sigs[entry3.key] = entry3.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiSig {
    return {
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      payloadHash: isSet(object.payloadHash)
        ? bytesFromBase64(object.payloadHash)
        : new Uint8Array(0),
      sigs: isObject(object.sigs)
        ? Object.entries(object.sigs).reduce<{ [key: string]: Uint8Array }>(
            (acc, [key, value]) => {
              acc[key] = bytesFromBase64(value as string);
              return acc;
            },
            {},
          )
        : {},
    };
  },

  toJSON(message: MultiSig): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.payloadHash.length !== 0) {
      obj.payloadHash = base64FromBytes(message.payloadHash);
    }
    if (message.sigs) {
      const entries = Object.entries(message.sigs);
      if (entries.length > 0) {
        obj.sigs = {};
        entries.forEach(([k, v]) => {
          obj.sigs[k] = base64FromBytes(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiSig>, I>>(base?: I): MultiSig {
    return MultiSig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiSig>, I>>(object: I): MultiSig {
    const message = createBaseMultiSig();
    message.keyId = object.keyId ?? "";
    message.payloadHash = object.payloadHash ?? new Uint8Array(0);
    message.sigs = Object.entries(object.sigs ?? {}).reduce<{
      [key: string]: Uint8Array;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMultiSig_SigsEntry(): MultiSig_SigsEntry {
  return { key: "", value: new Uint8Array(0) };
}

export const MultiSig_SigsEntry = {
  encode(
    message: MultiSig_SigsEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultiSig_SigsEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiSig_SigsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultiSig_SigsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value)
        ? bytesFromBase64(object.value)
        : new Uint8Array(0),
    };
  },

  toJSON(message: MultiSig_SigsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultiSig_SigsEntry>, I>>(
    base?: I,
  ): MultiSig_SigsEntry {
    return MultiSig_SigsEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultiSig_SigsEntry>, I>>(
    object: I,
  ): MultiSig_SigsEntry {
    const message = createBaseMultiSig_SigsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSigningSession(): SigningSession {
  return {
    id: Long.UZERO,
    multiSig: undefined,
    state: 0,
    key: undefined,
    expiresAt: Long.ZERO,
    completedAt: Long.ZERO,
    gracePeriod: Long.ZERO,
    module: "",
    moduleMetadata: undefined,
  };
}

export const SigningSession = {
  encode(
    message: SigningSession,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.multiSig !== undefined) {
      MultiSig.encode(message.multiSig, writer.uint32(18).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    if (message.key !== undefined) {
      Key.encode(message.key, writer.uint32(34).fork()).ldelim();
    }
    if (!message.expiresAt.isZero()) {
      writer.uint32(40).int64(message.expiresAt);
    }
    if (!message.completedAt.isZero()) {
      writer.uint32(48).int64(message.completedAt);
    }
    if (!message.gracePeriod.isZero()) {
      writer.uint32(56).int64(message.gracePeriod);
    }
    if (message.module !== "") {
      writer.uint32(66).string(message.module);
    }
    if (message.moduleMetadata !== undefined) {
      Any.encode(message.moduleMetadata, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SigningSession {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSigningSession();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.uint64() as Long;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.multiSig = MultiSig.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.key = Key.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.expiresAt = reader.int64() as Long;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.completedAt = reader.int64() as Long;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.gracePeriod = reader.int64() as Long;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.module = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
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

  fromJSON(object: any): SigningSession {
    return {
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      multiSig: isSet(object.multiSig)
        ? MultiSig.fromJSON(object.multiSig)
        : undefined,
      state: isSet(object.state) ? multisigStateFromJSON(object.state) : 0,
      key: isSet(object.key) ? Key.fromJSON(object.key) : undefined,
      expiresAt: isSet(object.expiresAt)
        ? Long.fromValue(object.expiresAt)
        : Long.ZERO,
      completedAt: isSet(object.completedAt)
        ? Long.fromValue(object.completedAt)
        : Long.ZERO,
      gracePeriod: isSet(object.gracePeriod)
        ? Long.fromValue(object.gracePeriod)
        : Long.ZERO,
      module: isSet(object.module) ? globalThis.String(object.module) : "",
      moduleMetadata: isSet(object.moduleMetadata)
        ? Any.fromJSON(object.moduleMetadata)
        : undefined,
    };
  },

  toJSON(message: SigningSession): unknown {
    const obj: any = {};
    if (!message.id.isZero()) {
      obj.id = (message.id || Long.UZERO).toString();
    }
    if (message.multiSig !== undefined) {
      obj.multiSig = MultiSig.toJSON(message.multiSig);
    }
    if (message.state !== 0) {
      obj.state = multisigStateToJSON(message.state);
    }
    if (message.key !== undefined) {
      obj.key = Key.toJSON(message.key);
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
    if (message.module !== "") {
      obj.module = message.module;
    }
    if (message.moduleMetadata !== undefined) {
      obj.moduleMetadata = Any.toJSON(message.moduleMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SigningSession>, I>>(
    base?: I,
  ): SigningSession {
    return SigningSession.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SigningSession>, I>>(
    object: I,
  ): SigningSession {
    const message = createBaseSigningSession();
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.multiSig =
      object.multiSig !== undefined && object.multiSig !== null
        ? MultiSig.fromPartial(object.multiSig)
        : undefined;
    message.state = object.state ?? 0;
    message.key =
      object.key !== undefined && object.key !== null
        ? Key.fromPartial(object.key)
        : undefined;
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
    message.module = object.module ?? "";
    message.moduleMetadata =
      object.moduleMetadata !== undefined && object.moduleMetadata !== null
        ? Any.fromPartial(object.moduleMetadata)
        : undefined;
    return message;
  },
};

function createBaseKeyEpoch(): KeyEpoch {
  return { epoch: Long.UZERO, chain: "", keyId: "" };
}

export const KeyEpoch = {
  encode(
    message: KeyEpoch,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (!message.epoch.isZero()) {
      writer.uint32(8).uint64(message.epoch);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.keyId !== "") {
      writer.uint32(26).string(message.keyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyEpoch {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyEpoch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.epoch = reader.uint64() as Long;
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

  fromJSON(object: any): KeyEpoch {
    return {
      epoch: isSet(object.epoch) ? Long.fromValue(object.epoch) : Long.UZERO,
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
    };
  },

  toJSON(message: KeyEpoch): unknown {
    const obj: any = {};
    if (!message.epoch.isZero()) {
      obj.epoch = (message.epoch || Long.UZERO).toString();
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyEpoch>, I>>(base?: I): KeyEpoch {
    return KeyEpoch.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyEpoch>, I>>(object: I): KeyEpoch {
    const message = createBaseKeyEpoch();
    message.epoch =
      object.epoch !== undefined && object.epoch !== null
        ? Long.fromValue(object.epoch)
        : Long.UZERO;
    message.chain = object.chain ?? "";
    message.keyId = object.keyId ?? "";
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
