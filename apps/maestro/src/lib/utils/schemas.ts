import { z } from "zod";

/**
 * Zod schema to validate a 64 character hex address
 */
export const hex40 = () => z.string().regex(/^0x[0-9a-fA-F]{64}$/);

/**
 * Zod schema to validate a 40 character hex address
 */
export const hex64 = () => z.string().regex(/^0x[0-9a-fA-F]{40}$/);
