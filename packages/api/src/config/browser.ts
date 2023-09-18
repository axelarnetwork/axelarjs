import { AXELAR_CONFIG_API_URLS, Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { ConfigClient } from "./isomorphic";

export const createAxelarConfigBrowserClient = (
  env: Environment,
  options?: Options
) =>
  ConfigClient.init({
    target: "browser",
    instance: ky.extend({
      ...(options ?? {
        prefixUrl: AXELAR_CONFIG_API_URLS[env],
      }),
    }),
  });
