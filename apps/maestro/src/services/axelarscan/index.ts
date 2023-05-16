import { createAxelarscanClient } from "@axelarjs/api/axelarscan";

export default createAxelarscanClient({
  prefixUrl: String(process.env.NEXT_PUBLIC_EXPLORER_API_URL),
});
