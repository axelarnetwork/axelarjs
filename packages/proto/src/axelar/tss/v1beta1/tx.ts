/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { PollKey } from "../../vote/exported/v1beta1/types";
import {
  KeyRole,
  keyRoleFromJSON,
  keyRoleToJSON,
  SigKeyPair,
} from "../exported/v1beta1/types";
import {
  MessageOut_KeygenResult,
  MessageOut_SignResult,
  TrafficOut,
} from "../tofnd/v1beta1/tofnd";
import { KeyInfo } from "./types";

export const protobufPackage = "axelar.tss.v1beta1";

/** StartKeygenRequest indicate the start of keygen */
export interface StartKeygenRequest {
  sender: string;
  keyInfo?: KeyInfo | undefined;
}

export interface StartKeygenResponse {}

export interface RotateKeyRequest {
  sender: Uint8Array;
  chain: string;
  keyRole: KeyRole;
  keyId: string;
}

export interface RotateKeyResponse {}

/** ProcessKeygenTrafficRequest protocol message */
export interface ProcessKeygenTrafficRequest {
  sender: Uint8Array;
  sessionId: string;
  payload?: TrafficOut | undefined;
}

export interface ProcessKeygenTrafficResponse {}

/** ProcessSignTrafficRequest protocol message */
export interface ProcessSignTrafficRequest {
  sender: Uint8Array;
  sessionId: string;
  payload?: TrafficOut | undefined;
}

export interface ProcessSignTrafficResponse {}

/** VotePubKeyRequest represents the message to vote on a public key */
export interface VotePubKeyRequest {
  sender: Uint8Array;
  pollKey?: PollKey | undefined;
  result?: MessageOut_KeygenResult | undefined;
}

export interface VotePubKeyResponse {
  log: string;
}

/** VoteSigRequest represents a message to vote for a signature */
export interface VoteSigRequest {
  sender: Uint8Array;
  pollKey?: PollKey | undefined;
  result?: MessageOut_SignResult | undefined;
}

export interface VoteSigResponse {
  log: string;
}

export interface HeartBeatRequest {
  sender: Uint8Array;
  keyIds: string[];
}

export interface HeartBeatResponse {}

export interface RegisterExternalKeysRequest {
  sender: Uint8Array;
  chain: string;
  externalKeys: RegisterExternalKeysRequest_ExternalKey[];
}

export interface RegisterExternalKeysRequest_ExternalKey {
  id: string;
  pubKey: Uint8Array;
}

export interface RegisterExternalKeysResponse {}

export interface SubmitMultisigPubKeysRequest {
  sender: Uint8Array;
  keyId: string;
  sigKeyPairs: SigKeyPair[];
}

export interface SubmitMultisigPubKeysResponse {}

export interface SubmitMultisigSignaturesRequest {
  sender: Uint8Array;
  sigId: string;
  signatures: Uint8Array[];
}

export interface SubmitMultisigSignaturesResponse {}

function createBaseStartKeygenRequest(): StartKeygenRequest {
  return { sender: "", keyInfo: undefined };
}

export const StartKeygenRequest = {
  encode(
    message: StartKeygenRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.keyInfo !== undefined) {
      KeyInfo.encode(message.keyInfo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartKeygenRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartKeygenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.keyInfo = KeyInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StartKeygenRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      keyInfo: isSet(object.keyInfo)
        ? KeyInfo.fromJSON(object.keyInfo)
        : undefined,
    };
  },

  toJSON(message: StartKeygenRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.keyInfo !== undefined) {
      obj.keyInfo = KeyInfo.toJSON(message.keyInfo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StartKeygenRequest>, I>>(
    base?: I
  ): StartKeygenRequest {
    return StartKeygenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StartKeygenRequest>, I>>(
    object: I
  ): StartKeygenRequest {
    const message = createBaseStartKeygenRequest();
    message.sender = object.sender ?? "";
    message.keyInfo =
      object.keyInfo !== undefined && object.keyInfo !== null
        ? KeyInfo.fromPartial(object.keyInfo)
        : undefined;
    return message;
  },
};

function createBaseStartKeygenResponse(): StartKeygenResponse {
  return {};
}

export const StartKeygenResponse = {
  encode(
    _: StartKeygenResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartKeygenResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartKeygenResponse();
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

  fromJSON(_: any): StartKeygenResponse {
    return {};
  },

  toJSON(_: StartKeygenResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<StartKeygenResponse>, I>>(
    base?: I
  ): StartKeygenResponse {
    return StartKeygenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StartKeygenResponse>, I>>(
    _: I
  ): StartKeygenResponse {
    const message = createBaseStartKeygenResponse();
    return message;
  },
};

function createBaseRotateKeyRequest(): RotateKeyRequest {
  return { sender: new Uint8Array(0), chain: "", keyRole: 0, keyId: "" };
}

export const RotateKeyRequest = {
  encode(
    message: RotateKeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    if (message.keyRole !== 0) {
      writer.uint32(24).int32(message.keyRole);
    }
    if (message.keyId !== "") {
      writer.uint32(34).string(message.keyId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RotateKeyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRotateKeyRequest();
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
          if (tag !== 24) {
            break;
          }

          message.keyRole = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): RotateKeyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      keyRole: isSet(object.keyRole) ? keyRoleFromJSON(object.keyRole) : 0,
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
    };
  },

  toJSON(message: RotateKeyRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.keyRole !== 0) {
      obj.keyRole = keyRoleToJSON(message.keyRole);
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RotateKeyRequest>, I>>(
    base?: I
  ): RotateKeyRequest {
    return RotateKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RotateKeyRequest>, I>>(
    object: I
  ): RotateKeyRequest {
    const message = createBaseRotateKeyRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.keyRole = object.keyRole ?? 0;
    message.keyId = object.keyId ?? "";
    return message;
  },
};

function createBaseRotateKeyResponse(): RotateKeyResponse {
  return {};
}

export const RotateKeyResponse = {
  encode(
    _: RotateKeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RotateKeyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRotateKeyResponse();
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

  fromJSON(_: any): RotateKeyResponse {
    return {};
  },

  toJSON(_: RotateKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RotateKeyResponse>, I>>(
    base?: I
  ): RotateKeyResponse {
    return RotateKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RotateKeyResponse>, I>>(
    _: I
  ): RotateKeyResponse {
    const message = createBaseRotateKeyResponse();
    return message;
  },
};

function createBaseProcessKeygenTrafficRequest(): ProcessKeygenTrafficRequest {
  return { sender: new Uint8Array(0), sessionId: "", payload: undefined };
}

export const ProcessKeygenTrafficRequest = {
  encode(
    message: ProcessKeygenTrafficRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.sessionId !== "") {
      writer.uint32(18).string(message.sessionId);
    }
    if (message.payload !== undefined) {
      TrafficOut.encode(message.payload, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ProcessKeygenTrafficRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessKeygenTrafficRequest();
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

          message.sessionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.payload = TrafficOut.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ProcessKeygenTrafficRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      sessionId: isSet(object.sessionId)
        ? globalThis.String(object.sessionId)
        : "",
      payload: isSet(object.payload)
        ? TrafficOut.fromJSON(object.payload)
        : undefined,
    };
  },

  toJSON(message: ProcessKeygenTrafficRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.payload !== undefined) {
      obj.payload = TrafficOut.toJSON(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessKeygenTrafficRequest>, I>>(
    base?: I
  ): ProcessKeygenTrafficRequest {
    return ProcessKeygenTrafficRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProcessKeygenTrafficRequest>, I>>(
    object: I
  ): ProcessKeygenTrafficRequest {
    const message = createBaseProcessKeygenTrafficRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.sessionId = object.sessionId ?? "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? TrafficOut.fromPartial(object.payload)
        : undefined;
    return message;
  },
};

function createBaseProcessKeygenTrafficResponse(): ProcessKeygenTrafficResponse {
  return {};
}

export const ProcessKeygenTrafficResponse = {
  encode(
    _: ProcessKeygenTrafficResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ProcessKeygenTrafficResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessKeygenTrafficResponse();
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

  fromJSON(_: any): ProcessKeygenTrafficResponse {
    return {};
  },

  toJSON(_: ProcessKeygenTrafficResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessKeygenTrafficResponse>, I>>(
    base?: I
  ): ProcessKeygenTrafficResponse {
    return ProcessKeygenTrafficResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProcessKeygenTrafficResponse>, I>>(
    _: I
  ): ProcessKeygenTrafficResponse {
    const message = createBaseProcessKeygenTrafficResponse();
    return message;
  },
};

function createBaseProcessSignTrafficRequest(): ProcessSignTrafficRequest {
  return { sender: new Uint8Array(0), sessionId: "", payload: undefined };
}

export const ProcessSignTrafficRequest = {
  encode(
    message: ProcessSignTrafficRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.sessionId !== "") {
      writer.uint32(18).string(message.sessionId);
    }
    if (message.payload !== undefined) {
      TrafficOut.encode(message.payload, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ProcessSignTrafficRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessSignTrafficRequest();
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

          message.sessionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.payload = TrafficOut.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ProcessSignTrafficRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      sessionId: isSet(object.sessionId)
        ? globalThis.String(object.sessionId)
        : "",
      payload: isSet(object.payload)
        ? TrafficOut.fromJSON(object.payload)
        : undefined,
    };
  },

  toJSON(message: ProcessSignTrafficRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.payload !== undefined) {
      obj.payload = TrafficOut.toJSON(message.payload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessSignTrafficRequest>, I>>(
    base?: I
  ): ProcessSignTrafficRequest {
    return ProcessSignTrafficRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProcessSignTrafficRequest>, I>>(
    object: I
  ): ProcessSignTrafficRequest {
    const message = createBaseProcessSignTrafficRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.sessionId = object.sessionId ?? "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? TrafficOut.fromPartial(object.payload)
        : undefined;
    return message;
  },
};

function createBaseProcessSignTrafficResponse(): ProcessSignTrafficResponse {
  return {};
}

export const ProcessSignTrafficResponse = {
  encode(
    _: ProcessSignTrafficResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ProcessSignTrafficResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessSignTrafficResponse();
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

  fromJSON(_: any): ProcessSignTrafficResponse {
    return {};
  },

  toJSON(_: ProcessSignTrafficResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessSignTrafficResponse>, I>>(
    base?: I
  ): ProcessSignTrafficResponse {
    return ProcessSignTrafficResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProcessSignTrafficResponse>, I>>(
    _: I
  ): ProcessSignTrafficResponse {
    const message = createBaseProcessSignTrafficResponse();
    return message;
  },
};

function createBaseVotePubKeyRequest(): VotePubKeyRequest {
  return { sender: new Uint8Array(0), pollKey: undefined, result: undefined };
}

export const VotePubKeyRequest = {
  encode(
    message: VotePubKeyRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.pollKey !== undefined) {
      PollKey.encode(message.pollKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.result !== undefined) {
      MessageOut_KeygenResult.encode(
        message.result,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VotePubKeyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVotePubKeyRequest();
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

          message.pollKey = PollKey.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.result = MessageOut_KeygenResult.decode(
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

  fromJSON(object: any): VotePubKeyRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      pollKey: isSet(object.pollKey)
        ? PollKey.fromJSON(object.pollKey)
        : undefined,
      result: isSet(object.result)
        ? MessageOut_KeygenResult.fromJSON(object.result)
        : undefined,
    };
  },

  toJSON(message: VotePubKeyRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.pollKey !== undefined) {
      obj.pollKey = PollKey.toJSON(message.pollKey);
    }
    if (message.result !== undefined) {
      obj.result = MessageOut_KeygenResult.toJSON(message.result);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VotePubKeyRequest>, I>>(
    base?: I
  ): VotePubKeyRequest {
    return VotePubKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VotePubKeyRequest>, I>>(
    object: I
  ): VotePubKeyRequest {
    const message = createBaseVotePubKeyRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.pollKey =
      object.pollKey !== undefined && object.pollKey !== null
        ? PollKey.fromPartial(object.pollKey)
        : undefined;
    message.result =
      object.result !== undefined && object.result !== null
        ? MessageOut_KeygenResult.fromPartial(object.result)
        : undefined;
    return message;
  },
};

function createBaseVotePubKeyResponse(): VotePubKeyResponse {
  return { log: "" };
}

export const VotePubKeyResponse = {
  encode(
    message: VotePubKeyResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.log !== "") {
      writer.uint32(10).string(message.log);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VotePubKeyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVotePubKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.log = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VotePubKeyResponse {
    return { log: isSet(object.log) ? globalThis.String(object.log) : "" };
  },

  toJSON(message: VotePubKeyResponse): unknown {
    const obj: any = {};
    if (message.log !== "") {
      obj.log = message.log;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VotePubKeyResponse>, I>>(
    base?: I
  ): VotePubKeyResponse {
    return VotePubKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VotePubKeyResponse>, I>>(
    object: I
  ): VotePubKeyResponse {
    const message = createBaseVotePubKeyResponse();
    message.log = object.log ?? "";
    return message;
  },
};

function createBaseVoteSigRequest(): VoteSigRequest {
  return { sender: new Uint8Array(0), pollKey: undefined, result: undefined };
}

export const VoteSigRequest = {
  encode(
    message: VoteSigRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.pollKey !== undefined) {
      PollKey.encode(message.pollKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.result !== undefined) {
      MessageOut_SignResult.encode(
        message.result,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VoteSigRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVoteSigRequest();
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

          message.pollKey = PollKey.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.result = MessageOut_SignResult.decode(
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

  fromJSON(object: any): VoteSigRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      pollKey: isSet(object.pollKey)
        ? PollKey.fromJSON(object.pollKey)
        : undefined,
      result: isSet(object.result)
        ? MessageOut_SignResult.fromJSON(object.result)
        : undefined,
    };
  },

  toJSON(message: VoteSigRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.pollKey !== undefined) {
      obj.pollKey = PollKey.toJSON(message.pollKey);
    }
    if (message.result !== undefined) {
      obj.result = MessageOut_SignResult.toJSON(message.result);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VoteSigRequest>, I>>(
    base?: I
  ): VoteSigRequest {
    return VoteSigRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VoteSigRequest>, I>>(
    object: I
  ): VoteSigRequest {
    const message = createBaseVoteSigRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.pollKey =
      object.pollKey !== undefined && object.pollKey !== null
        ? PollKey.fromPartial(object.pollKey)
        : undefined;
    message.result =
      object.result !== undefined && object.result !== null
        ? MessageOut_SignResult.fromPartial(object.result)
        : undefined;
    return message;
  },
};

function createBaseVoteSigResponse(): VoteSigResponse {
  return { log: "" };
}

export const VoteSigResponse = {
  encode(
    message: VoteSigResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.log !== "") {
      writer.uint32(10).string(message.log);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VoteSigResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVoteSigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.log = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VoteSigResponse {
    return { log: isSet(object.log) ? globalThis.String(object.log) : "" };
  },

  toJSON(message: VoteSigResponse): unknown {
    const obj: any = {};
    if (message.log !== "") {
      obj.log = message.log;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VoteSigResponse>, I>>(
    base?: I
  ): VoteSigResponse {
    return VoteSigResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VoteSigResponse>, I>>(
    object: I
  ): VoteSigResponse {
    const message = createBaseVoteSigResponse();
    message.log = object.log ?? "";
    return message;
  },
};

function createBaseHeartBeatRequest(): HeartBeatRequest {
  return { sender: new Uint8Array(0), keyIds: [] };
}

export const HeartBeatRequest = {
  encode(
    message: HeartBeatRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    for (const v of message.keyIds) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartBeatRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartBeatRequest();
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

  fromJSON(object: any): HeartBeatRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      keyIds: globalThis.Array.isArray(object?.keyIds)
        ? object.keyIds.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: HeartBeatRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.keyIds?.length) {
      obj.keyIds = message.keyIds;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartBeatRequest>, I>>(
    base?: I
  ): HeartBeatRequest {
    return HeartBeatRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartBeatRequest>, I>>(
    object: I
  ): HeartBeatRequest {
    const message = createBaseHeartBeatRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.keyIds = object.keyIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseHeartBeatResponse(): HeartBeatResponse {
  return {};
}

export const HeartBeatResponse = {
  encode(
    _: HeartBeatResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartBeatResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartBeatResponse();
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

  fromJSON(_: any): HeartBeatResponse {
    return {};
  },

  toJSON(_: HeartBeatResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartBeatResponse>, I>>(
    base?: I
  ): HeartBeatResponse {
    return HeartBeatResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeartBeatResponse>, I>>(
    _: I
  ): HeartBeatResponse {
    const message = createBaseHeartBeatResponse();
    return message;
  },
};

function createBaseRegisterExternalKeysRequest(): RegisterExternalKeysRequest {
  return { sender: new Uint8Array(0), chain: "", externalKeys: [] };
}

export const RegisterExternalKeysRequest = {
  encode(
    message: RegisterExternalKeysRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    for (const v of message.externalKeys) {
      RegisterExternalKeysRequest_ExternalKey.encode(
        v!,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterExternalKeysRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterExternalKeysRequest();
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

          message.externalKeys.push(
            RegisterExternalKeysRequest_ExternalKey.decode(
              reader,
              reader.uint32()
            )
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

  fromJSON(object: any): RegisterExternalKeysRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      externalKeys: globalThis.Array.isArray(object?.externalKeys)
        ? object.externalKeys.map((e: any) =>
            RegisterExternalKeysRequest_ExternalKey.fromJSON(e)
          )
        : [],
    };
  },

  toJSON(message: RegisterExternalKeysRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.externalKeys?.length) {
      obj.externalKeys = message.externalKeys.map((e) =>
        RegisterExternalKeysRequest_ExternalKey.toJSON(e)
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterExternalKeysRequest>, I>>(
    base?: I
  ): RegisterExternalKeysRequest {
    return RegisterExternalKeysRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterExternalKeysRequest>, I>>(
    object: I
  ): RegisterExternalKeysRequest {
    const message = createBaseRegisterExternalKeysRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.chain = object.chain ?? "";
    message.externalKeys =
      object.externalKeys?.map((e) =>
        RegisterExternalKeysRequest_ExternalKey.fromPartial(e)
      ) || [];
    return message;
  },
};

function createBaseRegisterExternalKeysRequest_ExternalKey(): RegisterExternalKeysRequest_ExternalKey {
  return { id: "", pubKey: new Uint8Array(0) };
}

export const RegisterExternalKeysRequest_ExternalKey = {
  encode(
    message: RegisterExternalKeysRequest_ExternalKey,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.pubKey.length !== 0) {
      writer.uint32(18).bytes(message.pubKey);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterExternalKeysRequest_ExternalKey {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterExternalKeysRequest_ExternalKey();
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

  fromJSON(object: any): RegisterExternalKeysRequest_ExternalKey {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      pubKey: isSet(object.pubKey)
        ? bytesFromBase64(object.pubKey)
        : new Uint8Array(0),
    };
  },

  toJSON(message: RegisterExternalKeysRequest_ExternalKey): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.pubKey.length !== 0) {
      obj.pubKey = base64FromBytes(message.pubKey);
    }
    return obj;
  },

  create<
    I extends Exact<DeepPartial<RegisterExternalKeysRequest_ExternalKey>, I>
  >(base?: I): RegisterExternalKeysRequest_ExternalKey {
    return RegisterExternalKeysRequest_ExternalKey.fromPartial(
      base ?? ({} as any)
    );
  },
  fromPartial<
    I extends Exact<DeepPartial<RegisterExternalKeysRequest_ExternalKey>, I>
  >(object: I): RegisterExternalKeysRequest_ExternalKey {
    const message = createBaseRegisterExternalKeysRequest_ExternalKey();
    message.id = object.id ?? "";
    message.pubKey = object.pubKey ?? new Uint8Array(0);
    return message;
  },
};

function createBaseRegisterExternalKeysResponse(): RegisterExternalKeysResponse {
  return {};
}

export const RegisterExternalKeysResponse = {
  encode(
    _: RegisterExternalKeysResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RegisterExternalKeysResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterExternalKeysResponse();
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

  fromJSON(_: any): RegisterExternalKeysResponse {
    return {};
  },

  toJSON(_: RegisterExternalKeysResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterExternalKeysResponse>, I>>(
    base?: I
  ): RegisterExternalKeysResponse {
    return RegisterExternalKeysResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterExternalKeysResponse>, I>>(
    _: I
  ): RegisterExternalKeysResponse {
    const message = createBaseRegisterExternalKeysResponse();
    return message;
  },
};

function createBaseSubmitMultisigPubKeysRequest(): SubmitMultisigPubKeysRequest {
  return { sender: new Uint8Array(0), keyId: "", sigKeyPairs: [] };
}

export const SubmitMultisigPubKeysRequest = {
  encode(
    message: SubmitMultisigPubKeysRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.keyId !== "") {
      writer.uint32(18).string(message.keyId);
    }
    for (const v of message.sigKeyPairs) {
      SigKeyPair.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubmitMultisigPubKeysRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitMultisigPubKeysRequest();
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

          message.keyId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sigKeyPairs.push(SigKeyPair.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SubmitMultisigPubKeysRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      keyId: isSet(object.keyId) ? globalThis.String(object.keyId) : "",
      sigKeyPairs: globalThis.Array.isArray(object?.sigKeyPairs)
        ? object.sigKeyPairs.map((e: any) => SigKeyPair.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SubmitMultisigPubKeysRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.keyId !== "") {
      obj.keyId = message.keyId;
    }
    if (message.sigKeyPairs?.length) {
      obj.sigKeyPairs = message.sigKeyPairs.map((e) => SigKeyPair.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitMultisigPubKeysRequest>, I>>(
    base?: I
  ): SubmitMultisigPubKeysRequest {
    return SubmitMultisigPubKeysRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubmitMultisigPubKeysRequest>, I>>(
    object: I
  ): SubmitMultisigPubKeysRequest {
    const message = createBaseSubmitMultisigPubKeysRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.keyId = object.keyId ?? "";
    message.sigKeyPairs =
      object.sigKeyPairs?.map((e) => SigKeyPair.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSubmitMultisigPubKeysResponse(): SubmitMultisigPubKeysResponse {
  return {};
}

export const SubmitMultisigPubKeysResponse = {
  encode(
    _: SubmitMultisigPubKeysResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubmitMultisigPubKeysResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitMultisigPubKeysResponse();
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

  fromJSON(_: any): SubmitMultisigPubKeysResponse {
    return {};
  },

  toJSON(_: SubmitMultisigPubKeysResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitMultisigPubKeysResponse>, I>>(
    base?: I
  ): SubmitMultisigPubKeysResponse {
    return SubmitMultisigPubKeysResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubmitMultisigPubKeysResponse>, I>>(
    _: I
  ): SubmitMultisigPubKeysResponse {
    const message = createBaseSubmitMultisigPubKeysResponse();
    return message;
  },
};

function createBaseSubmitMultisigSignaturesRequest(): SubmitMultisigSignaturesRequest {
  return { sender: new Uint8Array(0), sigId: "", signatures: [] };
}

export const SubmitMultisigSignaturesRequest = {
  encode(
    message: SubmitMultisigSignaturesRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sender.length !== 0) {
      writer.uint32(10).bytes(message.sender);
    }
    if (message.sigId !== "") {
      writer.uint32(18).string(message.sigId);
    }
    for (const v of message.signatures) {
      writer.uint32(26).bytes(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubmitMultisigSignaturesRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitMultisigSignaturesRequest();
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

          message.sigId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.signatures.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SubmitMultisigSignaturesRequest {
    return {
      sender: isSet(object.sender)
        ? bytesFromBase64(object.sender)
        : new Uint8Array(0),
      sigId: isSet(object.sigId) ? globalThis.String(object.sigId) : "",
      signatures: globalThis.Array.isArray(object?.signatures)
        ? object.signatures.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: SubmitMultisigSignaturesRequest): unknown {
    const obj: any = {};
    if (message.sender.length !== 0) {
      obj.sender = base64FromBytes(message.sender);
    }
    if (message.sigId !== "") {
      obj.sigId = message.sigId;
    }
    if (message.signatures?.length) {
      obj.signatures = message.signatures.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitMultisigSignaturesRequest>, I>>(
    base?: I
  ): SubmitMultisigSignaturesRequest {
    return SubmitMultisigSignaturesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubmitMultisigSignaturesRequest>, I>>(
    object: I
  ): SubmitMultisigSignaturesRequest {
    const message = createBaseSubmitMultisigSignaturesRequest();
    message.sender = object.sender ?? new Uint8Array(0);
    message.sigId = object.sigId ?? "";
    message.signatures = object.signatures?.map((e) => e) || [];
    return message;
  },
};

function createBaseSubmitMultisigSignaturesResponse(): SubmitMultisigSignaturesResponse {
  return {};
}

export const SubmitMultisigSignaturesResponse = {
  encode(
    _: SubmitMultisigSignaturesResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubmitMultisigSignaturesResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitMultisigSignaturesResponse();
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

  fromJSON(_: any): SubmitMultisigSignaturesResponse {
    return {};
  },

  toJSON(_: SubmitMultisigSignaturesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitMultisigSignaturesResponse>, I>>(
    base?: I
  ): SubmitMultisigSignaturesResponse {
    return SubmitMultisigSignaturesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<SubmitMultisigSignaturesResponse>, I>
  >(_: I): SubmitMultisigSignaturesResponse {
    const message = createBaseSubmitMultisigSignaturesResponse();
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
