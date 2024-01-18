import { router } from "~/server/trpc";
import { getAccountStatuses } from "./getAccountStatuses";

export const accountsRouter = router({
  getAccountStatuses,
});

export type AccountsRouter = typeof accountsRouter;
