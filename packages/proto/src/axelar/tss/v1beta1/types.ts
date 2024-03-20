/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import {
  KeyRole,
  keyRoleFromJSON,
  keyRoleToJSON,
  KeyType,
  keyTypeFromJSON,
  keyTypeToJSON,
} from "../exported/v1beta1/types";

export const protobufPackage = "axelar.tss.v1beta1";

export interface KeygenVoteData {
  pubKey: Uint8Array;
  groupRecoveryInfo: Uint8Array;
}

/** KeyInfo holds information about a key */
export interface KeyInfo {
  keyId: string;
  keyRole: KeyRole;
  keyType: KeyType;
}

export interface MultisigInfo {
  id: string;
  timeout: Long;
  targetNum: Long;
  infos: MultisigInfo_Info[];
}

export interface MultisigInfo_Info {
  participant: Uint8Array;
  data: Uint8Array[];
}

export interface KeyRecoveryInfo {
  keyId: string;
  public: Uint8Array;
  private: { [key: string]: Uint8Array };
}

export interface KeyRecoveryInfo_PrivateEntry {
  key: string;
  value: Uint8Array;
}

export interface ExternalKeys {
  chain: string;
  keyIds: string[];
}

export interface ValidatorStatus {
  validator: Uint8Array;
  suspendedUntil: Long;
}

function createBaseKeygenVoteData(): KeygenVoteData {
  return { pubKey: new Uint8Array(0), groupRecoveryInfo: new Uint8Array(0) };
}

export const KeygenVoteData = {
  encode(
    message: KeygenVoteData,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pubKey.length !== 0) {
      writer.uint32(10).bytes(message.pubKey);
    }
    if (message.groupRecoveryInfo.length !== 0) {
      writer.uint32(18).bytes(message.groupRecoveryInfo);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeygenVoteData {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeygenVoteData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pubKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupRecoveryInfo = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeygenVoteData {
    return {
      pubKey: isSet(object.pubKey)
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array(0),
      groupRecoveryInfo: isSet(object.groupRecoveryInfo)
        ? bytesFromBase64(object.groupRecoveryInfo)
        : new Uint8Array(0),
    };
  },

  toJSON(message: KeygenVoteData): unknown {
    const obj: any = {};
    if (message.pubKey.length !== 0) {
      obj.pubKey = base64FromBytes(message.pubKey);
    }
    if (message.groupRecoveryInfo.length !== 0) {
      obj.groupRecoveryInfo = base64FromBytes(message.groupRecoveryInfo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeygenVoteData>, I>>(
    base?: I,
  ): KeygenVoteData {
    return KeygenVoteData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeygenVoteData>, I>>(
    object: I,
  ): KeygenVoteData {
    const message = createBaseKeygenVoteData();
    message.pubKey = object.pubKey ?? new Uint8Array(0);
    message.groupRecoveryInfo = object.groupRecoveryInfo ?? new Uint8Array(0);
    return message;
  },
};

function createBaseKeyInfo(): KeyInfo {
  return { keyId: "", keyRole: 0, keyType: 0 };
}

export const KeyInfo = {
  encode(
    message: KeyInfo,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    if (message.keyRole !== 0) {
      writer.uint32(16).int32(message.keyRole);
    }
    if (message.keyType !== 0) {
      writer.uint32(24).int32(message.keyType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyInfo();
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

          message.keyRole = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.keyType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeyInfo {
    return {
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      keyRole: isSet(object.keyRole) ? keyRoleFromJSON(object.keyRole) : 0,
      keyType: isSet(object.keyType) ? keyTypeFromJSON(object.keyType) : 0,
    };
  },

  toJSON(message: KeyInfo): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.keyRole !== 0) {
      obj.keyRole = keyRoleToJSON(message.keyRole);
    }
    if (message.keyType !== 0) {
      obj.keyType = keyTypeToJSON(message.keyType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyInfo>, I>>(base?: I): KeyInfo {
    return KeyInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyInfo>, I>>(object: I): KeyInfo {
    const message = createBaseKeyInfo();
    message.keyId = object.keyId ?? "";
    message.keyRole = object.keyRole ?? 0;
    message.keyType = object.keyType ?? 0;
    return message;
  },
};

function createBaseMultisigInfo(): MultisigInfo {
  return { id: "", timeout: Long.ZERO, targetNum: Long.ZERO, infos: [] };
}

export const MultisigInfo = {
  encode(
    message: MultisigInfo,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (!message.timeout.isZero()) {
      writer.uint32(16).int64(message.timeout);
    }
    if (!message.targetNum.isZero()) {
      writer.uint32(24).int64(message.targetNum);
    }
    for (const v of message.infos) {
      MultisigInfo_Info.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigInfo();
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
          if (tag !== 16) {
            break;
          }

          message.timeout = reader.int64() as Long;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.targetNum = reader.int64() as Long;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.infos.push(MultisigInfo_Info.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigInfo {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      timeout: isSet(object.timeout)
        ? Long.fromValue(object.timeout)
        : Long.ZERO,
      targetNum: isSet(object.targetNum)
        ? Long.fromValue(object.targetNum)
        : Long.ZERO,
      infos: globalThis.Array.isArray(object?.infos)
        ? object.infos.map((e: any) => MultisigInfo_Info.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MultisigInfo): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (!message.timeout.isZero()) {
      obj.timeout = (message.timeout || Long.ZERO).toString();
    }
    if (!message.targetNum.isZero()) {
      obj.targetNum = (message.targetNum || Long.ZERO).toString();
    }
    if (message.infos?.length) {
      obj.infos = message.infos.map((e) => MultisigInfo_Info.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigInfo>, I>>(
    base?: I,
  ): MultisigInfo {
    return MultisigInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigInfo>, I>>(
    object: I,
  ): MultisigInfo {
    const message = createBaseMultisigInfo();
    message.id = object.id ?? "";
    message.timeout =
      object.timeout !== undefined && object.timeout !== null
        ? Long.fromValue(object.timeout)
        : Long.ZERO;
    message.targetNum =
      object.targetNum !== undefined && object.targetNum !== null
        ? Long.fromValue(object.targetNum)
        : Long.ZERO;
    message.infos =
      object.infos?.map((e) => MultisigInfo_Info.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMultisigInfo_Info(): MultisigInfo_Info {
  return { participant: new Uint8Array(0), data: [] };
}

export const MultisigInfo_Info = {
  encode(
    message: MultisigInfo_Info,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.participant.length !== 0) {
      writer.uint32(10).bytes(message.participant);
    }
    for (const v of message.data) {
      writer.uint32(18).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MultisigInfo_Info {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultisigInfo_Info();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.participant = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.data.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MultisigInfo_Info {
    return {
      participant: isSet(object.participant)
        ? bytesFromBase64(object.participant)
        : new Uint8Array(0),
      data: globalThis.Array.isArray(object?.data)
        ? object.data.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: MultisigInfo_Info): unknown {
    const obj: any = {};
    if (message.participant.length !== 0) {
      obj.participant = base64FromBytes(message.participant);
    }
    if (message.data?.length) {
      obj.data = message.data.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MultisigInfo_Info>, I>>(
    base?: I,
  ): MultisigInfo_Info {
    return MultisigInfo_Info.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MultisigInfo_Info>, I>>(
    object: I,
  ): MultisigInfo_Info {
    const message = createBaseMultisigInfo_Info();
    message.participant = object.participant ?? new Uint8Array(0);
    message.data = object.data?.map((e) => e) || [];
    return message;
  },
};

function createBaseKeyRecoveryInfo(): KeyRecoveryInfo {
  return { keyId: "", public: new Uint8Array(0), private: {} };
}

export const KeyRecoveryInfo = {
  encode(
    message: KeyRecoveryInfo,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.keyId !== "") {
      writer.uint32(10).string(message.keyId);
    }
    if (message.public.length !== 0) {
      writer.uint32(18).bytes(message.public);
    }
    Object.entries(message.private).forEach(([key, value]) => {
      KeyRecoveryInfo_PrivateEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork(),
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyRecoveryInfo {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyRecoveryInfo();
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

          message.public = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = KeyRecoveryInfo_PrivateEntry.decode(
            reader,
            reader.uint32(),
          );
          if (entry3.value !== undefined) {
            message.private[entry3.key] = entry3.value;
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

  fromJSON(object: any): KeyRecoveryInfo {
    return {
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      public: isSet(object.public)
        ? bytesFromBase64(object.public)
        : new Uint8Array(0),
      private: isObject(object.private)
        ? Object.entries(object.private).reduce<{ [key: string]: Uint8Array }>(
            (acc, [key, value]) => {
              acc[key] = bytesFromBase64(value as string);
              return acc;
            },
            {},
          )
        : {},
    };
  },

  toJSON(message: KeyRecoveryInfo): unknown {
    const obj: any = {};
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.public.length !== 0) {
      obj.public = base64FromBytes(message.public);
    }
    if (message.private) {
      const entries = Object.entries(message.private);
      if (entries.length > 0) {
        obj.private = {};
        entries.forEach(([k, v]) => {
          obj.private[k] = base64FromBytes(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyRecoveryInfo>, I>>(
    base?: I,
  ): KeyRecoveryInfo {
    return KeyRecoveryInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyRecoveryInfo>, I>>(
    object: I,
  ): KeyRecoveryInfo {
    const message = createBaseKeyRecoveryInfo();
    message.keyId = object.keyId ?? "";
    message.public = object.public ?? new Uint8Array(0);
    message.private = Object.entries(object.private ?? {}).reduce<{
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

function createBaseKeyRecoveryInfo_PrivateEntry(): KeyRecoveryInfo_PrivateEntry {
  return { key: "", value: new Uint8Array(0) };
}

export const KeyRecoveryInfo_PrivateEntry = {
  encode(
    message: KeyRecoveryInfo_PrivateEntry,
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

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): KeyRecoveryInfo_PrivateEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyRecoveryInfo_PrivateEntry();
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

  fromJSON(object: any): KeyRecoveryInfo_PrivateEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value)
        ? bytesFromBase64(object.value)
        : new Uint8Array(0),
    };
  },

  toJSON(message: KeyRecoveryInfo_PrivateEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeyRecoveryInfo_PrivateEntry>, I>>(
    base?: I,
  ): KeyRecoveryInfo_PrivateEntry {
    return KeyRecoveryInfo_PrivateEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeyRecoveryInfo_PrivateEntry>, I>>(
    object: I,
  ): KeyRecoveryInfo_PrivateEntry {
    const message = createBaseKeyRecoveryInfo_PrivateEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function createBaseExternalKeys(): ExternalKeys {
  return { chain: "", keyIds: [] };
}

export const ExternalKeys = {
  encode(
    message: ExternalKeys,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    for (const v of message.keyIds) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExternalKeys {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExternalKeys();
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

          message.keyIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExternalKeys {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      keyIds: globalThis.Array.isArray(object?.keyIds)
        ? object.keyIds.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ExternalKeys): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.keyIds?.length) {
      obj.keyIds = message.keyIds;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExternalKeys>, I>>(
    base?: I,
  ): ExternalKeys {
    return ExternalKeys.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExternalKeys>, I>>(
    object: I,
  ): ExternalKeys {
    const message = createBaseExternalKeys();
    message.chain = object.chain ?? "";
    message.keyIds = object.keyIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseValidatorStatus(): ValidatorStatus {
  return { validator: new Uint8Array(0), suspendedUntil: Long.UZERO };
}

export const ValidatorStatus = {
  encode(
    message: ValidatorStatus,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.validator.length !== 0) {
      writer.uint32(10).bytes(message.validator);
    }
    if (!message.suspendedUntil.isZero()) {
      writer.uint32(16).uint64(message.suspendedUntil);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorStatus {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.validator = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.suspendedUntil = reader.uint64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidatorStatus {
    return {
      validator: isSet(object.validator)
        ? bytesFromBase64(object.validator)
        : new Uint8Array(0),
      suspendedUntil: isSet(object.suspendedUntil)
        ? Long.fromValue(object.suspendedUntil)
        : Long.UZERO,
    };
  },

  toJSON(message: ValidatorStatus): unknown {
    const obj: any = {};
    if (message.validator.length !== 0) {
      obj.validator = base64FromBytes(message.validator);
    }
    if (!message.suspendedUntil.isZero()) {
      obj.suspendedUntil = (message.suspendedUntil || Long.UZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidatorStatus>, I>>(
    base?: I,
  ): ValidatorStatus {
    return ValidatorStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ValidatorStatus>, I>>(
    object: I,
  ): ValidatorStatus {
    const message = createBaseValidatorStatus();
    message.validator = object.validator ?? new Uint8Array(0);
    message.suspendedUntil =
      object.suspendedUntil !== undefined && object.suspendedUntil !== null
        ? Long.fromValue(object.suspendedUntil)
        : Long.UZERO;
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
