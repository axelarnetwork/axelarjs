import { AXELARSCAN_API_URLS, type Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanBrowserClient = (
  env: Environment,
  options?: Options
) =>
  AxelarscanClient.init({
    target: "browser",
    instance: ky.extend({
      ...(options ?? {
        prefixUrl: AXELARSCAN_API_URLS[env],
      }),
    }),
  });
