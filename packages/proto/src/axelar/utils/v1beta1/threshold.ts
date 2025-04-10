/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "axelar.utils.v1beta1";

export interface Threshold {
  /**
   * split threshold into Numerator and denominator to avoid floating point
   * errors down the line
   */
  numerator: Long;
  denominator: Long;
}

function createBaseThreshold(): Threshold {
  return { numerator: Long.ZERO, denominator: Long.ZERO };
}

export const Threshold = {
  encode(
    message: Threshold,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.numerator.equals(Long.ZERO)) {
      writer.uint32(8).int64(message.numerator);
    }
    if (!message.denominator.equals(Long.ZERO)) {
      writer.uint32(16).int64(message.denominator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Threshold {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThreshold();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.numerator = reader.int64() as Long;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.denominator = reader.int64() as Long;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Threshold {
    return {
      numerator: isSet(object.numerator)
        ? Long.fromValue(object.numerator)
        : Long.ZERO,
      denominator: isSet(object.denominator)
        ? Long.fromValue(object.denominator)
        : Long.ZERO,
    };
  },

  toJSON(message: Threshold): unknown {
    const obj: any = {};
    if (!message.numerator.equals(Long.ZERO)) {
      obj.numerator = (message.numerator || Long.ZERO).toString();
    }
    if (!message.denominator.equals(Long.ZERO)) {
      obj.denominator = (message.denominator || Long.ZERO).toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Threshold>, I>>(base?: I): Threshold {
    return Threshold.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Threshold>, I>>(
    object: I
  ): Threshold {
    const message = createBaseThreshold();
    message.numerator =
      object.numerator !== undefined && object.numerator !== null
        ? Long.fromValue(object.numerator)
        : Long.ZERO;
    message.denominator =
      object.denominator !== undefined && object.denominator !== null
        ? Long.fromValue(object.denominator)
        : Long.ZERO;
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
