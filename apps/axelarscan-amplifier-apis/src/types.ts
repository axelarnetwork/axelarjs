import { DateTime, Str } from "@cloudflare/itty-router-openapi";

export const Chain = {
  name: new Str({ example: "lorem" }),
  amplifierChainId: String,
  description: new Str({ required: false }),
  gasPriceGwei: Number,
  approvalCost: Number,
  updated: new DateTime(),
};
