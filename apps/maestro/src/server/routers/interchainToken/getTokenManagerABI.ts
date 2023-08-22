import { TokenManagerClient } from "@axelarjs/evm";

import { z } from "zod";

import { contractABI } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

export const getTokenManagerABI = publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: "/token-manager/abi",
      summary: "Get the ABI for the TokenManager contract",
      description: "Get the ABI for the TokenManager contract",
      tags: ["abi"],
    },
  })
  .input(z.object({}).optional())
  .output(contractABI)
  .query(({ ctx }) => {
    // cache for 1 day
    ctx.res.setHeader("Cache-Control", "public, max-age=86400");

    return TokenManagerClient.ABI as any;
  });
