import { uniq } from "rambda";

export const APP_NAME = "Interchain Token Service";
export const APP_TITLE = "Interchain Token Service. Build once, run anywhere.";

export const DISABLED_CHAINS = uniq(
  String(process.env.NEXT_PUBLIC_DISABLED_CHAINS)
    .split(",")
    .map((chain) => chain.trim())
);

export const IS_STAGING = process.env.NEXT_PUBLIC_SITE_URL?.includes("staging");
