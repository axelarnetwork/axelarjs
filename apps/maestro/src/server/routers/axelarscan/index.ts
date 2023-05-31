import { router } from "~/server/trpc";
import { getChainConfigs } from "./getChainConfigs";
import { getCosmosChainConfigs } from "./getCosmosChainConfigs";
import { getEVMChainConfigs } from "./getEVMChainConfigs";

export const axelarscanRouter = router({
  getChainConfigs,
  getEVMChainConfigs,
  getCosmosChainConfigs,
});

export type AxelarscanRouter = typeof axelarscanRouter;
