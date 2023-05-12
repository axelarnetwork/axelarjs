export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;

const HexCharacters: string = "0123456789abcdef";

export interface Hexable {
  toHexString(): string;
}

export type DataOptions = {
  allowMissingPrefix?: boolean;
  hexPad?: "left" | "right" | null;
};

function isHexable(value: any): value is Hexable {
  return !!value.toHexString;
}

export function isHexString(value: any, length?: number): boolean {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

export function isBytesLike(value: any): value is BytesLike {
  return (isHexString(value) && !(value.length % 2)) || isBytes(value);
}

function isInteger(value: number) {
  return typeof value === "number" && value === value && value % 1 === 0;
}

export function isBytes(value: any): value is Bytes {
  if (value == null) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }
  if (typeof value === "string") {
    return false;
  }
  if (!isInteger(value.length) || value.length < 0) {
    return false;
  }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) {
      return false;
    }
  }
  return true;
}

export type HexIsh = BytesLike | Hexable | number | bigint;

export function hexlify(value: HexIsh, options?: DataOptions): string {
  if (!options) {
    options = {};
  }

  if (typeof value === "number") {
    if (value < 0) {
      // logger.throwArgumentError("invalid hexlify value", "value", value);
      throw new Error("invalid hexlify value");
    }

    let hex = "";
    while (value) {
      hex = HexCharacters[value & 0xf] + hex;
      value = Math.floor(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) {
        hex = `0${hex}`;
      }
      return `0x${hex}`;
    }

    return "0x00";
  }

  if (typeof value === "bigint") {
    value = value.toString(16);
    if (value.length % 2) {
      return `0x0${value}`;
    }
    return `0x${value}`;
  }

  if (
    options.allowMissingPrefix &&
    typeof value === "string" &&
    value.substring(0, 2) !== "0x"
  ) {
    value = `0x${value}`;
  }

  if (isHexable(value)) {
    return value.toHexString();
  }

  if (isHexString(value)) {
    if (value.length % 2) {
      if (options.hexPad === "left") {
        value = `0x0${(value as string).substring(2)}`;
      } else if (options.hexPad === "right") {
        value += "0";
      } else {
        // logger.throwArgumentError("hex data is odd-length", "value", value);
        throw new Error("hex data is odd-length");
      }
    }

    return (value as string).toLowerCase();
  }

  if (isBytes(value)) {
    let result = "0x";
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
  }

  // logger.throwArgumentError("invalid hexlify value", "value", value);
  throw new Error("invalid hexlify value");
}

export function hexZeroPad(value: BytesLike, length: number): string {
  if (typeof value !== "string") {
    value = hexlify(value);
  } else if (!isHexString(value)) {
    // logger.throwArgumentError("invalid hex string", "value", value);
    throw new Error("invalid hex string");
  }

  if (value.length > 2 * length + 2) {
    // logger.throwArgumentError("value out of range", "value", arguments[1]);
    throw new Error("value out of range");
  }

  while (value.length < 2 * length + 2) {
    value = `0x0${value.substring(2)}`;
  }

  return value;
}
