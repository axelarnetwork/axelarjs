/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "axelar.axelarnet.v1beta1";

/** Params represent the genesis parameters for the module */
export interface Params {
  /** IBC packet route timeout window */
  routeTimeoutWindow: Long;
  transferLimit: Long;
  endBlockerLimit: Long;
  callContractsProposalMinDeposits: CallContractProposalMinDeposit[];
}

export interface CallContractProposalMinDeposit {
  chain: string;
  contractAddress: string;
  minDeposits: Coin[];
}

function createBaseParams(): Params {
  return {
    routeTimeoutWindow: Long.UZERO,
    transferLimit: Long.UZERO,
    endBlockerLimit: Long.UZERO,
    callContractsProposalMinDeposits: [],
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.routeTimeoutWindow.isZero()) {
      writer.uint32(8).uint64(message.routeTimeoutWindow);
    }
    if (!message.transferLimit.isZero()) {
      writer.uint32(24).uint64(message.transferLimit);
    }
    if (!message.endBlockerLimit.isZero()) {
      writer.uint32(32).uint64(message.endBlockerLimit);
    }
    for (const v of message.callContractsProposalMinDeposits) {
      CallContractProposalMinDeposit.encode(
        v!,
        writer.uint32(42).fork()
      ).ldelim();
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
          if (tag !== 8) {
            break;
          }

          message.routeTimeoutWindow = reader.uint64() as Long;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.transferLimit = reader.uint64() as Long;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.endBlockerLimit = reader.uint64() as Long;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.callContractsProposalMinDeposits.push(
            CallContractProposalMinDeposit.decode(reader, reader.uint32())
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

  fromJSON(object: any): Params {
    return {
      routeTimeoutWindow: isSet(object.routeTimeoutWindow)
        ? Long.fromValue(object.routeTimeoutWindow)
        : Long.UZERO,
      transferLimit: isSet(object.transferLimit)
        ? Long.fromValue(object.transferLimit)
        : Long.UZERO,
      endBlockerLimit: isSet(object.endBlockerLimit)
        ? Long.fromValue(object.endBlockerLimit)
        : Long.UZERO,
      callContractsProposalMinDeposits: globalThis.Array.isArray(
        object?.callContractsProposalMinDeposits
      )
        ? object.callContractsProposalMinDeposits.map((e: any) =>
            CallContractProposalMinDeposit.fromJSON(e)
          )
        : [],
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (!message.routeTimeoutWindow.isZero()) {
      obj.routeTimeoutWindow = (
        message.routeTimeoutWindow || Long.UZERO
      ).toString();
    }
    if (!message.transferLimit.isZero()) {
      obj.transferLimit = (message.transferLimit || Long.UZERO).toString();
    }
    if (!message.endBlockerLimit.isZero()) {
      obj.endBlockerLimit = (message.endBlockerLimit || Long.UZERO).toString();
    }
    if (message.callContractsProposalMinDeposits?.length) {
      obj.callContractsProposalMinDeposits =
        message.callContractsProposalMinDeposits.map((e) =>
          CallContractProposalMinDeposit.toJSON(e)
        );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.routeTimeoutWindow =
      object.routeTimeoutWindow !== undefined &&
      object.routeTimeoutWindow !== null
        ? Long.fromValue(object.routeTimeoutWindow)
        : Long.UZERO;
    message.transferLimit =
      object.transferLimit !== undefined && object.transferLimit !== null
        ? Long.fromValue(object.transferLimit)
        : Long.UZERO;
    message.endBlockerLimit =
      object.endBlockerLimit !== undefined && object.endBlockerLimit !== null
        ? Long.fromValue(object.endBlockerLimit)
        : Long.UZERO;
    message.callContractsProposalMinDeposits =
      object.callContractsProposalMinDeposits?.map((e) =>
        CallContractProposalMinDeposit.fromPartial(e)
      ) || [];
    return message;
  },
};

function createBaseCallContractProposalMinDeposit(): CallContractProposalMinDeposit {
  return { chain: "", contractAddress: "", minDeposits: [] };
}

export const CallContractProposalMinDeposit = {
  encode(
    message: CallContractProposalMinDeposit,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    for (const v of message.minDeposits) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CallContractProposalMinDeposit {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCallContractProposalMinDeposit();
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

          message.contractAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.minDeposits.push(Coin.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CallContractProposalMinDeposit {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      contractAddress: isSet(object.contractAddress)
        ? globalThis.String(object.contractAddress)
        : "",
      minDeposits: globalThis.Array.isArray(object?.minDeposits)
        ? object.minDeposits.map((e: any) => Coin.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CallContractProposalMinDeposit): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    if (message.minDeposits?.length) {
      obj.minDeposits = message.minDeposits.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CallContractProposalMinDeposit>, I>>(
    base?: I
  ): CallContractProposalMinDeposit {
    return CallContractProposalMinDeposit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CallContractProposalMinDeposit>, I>>(
    object: I
  ): CallContractProposalMinDeposit {
    const message = createBaseCallContractProposalMinDeposit();
    message.chain = object.chain ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.minDeposits =
      object.minDeposits?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

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
