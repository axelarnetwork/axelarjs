import { AXELARSCAN_API_URLS, Environment, S3_API_URLS } from "@axelarjs/core";

export const getGmpClient = async (env: Environment) =>
  typeof window === "undefined"
    ? (await import("@axelarjs/api/gmp/node")).createGMPNodeClient({
        prefixUrl: AXELARSCAN_API_URLS[env],
      })
    : (await import("@axelarjs/api/gmp/browser")).createGMPBrowserClient({
        prefixUrl: AXELARSCAN_API_URLS[env],
      });

export const getS3Client = async (env: Environment) =>
  typeof window === "undefined"
    ? (await import("@axelarjs/api/s3/node")).createS3NodeClient({
        prefixUrl: S3_API_URLS[env],
      })
    : (await import("@axelarjs/api/s3/browser")).createS3BrowserClient({
        prefixUrl: S3_API_URLS[env],
      });
