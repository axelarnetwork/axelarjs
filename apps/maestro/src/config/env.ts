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
) as "mainnet" | "testnet" | "devnet-amplifier";

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

export const NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM = Maybe.of(
  process.env.NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM
)
  .map(split(","))
  .map(uniq)
  .mapOr([], map(trim));

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

// Pick from a sample interchain-transfer transaction https://sepolia.basescan.org/tx/0x54f040456df1711dbf31bf1cb1daa7acb82d1bca495ef443758c2759f9625716
const DEFAULT_INTERCHAIN_TRANSFER_EXECUTE_DATA =
  "0x49160658894cb2826b06d326a8008a3a66bbcb6f5992ac1f1a885d7577932d74d9fbbc02000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000094176616c616e6368650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078423546423442453032323332423162424134644338663831646332344332363938306445396533430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000dc04fedabe3d0f56dba44980b7700fe3d140e57a9a7ad6739fb3affc11d8606800000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000009b84561e3768e2e5b1d404000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000014a57adce1d2fe72949e4308867d894cd7e7de0ef20000000000000000000000000000000000000000000000000000000000000000000000000000000000000014a57adce1d2fe72949e4308867d894cd7e7de0ef20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export const NEXT_PUBLIC_INTERCHAIN_TRANSFER_EXECUTE_DATA = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_TRANSFER_EXECUTE_DATA
).mapOr(DEFAULT_INTERCHAIN_TRANSFER_EXECUTE_DATA, String);

export const NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT
).mapOr(1500000, Number);

// Pick from a sample interchain deployment transaction https://sepolia.basescan.org/tx/0x6ef27a7d27f29380a9d518197bf98733e4f9ef44f6050ab1d10de9dafba3564c
const INTERCHAIN_DEPLOYMENT_EXECUTE_DATA =
  "0x49160658d7858403c8024a51def3dc055b5f6b01eac52629281717d6f6e602b8c0ed7d21000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000066178656c6172000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000416178656c6172316171636a35346c7a7a30726b323267767167636e38667235747834727a776476357776356a39646d6e6163676566766437777a7379326a326d720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000037375690000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000019649511d8881f8f33e75a6e1c86979c04cac188d0013b46a5ad621abdf71301500000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000036161610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000342424200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export const NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA = Maybe.of(
  process.env.NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA
).mapOr(INTERCHAIN_DEPLOYMENT_EXECUTE_DATA, String);

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

// Max 3 decimals
export const FEE_MULTIPLIER = Maybe.of(process.env.FEE_MULTIPLIER).mapOr(
  1,
  Number
);

export const SUI_SERVICE = Maybe.of(process.env.SUI_SERVICE).mapOr(
  "https://melted-fayth-nptytn-57e5d396.koyeb.app",
  String
);

export const shouldDisableSend = (
  axelarChainId: string,
  tokenAddress: string
) => {
  const shouldDisable: Record<string, Record<string, boolean>> = {
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
  tokenName: "entry.1492946428",
};

/**
 * Minimum time between notifications for the same RPC node issue (in seconds)
 * Default: 30 minutes
 */
export const NOTIFICATION_COOLDOWN_SECONDS = Maybe.of(
  process.env.NOTIFICATION_COOLDOWN_SECONDS
).mapOr(30 * 60, Number);
