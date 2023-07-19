import { Maybe } from "@axelarjs/utils";

export const NEXT_PUBLIC_NETWORK_ENV = Maybe.of<string>(
  process.env.NEXT_PUBLIC_NETWORK_ENV
);

export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = Maybe.of<string>(
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
);

export const NEXT_PUBLIC_APP_NAME = Maybe.of<string>(
  process.env.NEXT_PUBLIC_APP_NAME
);

export const NEXT_PUBLIC_PROJECT_NAME = Maybe.of<string>(
  process.env.NEXT_PUBLIC_PROJECT_NAME
);

export const NEXT_PUBLIC_GTM_ID = Maybe.of<string>(
  process.env.NEXT_PUBLIC_GTM_ID
);

export const NEXT_PUBLIC_EXPLORER_API_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_EXPLORER_API_URL
);

export const NEXT_PUBLIC_GMP_API_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_GMP_API_URL
);

export const NEXT_PUBLIC_RPC_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_RPC_URL
);

export const NEXT_PUBLIC_LCD_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_LCD_URL
);

export const NEXT_PUBLIC_WEBSITE_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_WEBSITE_URL
);

export const NEXT_PUBLIC_EXPLORER_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_EXPLORER_URL
);

export const NEXT_PUBLIC_SITE_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_SITE_URL
);

export const NEXT_PUBLIC_DISABLED_CHAINS = Maybe.of<string>(
  process.env.NEXT_PUBLIC_DISABLED_CHAINS
);

export const NEXT_PUBLIC_TESTNET_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_TESTNET_URL
);

export const NEXT_PUBLIC_MAINNET_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_MAINNET_URL
);

export const NEXT_PUBLIC_DEFAULT_TITLE = Maybe.of<string>(
  process.env.NEXT_PUBLIC_DEFAULT_TITLE
);

export const NEXT_PUBLIC_DEFAULT_DESCRIPTION = Maybe.of<string>(
  process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION
);

export const NEXT_PUBLIC_LOGROCKET_APP_ID = Maybe.of<string>(
  process.env.NEXT_PUBLIC_LOGROCKET_APP_ID
);

export const NEXT_PUBLIC_SENTRY_DSN = Maybe.of<string>(
  process.env.NEXT_PUBLIC_SENTRY_DSN
);

export const NEXT_PUBLIC_E2E_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_E2E_URL
);

export const NEXT_PUBLIC_FILE_BUG_REPORT_URL = Maybe.of<string>(
  process.env.NEXT_PUBLIC_FILE_BUG_REPORT_URL
);

export const NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS = Maybe.of<string>(
  process.env.NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS
);

export const KV_REST_API_READ_ONLY_TOKEN = Maybe.of<string>(
  process.env.KV_REST_API_READ_ONLY_TOKEN
);

export const KV_REST_API_TOKEN = Maybe.of<string>(
  process.env.KV_REST_API_TOKEN
);

export const KV_REST_API_URL = Maybe.of<string>(process.env.KV_REST_API_URL);

export const KV_URL = Maybe.of<string>(process.env.KV_URL);

export const NEXTAUTH_URL = Maybe.of<string>(process.env.NEXTAUTH_URL);

export const NEXTAUTH_SECRET = Maybe.of<string>(process.env.NEXTAUTH_SECRET);

export const JWT_SECRET = Maybe.of<string>(process.env.JWT_SECRET);
