import got, { type Options } from "got";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanNodeClient = (options: Options) =>
  AxelarscanClient.init({
    target: "node",
    instance: got.extend(options),
  });
