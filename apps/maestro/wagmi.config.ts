import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

import { contracts } from "./src/lib/contracts";

export default defineConfig(
  contracts.flatMap((contract) => [
    {
      out: `src/lib/contracts/${contract.name}.hooks.ts`,
      contracts: [contract],
      plugins: [react()],
    },
    {
      out: `src/lib/contracts/${contract.name}.actions.ts`,
      contracts: [contract],
      plugins: [
        actions({
          prepareWriteContract: true,
          watchContractEvent: true,
        }),
      ],
    },
  ])
);
