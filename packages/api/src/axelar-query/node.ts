import { Environment } from "@axelarjs/core";

import got, { type Options } from "got";

import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryNodeClient = (
  env: Environment,
  options: Partial<Options>
) =>
  AxelarQueryAPIClient.init(env, {
    target: "node",
    instance: got.extend(options),
  });
