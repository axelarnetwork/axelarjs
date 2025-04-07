import { router } from "~/server/trpc";
import { getChainConfigs } from "./getChainConfigs";
import { getCosmosChainConfigs } from "./getCosmosChainConfigs";

export const axelarscanRouter = router({
  getChainConfigs,
  getCosmosChainConfigs,
});

export type AxelarscanRouter = typeof axelarscanRouter;
