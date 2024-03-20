import { defineConfig, type Config } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";

import { contracts } from "./src/lib/contracts";

export default defineConfig(
  contracts.flatMap((contract): Config[] => [
    {
      out: `src/lib/contracts/${contract.name}.hooks.ts`,
      contracts: [contract],
      plugins: [react()],
    },
  ]),
);
