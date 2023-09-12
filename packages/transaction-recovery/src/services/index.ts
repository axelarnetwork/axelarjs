import { createGMPNodeClient } from "@axelarjs/api/gmp/node";
import { createS3NodeClient } from "@axelarjs/api/s3/node";
import { AXELARSCAN_API_URLS, Environment } from "@axelarjs/core";

export const gmpClient = (env: Environment) =>
  createGMPNodeClient({
    prefixUrl: AXELARSCAN_API_URLS[env],
  });

export const s3Client = (env: Environment) =>
  createS3NodeClient({
    prefixUrl: "",
  });
