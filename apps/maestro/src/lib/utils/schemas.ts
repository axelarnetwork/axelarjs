import { z } from "zod";

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
