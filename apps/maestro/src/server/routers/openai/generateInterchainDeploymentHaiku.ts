import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

const INPPUT_SCHEMA = z.object({
  tokenName: z.string(),
  chainName: z.string(),
});

const OUTPUT_SCHEMA = z.object({
  value: z.string(),
});

export const generateInterchainDeploymentHaiku = protectedProcedure
  .meta({
    openapi: {
      method: "POST",
      path: "/openai/haiku",
      description: "Generate interchain deployment haiku",
      summary: "Generate interchain deployment haiku",
      tags: ["openai"],
    },
  })
  .input(INPPUT_SCHEMA)
  .output(OUTPUT_SCHEMA)
  .mutation(async ({ input, ctx }) => {
    const { openai } = ctx.services;

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Interchain deployment haiku
      
      Token name: ${input.tokenName}
      Chain name: ${input.chainName}`,
      stream: false,
      best_of: 1,
    });

    const [{ text: value }] = completion.choices;

    return { value };
  });
