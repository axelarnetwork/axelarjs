import { InterchainTokenServiceClient } from "@axelarjs/evm";

import { z } from "zod";

import { contractABI } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenServiceABI = publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: "/interchain-token-service/abi",
      summary: "Get the ABI for the InterchainTokenService contract",
      description: "Get the ABI for the InterchainTokenService contract",
      tags: ["interchain-token"],
    },
  })
  .input(z.object({}).optional())
  .output(contractABI)
  .query(({ ctx }) => {
    // cache for 1 day
    ctx.res.setHeader("Cache-Control", "public, max-age=86400");

    return InterchainTokenServiceClient.ABI as any;
  });
