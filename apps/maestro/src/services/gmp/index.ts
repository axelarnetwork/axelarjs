import { createGMPBrowserClient } from "@axelarjs/api/gmp/browser";

export default createGMPBrowserClient({
  prefixUrl: String(process.env.NEXT_PUBLIC_GMP_API_URL),
});
