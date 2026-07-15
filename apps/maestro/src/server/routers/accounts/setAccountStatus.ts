import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/validation";
import { disabledProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  accountAddress: z.union([hex40Literal(), hex64Literal()]),
  status: z.enum(["enabled", "disabled", "privileged"]),
});

export const setAccountStatus = disabledProcedure
  .input(INPUT_SCHEMA)
  .mutation(async ({ ctx, input }) => {
    return await ctx.persistence.kv.setAccountStatus(
      input.accountAddress,
      input.status
    );
  });
