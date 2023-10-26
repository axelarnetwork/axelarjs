import { router } from "~/server/trpc";
import { generateInterchainDeploymentHaiku } from "./generateInterchainDeploymentHaiku";

export const openaiRouter = router({
  generateInterchainDeploymentHaiku,
});

export type OpenAIRouter = typeof openaiRouter;
