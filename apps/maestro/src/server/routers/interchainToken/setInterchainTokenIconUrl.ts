import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import type { Context } from "~/server/context";
import { protectedProcedure } from "~/server/trpc";

export const setInterchainTokenIconUrl = protectedProcedure
  .input(
    z.object({
      iconUrl: z.string().url(),
      tokenId: hex64Literal(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { url: sanitizedUrl, extention } = sanitizeUrl(input.iconUrl);

      // assuming vector graphics are safe since it can't be validated with OpenAI's API

      const isSafe =
        extention === "svg" || (await isImageSafeToBeUsed(sanitizedUrl, ctx));

      if (!isSafe) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image does not adhere with the guidelines",
        });
      }

      return await ctx.persistence.kv.setTokenIconUrl(
        input.tokenId,
        sanitizedUrl
      );
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to persist token icon URL",
          cause: error,
        });
      }
    }
  });

function sanitizeUrl(url: string) {
  const urlObj = new URL(url);

  if (urlObj.protocol !== "https:") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "URL must be secure (https)",
    });
  }

  const extension = urlObj.pathname.split(".").pop();

  if (!["png", "jpg", "svg"].some((ext) => ext === extension)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "URL must end with .png, .jpg, or .svg",
    });
  }

  return {
    url,
    extention: urlObj.pathname.split(".").pop() as "png" | "jpg" | "svg",
  };
}

async function isImageSafeToBeUsed(
  imageUrl: string,
  ctx: Context
): Promise<boolean> {
  const promptText = `
    Is this image safe to be used as a token icon?.
    image must:
    - not contain nudity, violence, or other inappropriate content.
    - not contain offensive symbols or gestures.
    - not contain text.

    Please respond with 'safe' or 'unsafe'
  `
    .replace(/\s+/g, " ")
    .trim();

  const response = await ctx.services.openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: promptText,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    max_tokens: 1,
  });

  const [{ message }] = response.choices;

  return !message.content?.toLowerCase().includes("unsafe");
}
