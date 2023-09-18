import { AXELAR_CONFIG_API_URLS, Environment } from "@axelarjs/core";

import got, { type Options } from "got";

import { ConfigClient } from "./isomorphic";

export const createAxelarConfigNodeClient = (
  env: Environment,
  options?: Partial<Options>
) =>
  ConfigClient.init({
    target: "node",
    instance: got.extend({
      ...(options ?? {
        prefixUrl: AXELAR_CONFIG_API_URLS[env],
      }),
    }),
  });
