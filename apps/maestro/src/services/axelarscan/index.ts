import { createAxelarscanBrowserClient } from "@axelarjs/api/axelarscan/browser";

export default createAxelarscanBrowserClient({
  prefixUrl: String(process.env.NEXT_PUBLIC_EXPLORER_API_URL),
});
