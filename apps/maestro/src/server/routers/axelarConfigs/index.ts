import { router } from "~/server/trpc";
import { getConfigForChain } from "./getChainConfigs";
import { getEvmChainConfigs } from "./getEvmChainConfigs";
import { getVmChainConfigs } from "./getVmChainConfigs";

export const axelarConfigsRouter = router({
  getChainConfigs: getConfigForChain,
  getVmChainConfigs,
  getEvmChainConfigs,
});

export type AxelarConfigsRouter = typeof axelarConfigsRouter;
