import { z } from "zod";

import { hex40Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const signin = publicProcedure
  .input(
    z.object({
      address: hex40Literal(),
    })
  )
  .mutation(({ input }) => {
    return {
      address: input.address,
    };
  });
