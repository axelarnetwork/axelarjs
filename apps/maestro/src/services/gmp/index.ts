import { createGMPClient } from "@axelarjs/api/gmp";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

const networkEnv =
  NEXT_PUBLIC_NETWORK_ENV === "mainnet"
    ? "mainnet"
    : NEXT_PUBLIC_NETWORK_ENV === "testnet"
      ? "testnet"
      : "devnet-amplifier";

export default createGMPClient(networkEnv);
