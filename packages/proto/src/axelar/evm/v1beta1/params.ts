/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Chain } from "../../nexus/exported/v1beta1/types";
import { Threshold } from "../../utils/v1beta1/threshold";
import { NetworkInfo } from "./types";

export const protobufPackage = "axelar.evm.v1beta1";

/** Params is the parameter set for this module */
export interface Params {
  chain: string;
  confirmationHeight: Long;
  network: string;
  tokenCode: Uint8Array;
  burnable: Uint8Array;
  revoteLockingPeriod: Long;
  networks: NetworkInfo[];
  votingThreshold?: Threshold;
  minVoterCount: Long;
  commandsGasLimit: number;
  votingGracePeriod: Long;
  endBlockerLimit: Long;
  transferLimit: Long;
}

export interface PendingChain {
  params?: Params;
  chain?: Chain;
}

function createBaseParams(): Params {
  return {
    chain: "",
    confirmationHeight: Long.UZERO,
    network: "",
    tokenCode: new Uint8Array(),
    burnable: new Uint8Array(),
    revoteLockingPeriod: Long.ZERO,
    networks: [],
    votingThreshold: undefined,
    minVoterCount: Long.ZERO,
    commandsGasLimit: 0,
    votingGracePeriod: Long.ZERO,
    endBlockerLimit: Long.ZERO,
    transferLimit: Long.UZERO,
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (!message.confirmationHeight.isZero()) {
      writer.uint32(16).uint64(message.confirmationHeight);
    }
    if (message.network !== "") {
      writer.uint32(26).string(message.network);
    }
    if (message.tokenCode.length !== 0) {
      writer.uint32(42).bytes(message.tokenCode);
    }
    if (message.burnable.length !== 0) {
      writer.uint32(50).bytes(message.burnable);
    }
    if (!message.revoteLockingPeriod.isZero()) {
      writer.uint32(56).int64(message.revoteLockingPeriod);
    }
    for (const v of message.networks) {
      NetworkInfo.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.votingThreshold !== undefined) {
      Threshold.encode(
        message.votingThreshold,
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (!message.minVoterCount.isZero()) {
      writer.uint32(80).int64(message.minVoterCount);
    }
    if (message.commandsGasLimit !== 0) {
      writer.uint32(88).uint32(message.commandsGasLimit);
    }
    if (!message.votingGracePeriod.isZero()) {
      writer.uint32(104).int64(message.votingGracePeriod);
    }
    if (!message.endBlockerLimit.isZero()) {
      writer.uint32(112).int64(message.endBlockerLimit);
    }
    if (!message.transferLimit.isZero()) {
      writer.uint32(120).uint64(message.transferLimit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.chain = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.confirmationHeight = reader.uint64() as Long;
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.network = reader.string();
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.tokenCode = reader.bytes();
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.burnable = reader.bytes();
          continue;
        case 7:
          if (tag != 56) {
            break;
          }

          message.revoteLockingPeriod = reader.int64() as Long;
          continue;
        case 8:
          if (tag != 66) {
            break;
          }

          message.networks.push(NetworkInfo.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag != 74) {
            break;
          }

          message.votingThreshold = Threshold.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag != 80) {
            break;
          }

          message.minVoterCount = reader.int64() as Long;
          continue;
        case 11:
          if (tag != 88) {
            break;
          }

          message.commandsGasLimit = reader.uint32();
          continue;
        case 13:
          if (tag != 104) {
            break;
          }

          message.votingGracePeriod = reader.int64() as Long;
          continue;
        case 14:
          if (tag != 112) {
            break;
          }

          message.endBlockerLimit = reader.int64() as Long;
          continue;
        case 15:
          if (tag != 120) {
            break;
          }

          message.transferLimit = reader.uint64() as Long;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      confirmationHeight: isSet(object.confirmationHeight)
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO,
      network: isSet(object.network) ? String(object.network) : "",
      tokenCode: isSet(object.tokenCode)
        ? bytesFromBase64(object.tokenCode)
        : new Uint8Array(),
      burnable: isSet(object.burnable)
        ? bytesFromBase64(object.burnable)
        : new Uint8Array(),
      revoteLockingPeriod: isSet(object.revoteLockingPeriod)
        ? Long.fromValue(object.revoteLockingPeriod)
        : Long.ZERO,
      networks: Array.isArray(object?.networks)
        ? object.networks.map((e: any) => NetworkInfo.fromJSON(e))
        : [],
      votingThreshold: isSet(object.votingThreshold)
        ? Threshold.fromJSON(object.votingThreshold)
        : undefined,
      minVoterCount: isSet(object.minVoterCount)
        ? Long.fromValue(object.minVoterCount)
        : Long.ZERO,
      commandsGasLimit: isSet(object.commandsGasLimit)
        ? Number(object.commandsGasLimit)
        : 0,
      votingGracePeriod: isSet(object.votingGracePeriod)
        ? Long.fromValue(object.votingGracePeriod)
        : Long.ZERO,
      endBlockerLimit: isSet(object.endBlockerLimit)
        ? Long.fromValue(object.endBlockerLimit)
        : Long.ZERO,
      transferLimit: isSet(object.transferLimit)
        ? Long.fromValue(object.transferLimit)
        : Long.UZERO,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.confirmationHeight !== undefined &&
      (obj.confirmationHeight = (
        message.confirmationHeight || Long.UZERO
      ).toString());
    message.network !== undefined && (obj.network = message.network);
    message.tokenCode !== undefined &&
      (obj.tokenCode = base64FromBytes(
        message.tokenCode !== undefined ? message.tokenCode : new Uint8Array()
      ));
    message.burnable !== undefined &&
      (obj.burnable = base64FromBytes(
        message.burnable !== undefined ? message.burnable : new Uint8Array()
      ));
    message.revoteLockingPeriod !== undefined &&
      (obj.revoteLockingPeriod = (
        message.revoteLockingPeriod || Long.ZERO
      ).toString());
    if (message.networks) {
      obj.networks = message.networks.map((e) =>
        e ? NetworkInfo.toJSON(e) : undefined
      );
    } else {
      obj.networks = [];
    }
    message.votingThreshold !== undefined &&
      (obj.votingThreshold = message.votingThreshold
        ? Threshold.toJSON(message.votingThreshold)
        : undefined);
    message.minVoterCount !== undefined &&
      (obj.minVoterCount = (message.minVoterCount || Long.ZERO).toString());
    message.commandsGasLimit !== undefined &&
      (obj.commandsGasLimit = Math.round(message.commandsGasLimit));
    message.votingGracePeriod !== undefined &&
      (obj.votingGracePeriod = (
        message.votingGracePeriod || Long.ZERO
      ).toString());
    message.endBlockerLimit !== undefined &&
      (obj.endBlockerLimit = (message.endBlockerLimit || Long.ZERO).toString());
    message.transferLimit !== undefined &&
      (obj.transferLimit = (message.transferLimit || Long.UZERO).toString());
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.chain = object.chain ?? "";
    message.confirmationHeight =
      object.confirmationHeight !== undefined &&
      object.confirmationHeight !== null
        ? Long.fromValue(object.confirmationHeight)
        : Long.UZERO;
    message.network = object.network ?? "";
    message.tokenCode = object.tokenCode ?? new Uint8Array();
    message.burnable = object.burnable ?? new Uint8Array();
    message.revoteLockingPeriod =
      object.revoteLockingPeriod !== undefined &&
      object.revoteLockingPeriod !== null
        ? Long.fromValue(object.revoteLockingPeriod)
        : Long.ZERO;
    message.networks =
      object.networks?.map((e) => NetworkInfo.fromPartial(e)) || [];
    message.votingThreshold =
      object.votingThreshold !== undefined && object.votingThreshold !== null
        ? Threshold.fromPartial(object.votingThreshold)
        : undefined;
    message.minVoterCount =
      object.minVoterCount !== undefined && object.minVoterCount !== null
        ? Long.fromValue(object.minVoterCount)
        : Long.ZERO;
    message.commandsGasLimit = object.commandsGasLimit ?? 0;
    message.votingGracePeriod =
      object.votingGracePeriod !== undefined &&
      object.votingGracePeriod !== null
        ? Long.fromValue(object.votingGracePeriod)
        : Long.ZERO;
    message.endBlockerLimit =
      object.endBlockerLimit !== undefined && object.endBlockerLimit !== null
        ? Long.fromValue(object.endBlockerLimit)
        : Long.ZERO;
    message.transferLimit =
      object.transferLimit !== undefined && object.transferLimit !== null
        ? Long.fromValue(object.transferLimit)
        : Long.UZERO;
    return message;
  },
};

function createBasePendingChain(): PendingChain {
  return { params: undefined, chain: undefined };
}

export const PendingChain = {
  encode(
    message: PendingChain,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.chain !== undefined) {
      Chain.encode(message.chain, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PendingChain {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePendingChain();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.chain = Chain.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PendingChain {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      chain: isSet(object.chain) ? Chain.fromJSON(object.chain) : undefined,
    };
  },

  toJSON(message: PendingChain): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.chain !== undefined &&
      (obj.chain = message.chain ? Chain.toJSON(message.chain) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<PendingChain>, I>>(
    base?: I
  ): PendingChain {
    return PendingChain.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PendingChain>, I>>(
    object: I
  ): PendingChain {
    const message = createBasePendingChain();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    message.chain =
      object.chain !== undefined && object.chain !== null
        ? Chain.fromPartial(object.chain)
        : undefined;
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
