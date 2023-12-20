import { router } from "~/server/trpc";
import { getConfigForChain } from "./getChainConfigs";

export const axelarConfigsRouter = router({
  getChainConfigs: getConfigForChain,
});

export type AxelarConfigsRouter = typeof axelarConfigsRouter;
