import { createGMPClient } from "@axelarjs/api";

export default createGMPClient({
  prefixUrl: String(process.env.NEXT_PUBLIC_GMP_API_URL),
});
