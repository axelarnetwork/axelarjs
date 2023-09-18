import { Environment } from "@axelarjs/core";

export type SendOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  module: string;
  environment: Environment;
};
