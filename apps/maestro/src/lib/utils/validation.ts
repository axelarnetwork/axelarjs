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

export const preventNonNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (VALID_NON_NUMERIC_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) {
    // allow valid non-numeric keys & ctrl shortcuts
    return;
  }
  if (!/^[0-9.]+$/.test(e.key)) {
    e.preventDefault();
  }
};

export const preventNonHexInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (VALID_NON_NUMERIC_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) {
    // allow valid non-numeric keys & ctrl shortcuts
    return;
  }
  if (!/^[0-9a-fA-FxX]+$/.test(e.key)) {
    e.preventDefault();
  }
};

const asHexLiteral = <T extends string>(x: T) => x as `0x${T}`;

const asHexLiteralOptional = <T extends string>(x: T | undefined) =>
  x as `0x${T}` | undefined;

/**
 * Zod schema to validate a variable length hex address
 */
export const hexLiteral = () =>
  z
    .string()
    .regex(/^0x[0-9a-fA-F]+$/)
    .transform(asHexLiteral);

export const optionalHex40Literal = () =>
  hex40Literal().or(z.string().length(0)).transform(asHexLiteralOptional);

/**
 * Zod schema to validate a 40 character hex address
 */
export const hex40 = () =>
  z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address");

/**
 * Zod schema to validate a 64 character hex address
 */
export const hex64 = () =>
  z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid hash");

/**
 * Zod schema to validate a 0x hex entry
 */
export const hex0x = () => z.string().startsWith("0x").max(2);

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
