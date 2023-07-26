import { z } from "zod";

import { APP_NAME } from "~/config/app";
import { hex40Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const SIGNIN_MESSAGE = `Sign this message to access ${APP_NAME}.`;

export const getSignInMessage = (nonce: number) =>
  SIGNIN_MESSAGE.concat(`\n\nnonce: ${nonce}`);

export const createSignInMessage = publicProcedure
  .input(
    z.object({
      address: hex40Literal(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { kv } = ctx.storage;

    const accountNonce = await kv.getAccountNonce(input.address);

    if (accountNonce === null) {
      // create account if it doesn't exist
      await kv.createAccount(input.address);
    }

    return {
      message: getSignInMessage(accountNonce ?? 0),
    };
  });
