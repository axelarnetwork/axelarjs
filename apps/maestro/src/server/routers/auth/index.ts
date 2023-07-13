import { publicProcedure, router } from "~/server/trpc";
import { signin } from "./signin";

export const authRouter = router({
  signin,
  getSession: publicProcedure.query(({ ctx }) =>
    ctx.session ? { address: ctx.session?.address } : null
  ),
});

export type AuthRouter = typeof authRouter;
