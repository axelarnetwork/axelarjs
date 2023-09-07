import { createGMPNodeClient } from "@axelarjs/api/gmp/node";
import { AXELARSCAN_API_URLS, Environment } from "@axelarjs/core";

export const gmpClient = (env: Environment) =>
  createGMPNodeClient({
    prefixUrl: AXELARSCAN_API_URLS[env],
  });
