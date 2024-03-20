/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Duration } from "../../../google/protobuf/duration";
import { Bitmap } from "../../utils/v1beta1/bitmap";
import {
  Asset,
  Chain,
  CrossChainAddress,
  TransferDirection,
  transferDirectionFromJSON,
  transferDirectionToJSON,
} from "../exported/v1beta1/types";

export const protobufPackage = "axelar.nexus.v1beta1";

export interface MaintainerState {
  address: Uint8Array;
  missingVotes?: Bitmap | undefined;
  incorrectVotes?: Bitmap | undefined;
  chain: string;
}

/** ChainState represents the state of a registered blockchain */
export interface ChainState {
  chain?: Chain | undefined;
  activated: boolean;
  assets: Asset[];
  /** @deprecated */
  maintainerStates: MaintainerState[];
}

export interface LinkedAddresses {
  depositAddress?: CrossChainAddress | undefined;
  recipientAddress?: CrossChainAddress | undefined;
}

export interface RateLimit {
  chain: string;
  limit?: Coin | undefined;
  window?: Duration | undefined;
}

export interface TransferEpoch {
  chain: string;
  amount?: Coin | undefined;
  epoch: Long;
  /** indicates whether the rate tracking is for transfers going */
  direction: TransferDirection;
}

function createBaseMaintainerState(): MaintainerState {
  return {
    address: new Uint8Array(0),
    missingVotes: undefined,
    incorrectVotes: undefined,
    chain: "",
  };
}

export const MaintainerState = {
  encode(
    message: MaintainerState,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.missingVotes !== undefined) {
      Bitmap.encode(message.missingVotes, writer.uint32(18).fork()).ldelim();
    }
    if (message.incorrectVotes !== undefined) {
      Bitmap.encode(message.incorrectVotes, writer.uint32(26).fork()).ldelim();
    }
    if (message.chain !== "") {
      writer.uint32(34).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MaintainerState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMaintainerState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.missingVotes = Bitmap.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.incorrectVotes = Bitmap.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): MaintainerState {
    return {
      address: isSet(object.address)
        ? bytesFromBase64(object.address)
        : new Uint8Array(0),
      missingVotes: isSet(object.missingVotes)
        ? Bitmap.fromJSON(object.missingVotes)
        : undefined,
      incorrectVotes: isSet(object.incorrectVotes)
        ? Bitmap.fromJSON(object.incorrectVotes)
        : undefined,
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
    };
  },

  toJSON(message: MaintainerState): unknown {
    const obj: any = {};
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    if (message.missingVotes !== undefined) {
      obj.missingVotes = Bitmap.toJSON(message.missingVotes);
    }
    if (message.incorrectVotes !== undefined) {
      obj.incorrectVotes = Bitmap.toJSON(message.incorrectVotes);
    }
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MaintainerState>, I>>(
    base?: I,
  ): MaintainerState {
    return MaintainerState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MaintainerState>, I>>(
    object: I,
  ): MaintainerState {
    const message = createBaseMaintainerState();
    message.address = object.address ?? new Uint8Array(0);
    message.missingVotes =
      object.missingVotes !== undefined && object.missingVotes !== null
        ? Bitmap.fromPartial(object.missingVotes)
        : undefined;
    message.incorrectVotes =
      object.incorrectVotes !== undefined && object.incorrectVotes !== null
        ? Bitmap.fromPartial(object.incorrectVotes)
        : undefined;
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseChainState(): ChainState {
  return {
    chain: undefined,
    activated: false,
    assets: [],
    maintainerStates: [],
  };
}

export const ChainState = {
  encode(
    message: ChainState,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.chain !== undefined) {
      Chain.encode(message.chain, writer.uint32(10).fork()).ldelim();
    }
    if (message.activated === true) {
      writer.uint32(24).bool(message.activated);
    }
    for (const v of message.assets) {
      Asset.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.maintainerStates) {
      MaintainerState.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChainState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChainState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chain = Chain.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.activated = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.assets.push(Asset.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.maintainerStates.push(
            MaintainerState.decode(reader, reader.uint32()),
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

  fromJSON(object: any): ChainState {
    return {
      chain: isSet(object.chain) ? Chain.fromJSON(object.chain) : undefined,
      activated: isSet(object.activated)
        ? globalThis.Boolean(object.activated)
        : false,
      assets: globalThis.Array.isArray(object?.assets)
        ? object.assets.map((e: any) => Asset.fromJSON(e))
        : [],
      maintainerStates: globalThis.Array.isArray(object?.maintainerStates)
        ? object.maintainerStates.map((e: any) => MaintainerState.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ChainState): unknown {
    const obj: any = {};
    if (message.chain !== undefined) {
      obj.chain = Chain.toJSON(message.chain);
    }
    if (message.activated === true) {
      obj.activated = message.activated;
    }
    if (message.assets?.length) {
      obj.assets = message.assets.map((e) => Asset.toJSON(e));
    }
    if (message.maintainerStates?.length) {
      obj.maintainerStates = message.maintainerStates.map((e) =>
        MaintainerState.toJSON(e),
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChainState>, I>>(base?: I): ChainState {
    return ChainState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChainState>, I>>(
    object: I,
  ): ChainState {
    const message = createBaseChainState();
    message.chain =
      object.chain !== undefined && object.chain !== null
        ? Chain.fromPartial(object.chain)
        : undefined;
    message.activated = object.activated ?? false;
    message.assets = object.assets?.map((e) => Asset.fromPartial(e)) || [];
    message.maintainerStates =
      object.maintainerStates?.map((e) => MaintainerState.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLinkedAddresses(): LinkedAddresses {
  return { depositAddress: undefined, recipientAddress: undefined };
}

export const LinkedAddresses = {
  encode(
    message: LinkedAddresses,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.depositAddress !== undefined) {
      CrossChainAddress.encode(
        message.depositAddress,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.recipientAddress !== undefined) {
      CrossChainAddress.encode(
        message.recipientAddress,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkedAddresses {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkedAddresses();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.depositAddress = CrossChainAddress.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.recipientAddress = CrossChainAddress.decode(
            reader,
            reader.uint32(),
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

  fromJSON(object: any): LinkedAddresses {
    return {
      depositAddress: isSet(object.depositAddress)
        ? CrossChainAddress.fromJSON(object.depositAddress)
        : undefined,
      recipientAddress: isSet(object.recipientAddress)
        ? CrossChainAddress.fromJSON(object.recipientAddress)
        : undefined,
    };
  },

  toJSON(message: LinkedAddresses): unknown {
    const obj: any = {};
    if (message.depositAddress !== undefined) {
      obj.depositAddress = CrossChainAddress.toJSON(message.depositAddress);
    }
    if (message.recipientAddress !== undefined) {
      obj.recipientAddress = CrossChainAddress.toJSON(message.recipientAddress);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LinkedAddresses>, I>>(
    base?: I,
  ): LinkedAddresses {
    return LinkedAddresses.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LinkedAddresses>, I>>(
    object: I,
  ): LinkedAddresses {
    const message = createBaseLinkedAddresses();
    message.depositAddress =
      object.depositAddress !== undefined && object.depositAddress !== null
        ? CrossChainAddress.fromPartial(object.depositAddress)
        : undefined;
    message.recipientAddress =
      object.recipientAddress !== undefined && object.recipientAddress !== null
        ? CrossChainAddress.fromPartial(object.recipientAddress)
        : undefined;
    return message;
  },
};

function createBaseRateLimit(): RateLimit {
  return { chain: "", limit: undefined, window: undefined };
}

export const RateLimit = {
  encode(
    message: RateLimit,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.limit !== undefined) {
      Coin.encode(message.limit, writer.uint32(18).fork()).ldelim();
    }
    if (message.window !== undefined) {
      Duration.encode(message.window, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RateLimit {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimit();
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

          message.limit = Coin.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.window = Duration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RateLimit {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      limit: isSet(object.limit) ? Coin.fromJSON(object.limit) : undefined,
      window: isSet(object.window)
        ? Duration.fromJSON(object.window)
        : undefined,
    };
  },

  toJSON(message: RateLimit): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.limit !== undefined) {
      obj.limit = Coin.toJSON(message.limit);
    }
    if (message.window !== undefined) {
      obj.window = Duration.toJSON(message.window);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimit>, I>>(base?: I): RateLimit {
    return RateLimit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimit>, I>>(
    object: I,
  ): RateLimit {
    const message = createBaseRateLimit();
    message.chain = object.chain ?? "";
    message.limit =
      object.limit !== undefined && object.limit !== null
        ? Coin.fromPartial(object.limit)
        : undefined;
    message.window =
      object.window !== undefined && object.window !== null
        ? Duration.fromPartial(object.window)
        : undefined;
    return message;
  },
};

function createBaseTransferEpoch(): TransferEpoch {
  return { chain: "", amount: undefined, epoch: Long.UZERO, direction: 0 };
}

export const TransferEpoch = {
  encode(
    message: TransferEpoch,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
    }
    if (!message.epoch.isZero()) {
      writer.uint32(24).uint64(message.epoch);
    }
    if (message.direction !== 0) {
      writer.uint32(32).int32(message.direction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferEpoch {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferEpoch();
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

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.epoch = reader.uint64() as Long;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.direction = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferEpoch {
    return {
      chain: isSet(object.chain) ? globalThis.String(object.chain) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      epoch: isSet(object.epoch) ? Long.fromValue(object.epoch) : Long.UZERO,
      direction: isSet(object.direction)
        ? transferDirectionFromJSON(object.direction)
        : 0,
    };
  },

  toJSON(message: TransferEpoch): unknown {
    const obj: any = {};
    if (message.chain !== "") {
      obj.chain = message.chain;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    if (!message.epoch.isZero()) {
      obj.epoch = (message.epoch || Long.UZERO).toString();
    }
    if (message.direction !== 0) {
      obj.direction = transferDirectionToJSON(message.direction);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransferEpoch>, I>>(
    base?: I,
  ): TransferEpoch {
    return TransferEpoch.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransferEpoch>, I>>(
    object: I,
  ): TransferEpoch {
    const message = createBaseTransferEpoch();
    message.chain = object.chain ?? "";
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? Coin.fromPartial(object.amount)
        : undefined;
    message.epoch =
      object.epoch !== undefined && object.epoch !== null
        ? Long.fromValue(object.epoch)
        : Long.UZERO;
    message.direction = object.direction ?? 0;
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
