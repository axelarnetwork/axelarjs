import { publicProcedure, router } from "~/server/trpc";
import { createSignInMessage } from "./createSignInMessage";

export const authRouter = router({
  createSignInMessage,
  getSession: publicProcedure.query(({ ctx }) =>
    ctx.session ? { address: ctx.session?.address } : null
  ),
});

export type AuthRouter = typeof authRouter;
