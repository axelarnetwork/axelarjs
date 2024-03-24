/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.reward.v1beta1";

/** Params represent the genesis parameters for the module */
export interface Params {
  externalChainVotingInflationRate: Uint8Array;
  keyMgmtRelativeInflationRate: Uint8Array;
}

function createBaseParams(): Params {
  return {
    externalChainVotingInflationRate: new Uint8Array(0),
    keyMgmtRelativeInflationRate: new Uint8Array(0),
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.externalChainVotingInflationRate.length !== 0) {
      writer.uint32(10).bytes(message.externalChainVotingInflationRate);
    }
    if (message.keyMgmtRelativeInflationRate.length !== 0) {
      writer.uint32(18).bytes(message.keyMgmtRelativeInflationRate);
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
          if (tag !== 10) {
            break;
          }

          message.externalChainVotingInflationRate = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.keyMgmtRelativeInflationRate = reader.bytes();
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
      externalChainVotingInflationRate: isSet(
        object.externalChainVotingInflationRate
      )
        ? bytesFromBase64(object.externalChainVotingInflationRate)
        : new Uint8Array(0),
      keyMgmtRelativeInflationRate: isSet(object.keyMgmtRelativeInflationRate)
        ? bytesFromBase64(object.keyMgmtRelativeInflationRate)
        : new Uint8Array(0),
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.externalChainVotingInflationRate.length !== 0) {
      obj.externalChainVotingInflationRate = base64FromBytes(
        message.externalChainVotingInflationRate
      );
    }
    if (message.keyMgmtRelativeInflationRate.length !== 0) {
      obj.keyMgmtRelativeInflationRate = base64FromBytes(
        message.keyMgmtRelativeInflationRate
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.externalChainVotingInflationRate =
      object.externalChainVotingInflationRate ?? new Uint8Array(0);
    message.keyMgmtRelativeInflationRate =
      object.keyMgmtRelativeInflationRate ?? new Uint8Array(0);
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
