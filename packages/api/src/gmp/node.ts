import { Environment, GMP_API_URLS } from "@axelarjs/core";

import got, { type Options } from "got";

import { GMPClient } from "./isomorphic";

export const createGMPNodeClient = (
  env: Environment,
  options?: Partial<Options>
) =>
  GMPClient.init({
    target: "node",
    instance: got.extend({
      ...(options ?? {
        prefixUrl: GMP_API_URLS[env],
      }),
    }),
  });
