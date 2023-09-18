import { Environment } from "@axelarjs/core";

import got, { type Options } from "got";

import { createGMPNodeClient } from "..";
import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryNodeClient = (
  env: Environment,
  options?: Partial<Options>
) =>
  AxelarQueryAPIClient.init(
    {
      target: "node",
      instance: got.extend(options ?? {}),
    },
    {
      gmpClient: createGMPNodeClient(env),
    }
  );
