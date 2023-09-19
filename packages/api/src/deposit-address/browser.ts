import { DEPOSIT_ADDRESS_API_URLS, type Environment } from "@axelarjs/core";

import ky, { type Options } from "ky";

import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiBrowserClient = (
  env: Environment,
  options?: Options
) =>
  DepositAddressClient.init({
    target: "browser",
    instance: ky.extend({
      ...(options ?? {
        prefixUrl: DEPOSIT_ADDRESS_API_URLS[env],
      }),
    }),
  });
