import got, { type Options } from "got";

import { S3Client } from "./isomorphic";

export const createS3NodeClient = (options: Partial<Options>) =>
  S3Client.init({
    target: "node",
    instance: got.extend(options),
  });
