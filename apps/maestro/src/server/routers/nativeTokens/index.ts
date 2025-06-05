import { router } from "~/server/trpc";
import { getNativeTokenDetails } from "./getNativeTokenDetails";

export const nativeTokensRouter = router({
  getNativeTokenDetails: getNativeTokenDetails,
});

// export type definition of API
export type NativeTokensRouter = typeof nativeTokensRouter;
