import { Maybe } from "@axelarjs/utils";

export const NEXT_PUBLIC_E2E_ENABLED =
  process.env.NEXT_PUBLIC_E2E_ENABLED === "true";

export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = Maybe.of(
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
).mapOr("", String);

export const NEXT_PUBLIC_NETWORK_ENV = String(
  process.env.NEXT_PUBLIC_NETWORK_ENV ?? "testnet"
) as "mainnet" | "testnet";
