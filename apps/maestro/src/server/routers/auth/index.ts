import { publicProcedure, router } from "~/server/trpc";
import { signin } from "./signin";

export const authRouter = router({
  signin,
  getSession: publicProcedure.query(async ({ ctx }) => {
    return {
      session: ctx.session,
    };
  }),
});

export type AuthRouter = typeof authRouter;
