import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

const INPPUT_SCHEMA = z.object({
  tokenName: z.string(),
  originChainName: z.string(),
  additionalChainNames: z.array(z.string()),
  haikuType: z.enum(["deployment", "send"]),
});

const OUTPUT_SCHEMA = z.object({
  value: z.string(),
});

type HaikuInput = z.infer<typeof INPPUT_SCHEMA>;

export const generateInterchainDeploymentHaiku = protectedProcedure
  .meta({
    openapi: {
      method: "POST",
      path: "/openai/haiku",
      description: "Generate interchain deployment haiku",
      summary: "Generate interchain deployment haiku",
      tags: ["openai"],
      enabled: process.env.NODE_ENV === "development",
    },
  })
  .input(INPPUT_SCHEMA)
  .output(OUTPUT_SCHEMA)
  .mutation(async ({ input, ctx }) => {
    const { openai } = ctx.services;
    const prompt = createPrompt(input);

    const completion = await openai.completions.create({
      prompt,
      model: "gpt-3.5-turbo-instruct",
      stream: false,
      best_of: 1,
      max_tokens: 64,
    });

    const [{ text: value }] = completion.choices;

    return { value };
  });

function formatChainReference(additionalChains: string[]): string {
  if (!additionalChains.length) {
    return "";
  }

  return additionalChains.length === 1
    ? ` to ${additionalChains[0]}`
    : " across multiple chains";
}

function createPrompt(input: HaikuInput): string {
  const chainReference = formatChainReference(input.additionalChainNames);

  const baseRequest =
    input.haikuType === "deployment"
      ? `Create an original haiku celebrating the "${input.tokenName}" token, originating from "${input.originChainName}" and expanding ${chainReference}`
      : `Create an original haiku celebrating that we just sent "${input.tokenName}" token from "${input.originChainName}" to "${chainReference}"`;

  return `${baseRequest}. 
     Use natural or mystical imagery, avoiding technical jargon. 
     The haiku should not contain financial advice.
     It should also not contain any profanity or offensive language.`
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ");
}
