import { z } from "zod";

export const baseChainConfigSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  image: z.string(),
  endpoints: z.object({
    rpc: z.array(z.string()),
  }),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  blockExplorers: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});
