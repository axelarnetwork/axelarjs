import { router } from "~/server/trpc";
import { getERC20TokenDetails } from "./getERC20TokenDetails";

export const erc20Router = router({
  getERC20TokenDetails,
});

// export type definition of API
export type ERC20Router = typeof erc20Router;
