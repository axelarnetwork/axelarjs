import { SUI_RPC_URLS } from "@axelarjs/core";
import { SuiClient } from "@mysten/sui/client";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

// Initialize SuiClient directly with RPC from config
export const suiClient = new SuiClient({
  url: SUI_RPC_URLS[NEXT_PUBLIC_NETWORK_ENV],
});

