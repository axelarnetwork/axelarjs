import { Maybe } from "@axelarjs/utils";

import { map, split, trim, uniq } from "rambda";

export const NEXT_PUBLIC_SITE_URL = Maybe.of(
  process.env.NEXT_PUBLIC_SITE_URL
).mapOr("http://localhost:3000", String);

export const NEXT_PUBLIC_E2E_ENABLED =
  process.env.NEXT_PUBLIC_E2E_ENABLED === "true";

export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = Maybe.of(
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
).mapOr("", String);

export const NEXT_PUBLIC_NETWORK_ENV = String(
  process.env.NEXT_PUBLIC_NETWORK_ENV ?? "testnet"
) as "mainnet" | "testnet";

export const NEXT_PUBLIC_AXELAR_CONFIGS_URL = Maybe.of(
  process.env.NEXT_PUBLIC_AXELAR_CONFIGS_URL
).mapOr(
  "https://github.com/axelarnetwork/axelar-configs/blob/main/cli/wizard/commands/list-squid-token/README.md",
  String
);

export const NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS
).mapOr("0x", String) as `0x${string}`;

export const NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS
).mapOr("0x", String) as `0x${string}`;

export const NEXT_PUBLIC_EXPLORER_URL = Maybe.of(
  process.env.NEXT_PUBLIC_EXPLORER_URL
).mapOr("", String);

export const NEXT_PUBLIC_FILE_BUG_REPORT_URL = Maybe.of(
  process.env.NEXT_PUBLIC_FILE_BUG_REPORT_URL
).mapOr("", String);

export const NEXT_PUBLIC_VERCEL_URL = Maybe.of(
  process.env.NEXT_PUBLIC_VERCEL_URL
).mapOr("http://localhost:3000", String);

export const NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = Maybe.of(
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
).mapOr("", String);

export const NEXT_PUBLIC_GA_MEASUREMENT_ID = Maybe.of(
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
).mapOr("", String);

export const NEXT_PUBLIC_DISABLE_AUTH =
  process.env.NODE_ENV === "development" &&
  Maybe.of(process.env.NEXT_PUBLIC_DISABLE_AUTH).mapOr("false", String) ===
    "true";

export const NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT
).mapOr(150000, Number);

export const NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT
).mapOr(1000000, Number);

export const NEXT_PUBLIC_DISABLED_CHAINS = Maybe.of(
  process.env.NEXT_PUBLIC_DISABLED_CHAINS
)
  .map(split(","))
  .map(uniq)
  .mapOr([], map(trim));

export const NEXT_PUBLIC_DISABLED_WALLET_IDS = Maybe.of(
  process.env.NEXT_PUBLIC_DISABLED_WALLET_IDS
)
  .map(split(","))
  .mapOr([], map(trim));

export const NEXT_PUBLIC_GIT_BRANCH = Maybe.of(
  process.env.NEXT_PUBLIC_GIT_BRANCH
).mapOr("main", String);

export const NEXT_PUBLIC_COMPETITION_START_TIMESTAMP = Maybe.of(
  process.env.NEXT_PUBLIC_COMPETITION_START_TIMESTAMP
).mapOr("", String);

export const NEXT_PUBLIC_COMPETITION_END_TIMESTAMP = Maybe.of(
  process.env.NEXT_PUBLIC_COMPETITION_END_TIMESTAMP
).mapOr("", String);

export const NEXT_PUBLIC_ENABLED_FEATURES = Maybe.of(
  process.env.NEXT_PUBLIC_ENABLED_FEATURES
).mapOr([], (val) => String(val).split(","));

export const shouldDisableSend = (
  axelarChainId: string,
  tokenAddress: `0x${string}`
) => {
  const shouldDisable: Record<string, Record<`0x${string}`, boolean>> = {
    optimism: { "0x4200000000000000000000000000000000000042": true },
  };
  return shouldDisable[axelarChainId]?.[tokenAddress];
};

export const NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK = Maybe.of(
  process.env.NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK
).mapOr(
  "https://docs.google.com/forms/u/0/d/1EoA2eYA5OK_BagoB4lgqiS67hIiDpZ7ssov1UUksD_Y/viewform",
  String
);

export const ClaimOwnershipFormFieldIds = {
  tokenAddress: "entry.263424059",
  tokenType: "entry.2010215617",
  allChains: "entry.414624060",
  sourceChain: "entry.373826717",
};
