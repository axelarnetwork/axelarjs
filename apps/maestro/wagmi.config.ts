import { defineConfig } from "@wagmi/cli";
import { erc, react } from "@wagmi/cli/plugins";

import { contracts } from "./src/lib/contracts";

export default defineConfig({
  out: "src/lib/contracts/hooks.ts",
  contracts,
  plugins: [react({}), erc({ 20: true })],
});
