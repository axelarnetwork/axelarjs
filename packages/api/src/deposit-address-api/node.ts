import got, { type Options } from "got";

import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiNodeClient = (options: Partial<Options>) =>
  DepositAddressClient.init({
    target: "node",
    instance: got.extend(options),
  });
