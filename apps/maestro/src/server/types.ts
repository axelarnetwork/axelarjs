import { z } from "zod";

export const baseChainConfigSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  chainType: z.string(),
  externalChainId: z.optional(z.string()),
  nativeCurrency: z
    .object({
      name: z.string(),
      symbol: z.optional(z.string()),
      decimals: z.number(),
      denom: z.optional(z.string()),
      iconUrl: z.string(),
    })
    .nullable(),
  blockExplorers: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .nullable(),
  config: z.object({
    contracts: z.optional(
      z.record(
        z.string(),
        z.object({
          address: z.string(),
          objects: z.optional(z.record(z.string(), z.string())),
        })
      )
    ),
    approxFinalityHeight: z.optional(z.number()),
    rpc: z.array(z.string()),
  }),
});
