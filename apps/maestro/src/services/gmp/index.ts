import { createGMPBrowserClient } from "@axelarjs/api/gmp/browser";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export default createGMPBrowserClient(NEXT_PUBLIC_NETWORK_ENV);
