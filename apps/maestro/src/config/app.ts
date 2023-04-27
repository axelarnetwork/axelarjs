import { uniq } from "rambda";

export const APP_NAME = "Interchain Maestro";

export const DISABLED_CHAINS = uniq(
  String(process.env.NEXT_PUBLIC_DISABLED_CHAINS)
    .split(",")
    .map((chain) => chain.trim())
);

export const IS_STAGING = process.env.NEXT_PUBLIC_SITE_URL?.includes("staging");
