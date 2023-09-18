import { Environment, GMP_API_URLS } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { GMPClient } from "./isomorphic";

export const createGMPBrowserClient = (env: Environment, options?: Options) =>
  GMPClient.init({
    target: "browser",
    instance: ky.extend({
      ...(options ?? {
        prefixUrl: GMP_API_URLS[env],
      }),
    }),
  });
