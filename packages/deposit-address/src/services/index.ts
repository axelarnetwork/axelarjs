import { createDepositAddressApiNodeClient } from "@axelarjs/api/deposit-address-api/node";
import { createGMPNodeClient } from "@axelarjs/api/gmp/node";
import { createS3NodeClient } from "@axelarjs/api/s3/node";
import { AXELARSCAN_API_URLS, Environment, S3_API_URLS } from "@axelarjs/core";

export const gmpClient = (env: Environment) =>
  createGMPNodeClient({
    prefixUrl: AXELARSCAN_API_URLS[env],
  });

export const s3Client = (env: Environment) =>
  createS3NodeClient({
    prefixUrl: S3_API_URLS[env],
  });

export const depositAddressClient = () =>
  createDepositAddressApiNodeClient({
    prefixUrl: "https://nest-server-testnet.axelar.dev/", //TODO, hard-coded for now
  });
