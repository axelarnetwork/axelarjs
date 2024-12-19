import { createGMPClient } from "@axelarjs/api/gmp";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export default createGMPClient(
  NEXT_PUBLIC_NETWORK_ENV === "devnet-amplifier" ? "testnet" : "mainnet"
);
