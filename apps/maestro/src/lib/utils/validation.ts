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

export const hex0xLiteral = () => hex0x().transform(asHexLiteral);

export const hex40Literal = () => hex40().transform(asHexLiteral);

export const hex64Literal = () => hex64().transform(asHexLiteral);

export const numericString = () => z.string().regex(/^[0-9.]+$/);

/**
 * Zod schema to validate a Sui Token Address (Coin Type)
 * Format: 0x<PACKAGE_ID>::<MODULE_NAME>::<STRUCT_NAME>
 * e.g., 0x2::sui::SUI or 0x123...abc::mycoin::MYCOIN
 */
export const suiTokenAddress = () =>
  z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{64}::\w+::\w+$/,
      "Invalid Sui token address format (expected: 0x<packageId>::<module>::<struct>)"
    );

// Checks if a string matches the Sui Coin Type format: 0x<PACKAGE_ID>::<MODULE_NAME>::<STRUCT_NAME>
// e.g., 0x2::sui::SUI or 0x123...abc::mycoin::MYCOIN
export function isValidSuiTokenAddress(address: string): boolean {
  return suiTokenAddress().safeParse(address).success;
}

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

const STELLAR_CONTRACT_REGEX = /^C[A-Z2-7]{55}$/;
const STELLAR_SYMBOL_ISSUER_REGEX = /^[A-Za-z0-9-]{1,12}-G[A-Z2-7]{55}$/;
export const stellarTokenAddress = () =>
  z
    .string()
    .regex(STELLAR_CONTRACT_REGEX, "Invalid Stellar token address")
    .or(
      z
        .string()
        .regex(STELLAR_SYMBOL_ISSUER_REGEX, "Invalid Stellar token address")
    );

export function isValidStellarTokenAddress(address: string): boolean {
  return stellarTokenAddress().safeParse(address).success;
}
