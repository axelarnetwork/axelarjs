import got, { type Options } from "got/dist/source";

import { GMPClient } from "./isomorphic";

export const createGMPNodeClient = (options: Options) =>
  GMPClient.init({
    target: "node",
    instance: got.extend(options),
  });
