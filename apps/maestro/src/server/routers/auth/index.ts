import { publicProcedure, router } from "~/server/trpc";
import { signin } from "./signin";

export const authRouter = router({
  signin,
  getSession: publicProcedure.query(async ({ ctx }) => {
    return {
      address: ctx.session?.address,
    };
  }),
});

export type AuthRouter = typeof authRouter;
