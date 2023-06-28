import { InterchainTokenClient } from "@axelarjs/evm";

import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const ZodTypeConstructor = z.object({
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

const ZodTypeError = z.object({
  inputs: z.array(z.unknown()),
  name: z.string(),
  type: z.string(),
});

const ZodTypeEvent = z.object({
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

const ZodTypeFunction = z.object({
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

const ZodContractABI = z.array(
  z.union([ZodTypeConstructor, ZodTypeError, ZodTypeEvent, ZodTypeFunction])
);

export const getInterchainTokenABI = publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: "/interchain-token/abi",
      summary: "Get the ABI for the InterchainToken contract",
      description: "Get the ABI for the InterchainToken contract",
      tags: ["interchain-token"],
    },
  })
  .input(z.object({}).optional())
  .output(ZodContractABI)
  .query(({ ctx }) => {
    // cache for 1 day
    ctx.res.setHeader("Cache-Control", "public, max-age=86400");

    return InterchainTokenClient.ABI as any;
  });
