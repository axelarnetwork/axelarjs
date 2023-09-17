import ky, { type Options } from "ky";

import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiBrowserClient = (options: Options) =>
  DepositAddressClient.init({
    target: "browser",
    instance: ky.extend(options),
  });
