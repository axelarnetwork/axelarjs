import { z } from "zod";

/**
 * Zod schema to validate a 64 character hex address
 */
export const hex40 = () => z.string().regex(/^0x[0-9a-fA-F]{40}$/);

/**
 * Zod schema to validate a 40 character hex address
 */
export const hex64 = () => z.string().regex(/^0x[0-9a-fA-F]{64}$/);

export const hex40Literal = () =>
  hex40().transform((val) => val as `0x${string}`);

export const hex64Literal = () =>
  hex64().transform((val) => val as `0x${string}`);

export const numericString = () => z.string().regex(/^[0-9.]+$/);

const abiConstructor = z.object({
  inputs: z.array(
    z.object({
      internalType: z.string(),
      name: z.string(),
      type: z.string(),
    })
  ),
  stateMutability: z.string(),
  type: z.string(),
});

const abiError = z.object({
  inputs: z.array(z.unknown()),
  name: z.string(),
  type: z.string(),
});

const abiEvent = z.object({
  anonymous: z.boolean(),
  inputs: z.array(
    z.object({
      indexed: z.boolean(),
      internalType: z.string(),
      name: z.string(),
      type: z.string(),
    })
  ),
  name: z.string(),
  type: z.string(),
});

const abiFunction = z.object({
  inputs: z.array(
    z.object({
      internalType: z.string(),
      name: z.string(),
      type: z.string(),
    })
  ),
  name: z.string(),
  outputs: z.array(
    z.object({
      internalType: z.string(),
      name: z.string(),
      type: z.string(),
    })
  ),
  stateMutability: z.string(),
  type: z.string(),
});

export const contractABI = z.array(
  z.union([abiConstructor, abiError, abiEvent, abiFunction])
);
