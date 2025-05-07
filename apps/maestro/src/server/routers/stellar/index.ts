import { router } from "~/server/trpc";
// Import the getDeployTokenTx procedure directly from the file
import { getDeployTokenTx } from "./getDeployTokenTx";

export const stellarRouter = router({
  getDeployTokenTx,
});
