/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

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

/**
 * Type guard to check if a value is a hex string.
 *
 * @param value value to check
 * @param length
 * @returns
 */
export function isHexString(value: any, length?: number): boolean {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

/**
 * Type guard to check if a value is a hex string or a byte array.
 *
 * @param value value to check
 * @returns true if the value is a hex string or a byte array, false otherwise
 */
export function isBytesLike(value: any): value is BytesLike {
  return (isHexString(value) && !(value.length % 2)) || isBytes(value);
}

/**
 * Type guard to check if a value is an integer.
 *
 * @param value value to check
 * @returns true if the value is an integer, false otherwise
 */
function isInteger(value: number) {
  return typeof value === "number" && value === value && value % 1 === 0;
}

/**
 * Type guard to check if a value is a byte array.
 *
 * @param value value to check
 * @returns true if the value is a byte array, false otherwise
 */
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

/**
 * Convert a value to a hex string.
 *
 * @param value value to convert
 * @param options
 * @returns hex string
 */
export function hexlify(value: HexIsh, options?: DataOptions): string {
  if (!options) {
    options = {};
  }

  if (typeof value === "number") {
    if (value < 0) {
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
        value = String(value).concat("0");
      } else {
        throw new Error("hex data is odd-length");
      }
    }

    return (value as string).toLowerCase();
  }

  if (isBytes(value)) {
    let result = "0x";
    for (let i = 0; i < value.length; i++) {
      const v = value[i] ?? 0;

      result +=
        String(HexCharacters[(v & 0xf0) >> 4]) +
        String(HexCharacters[v & 0x0f]);
    }
    return result;
  }

  throw new Error("invalid hexlify value");
}

/**
 * Pad a byte array with zeros on the right to the specified length.
 *
 * @param value value to pad
 * @param length desired length
 * @returns padded byte array
 */
export function hexZeroPad(value: BytesLike, length: number): string {
  if (typeof value !== "string") {
    value = hexlify(value);
  } else if (!isHexString(value)) {
    throw new Error("invalid hex string");
  }

  if (value.length > 2 * length + 2) {
    throw new Error("value out of range");
  }

  while (value.length < 2 * length + 2) {
    value = `0x0${value.substring(2)}`;
  }

  return value;
}
