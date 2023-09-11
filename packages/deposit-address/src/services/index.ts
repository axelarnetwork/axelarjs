import { createS3NodeClient } from "@axelarjs/api/s3/node";
import { AXELARSCAN_API_URLS, Environment } from "@axelarjs/core";

export const s3Client = (env: Environment) =>
  createS3NodeClient({
    prefixUrl: AXELARSCAN_API_URLS[env],
  });
