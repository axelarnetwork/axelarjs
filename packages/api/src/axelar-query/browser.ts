import { Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryBrowserClient = (
  env: Environment,
  options: Options
) =>
  AxelarQueryAPIClient.init(env, {
    target: "browser",
    instance: ky.extend(options),
  });
