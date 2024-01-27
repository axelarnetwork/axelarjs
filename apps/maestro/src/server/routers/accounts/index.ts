import { router } from "~/server/trpc";
import { getAccountStatuses } from "./getAccountStatuses";
import { setAccountStatus } from "./setAccountStatus";

export const accountsRouter = router({
  getAccountStatuses,
  setAccountStatus,
});

export type AccountsRouter = typeof accountsRouter;
