import { router } from "~/server/trpc";
import { estimateGasFee } from "./estimateGasFee";
import { estimateGasFeesMultipleChains } from "./estimateGasFeeMultipleChains";

export const axelarjsSDKRouter = router({
  estimateGasFee,
  estimateGasFeesMultipleChains,
});

export type AxelarjsSDKRouter = typeof axelarjsSDKRouter;
