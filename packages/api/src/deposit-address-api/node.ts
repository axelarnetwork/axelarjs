import { DEPOSIT_ADDRESS_API_URLS, type Environment } from "@axelarjs/core";

import got, { type Options } from "got";

import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiNodeClient = (
  env: Environment,
  options?: Partial<Options>
) =>
  DepositAddressClient.init({
    target: "node",
    instance: got.extend({
      ...(options ?? {
        prefixUrl: DEPOSIT_ADDRESS_API_URLS[env],
      }),
    }),
  });
