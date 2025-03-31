import { router } from "~/server/trpc";
import { getConfigForChain } from "./getChainConfigs";
import { getAxelarChainConfigs } from "./getAxelarChainConfigs";

export const axelarConfigsRouter = router({
  getChainConfigs: getConfigForChain,
  getAxelarChainConfigs,
});

export type AxelarConfigsRouter = typeof axelarConfigsRouter;
