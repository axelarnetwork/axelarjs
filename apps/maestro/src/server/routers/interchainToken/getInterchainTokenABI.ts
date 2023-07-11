import { InterchainTokenClient } from "@axelarjs/evm";

import { z } from "zod";

import { contractABI } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

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
  .output(contractABI)
  .query(({ ctx }) => {
    // cache for 1 day
    ctx.res.setHeader("Cache-Control", "public, max-age=86400");

    return InterchainTokenClient.ABI as any;
  });
