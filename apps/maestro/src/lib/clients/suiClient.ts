import { SUI_RPC_URLS } from "@axelarjs/core";

import { SuiClient } from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schemas/latest";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

// Initialize SuiClient directly with RPC from config
export const suiClient = new SuiClient({
  url: SUI_RPC_URLS[NEXT_PUBLIC_NETWORK_ENV],
});

const SUI_GRAPHQL_URLS = {
  mainnet: "https://graphql.mainnet.sui.io/graphql",
  testnet: "https://graphql.testnet.sui.io/graphql",
  ["devnet-amplifier"]: "https://graphql.devnet.sui.io/graphql",
};

export const suiGraphQLClient = new SuiGraphQLClient({
  url: SUI_GRAPHQL_URLS[NEXT_PUBLIC_NETWORK_ENV],
});

export const suiQuery = graphql;
