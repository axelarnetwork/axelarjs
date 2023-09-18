import { Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { createGMPBrowserClient } from "..";
import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryBrowserClient = (
  env: Environment,
  options?: Options
) =>
  AxelarQueryAPIClient.init(
    {
      target: "browser",
      instance: ky.extend(options ?? {}),
    },
    {
      gmpClient: createGMPBrowserClient(env),
    }
  );
