import { createGMPClient } from "@axelarjs/api/gmp";

export default createGMPClient({
  prefixUrl: String(process.env.NEXT_PUBLIC_GMP_API_URL),
});
