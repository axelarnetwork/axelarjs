import { AXELARSCAN_API_URLS, Environment } from "@axelarjs/core";

import got, { type Options } from "got";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanNodeClient = (
  env: Environment,
  options?: Partial<Options>
) =>
  AxelarscanClient.init({
    target: "node",
    instance: got.extend({
      ...(options ?? {
        prefixUrl: AXELARSCAN_API_URLS[env],
      }),
    }),
  });
