import got, { type Options } from "got";

import { GMPClient } from "./isomorphic";

export const createGMPNodeClient = (options: Partial<Options>) =>
  GMPClient.init({
    target: "node",
    instance: got.extend(options),
  });
