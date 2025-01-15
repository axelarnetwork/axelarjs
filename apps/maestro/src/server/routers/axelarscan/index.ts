import { router } from "~/server/trpc";
import { getChainConfigs } from "./getChainConfigs";
import { getCosmosChainConfigs } from "./getCosmosChainConfigs";
import { getEVMChainConfigs } from "./getEVMChainConfigs";
import { getVMChainConfigs } from "./getVMChainConfigs";

export const axelarscanRouter = router({
  getChainConfigs,
  getEVMChainConfigs,
  getVMChainConfigs,
  getCosmosChainConfigs,
});

export type AxelarscanRouter = typeof axelarscanRouter;
