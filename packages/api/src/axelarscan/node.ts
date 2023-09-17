import got, { type Options } from "got";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanNodeClient = (options: Partial<Options>) =>
  AxelarscanClient.init({
    target: "node",
    instance: got.extend(options),
  });
