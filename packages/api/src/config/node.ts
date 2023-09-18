import got, { type Options } from "got";

import { ConfigClient } from "./isomorphic";

export const createS3NodeClient = (options: Partial<Options>) =>
  ConfigClient.init({
    target: "node",
    instance: got.extend(options),
  });
