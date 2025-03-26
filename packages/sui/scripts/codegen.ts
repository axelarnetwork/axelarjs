import { createAxelarConfigClient } from "@axelarjs/api";

import { execSync } from "child_process";

const env = process.argv[2] === "mainnet" ? "mainnet" : "testnet";

async function run() {
  const client = createAxelarConfigClient(env);
  const config = await client.getAxelarConfigs(env);
  const suiConfig = config.chains["sui"];

  if (suiConfig?.chainType !== "sui") {
    throw new Error("Chain type is not sui");
  }

  const { rpc, contracts } = suiConfig.config;

  const contractNames = Object.keys(suiConfig.config.contracts);

  console.log(
    `Generating Sui ABIs for ${contractNames.length} contracts on ${env}`
  );

  for (const contractName of contractNames) {
    console.log(`Generating Sui ABI for ${contractName} contract...`);

    const key= contractName as keyof typeof contracts;
    execSync(
      `pnpm typemove-sui --network ${rpc[0]} --target-dir=./src/types --abi-dir=./src/abis ${contracts[key].address}`
    );
  }

  console.log("Done!");
}

run().catch(console.error);
