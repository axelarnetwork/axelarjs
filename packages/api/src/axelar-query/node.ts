import got, { type Options } from "got/dist/source";

import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryNodeClient = (options: Options) =>
  AxelarQueryAPIClient.init({
    target: "node",
    instance: got.extend(options),
  });
