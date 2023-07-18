import { z } from "zod";

/**
 * Zod schema to validate a 64 character hex address
 */
export const hex40 = () => z.string().regex(/^0x[0-9a-fA-F]{40}$/);

/**
 * Zod schema to validate a 40 character hex address
 */
export const hex64 = () => z.string().regex(/^0x[0-9a-fA-F]{64}$/);

export const hex40Literal = () => hex40().transform((x) => x as `0x${string}`);

export const hex64Literal = () => hex64().transform((x) => x as `0x${string}`);

export const numericString = () => z.string().regex(/^[0-9.]+$/);

const abiInputSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  internalType: z.string().optional(),
  anonymous: z.boolean().optional(),
});

export const contractABI = z.array(
  z.object({
    inputs: z.array(abiInputSchema).optional(),
    name: z.string().optional(),
    outputs: z.array(abiInputSchema).optional(),
    type: z.string().optional(),
  })
);
