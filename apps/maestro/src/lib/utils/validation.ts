import { getAddress } from "viem";
import { z } from "zod";

/**
 * type guard for EVM addresses
 * @param address The address to check.
 */
export const isValidEVMAddress = (
  address: string
): address is `0x${string}` => {
  try {
    return typeof getAddress(address) === "string";
  } catch (error) {
    return false;
  }
};

export const VALID_NON_NUMERIC_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Home",
  "End",
];

/**
 * type guard for numeric keys
 *
 * @param key The key to check.
 * @returns true if the key is a valid numeric key.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
export const isValidNumericKey = (key: string) =>
  VALID_NON_NUMERIC_KEYS.includes(key) || /^[0-9.]+$/.test(key);

export const preventNonNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (!isValidNumericKey(e.key)) {
    e.preventDefault();
  }
};

export const preventNonHexInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (VALID_NON_NUMERIC_KEYS.includes(e.key)) {
    // allow valid non-numeric keys
    return;
  }
  if (!/^[0-9a-fA-F]+$/.test(e.key)) {
    e.preventDefault();
  }
};

const asHexLiteral = <T extends string>(x: T) => x as `0x${T}`;

/**
 * Zod schema to validate a variable length hex address
 */
export const hexLiteral = () =>
  z
    .string()
    .regex(/^0x[0-9a-fA-F]+$/)
    .transform(asHexLiteral);

/**
 * Zod schema to validate a 40 character hex address
 */
export const hex40 = () => z.string().regex(/^0x[0-9a-fA-F]{40}$/);

/**
 * Zod schema to validate a 64 character hex address
 */
export const hex64 = () => z.string().regex(/^0x[0-9a-fA-F]{64}$/);

export const hex40Literal = () => hex40().transform(asHexLiteral);

export const hex64Literal = () => hex64().transform(asHexLiteral);

export const numericString = () => z.string().regex(/^[0-9.]+$/);

const abiInputSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  internalType: z.string().optional(),
  anonymous: z.boolean().optional(),
  indexed: z.boolean().optional(),
});

export const contractABI = z.array(
  z.object({
    inputs: z.array(abiInputSchema).optional(),
    name: z.string().optional(),
    outputs: z.array(abiInputSchema).optional(),
    type: z.string().optional(),
  })
);
