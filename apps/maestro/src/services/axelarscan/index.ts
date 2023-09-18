import { createAxelarscanBrowserClient } from "@axelarjs/api/axelarscan/browser";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export default createAxelarscanBrowserClient(NEXT_PUBLIC_NETWORK_ENV);
