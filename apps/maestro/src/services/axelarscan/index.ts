import { createAxelarscanClient } from "@axelarjs/api/axelarscan";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export default createAxelarscanClient(NEXT_PUBLIC_NETWORK_ENV);
