import { AXELAR_CONFIG_API_URLS, Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { AxelarConfigClient } from "./isomorphic";

export const createAxelarConfigBrowserClient = (
  env: Environment,
  options?: Options
) =>
  AxelarConfigClient.init({
    target: "browser",
    instance: ky.extend({
      ...(options ?? {
        prefixUrl: AXELAR_CONFIG_API_URLS[env],
      }),
    }),
  });
