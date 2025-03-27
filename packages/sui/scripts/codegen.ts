import { createAxelarConfigClient } from "@axelarjs/api";
import type { Environment } from "@axelarjs/core";

import { SuiClient } from "@mysten/sui/client";

import "@typemove/sui";

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// The script won't generate ABIs for these contracts
const IGNORED_CONTRACTS = [];

async function downloadABI(
  suiClient: SuiClient,
  contractAddress: string,
  abiDir = "./src/abis"
) {
  const abi = await suiClient.getNormalizedMoveModulesByPackage({
    package: contractAddress,
  });

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(abiDir, contractAddress + ".json"),
    JSON.stringify(abi, null, 2)
  );
}

function cleanup(dirs: string[]) {
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }
}

async function run() {
  await generate("devnet-amplifier");
  await generate("testnet");
  await generate("mainnet");
}

async function generate(env: Environment) {
  const client = createAxelarConfigClient(env);
  const config = await client.getAxelarConfigs(env);
  const suiChainKey = Object.keys(config.chains).find(
    (key) => config.chains[key].chainType === "sui"
  ) as keyof typeof config.chains;

  const suiConfig = config.chains[suiChainKey];
  const abisDir = `./src/${env}/abis`;
  const typesDir = `./src/${env}/types`;

  // type guard
  if (suiConfig?.chainType !== "sui") {
    throw new Error("Chain type is not sui");
  }

  const { rpc, contracts } = suiConfig.config;
  const suiClient = new SuiClient({ url: rpc[0] });

  const contractNames = Object.keys(suiConfig.config.contracts).filter(
    (contractName) => !IGNORED_CONTRACTS.includes(contractName)
  );

  // Clean up old abis and types
  cleanup([abisDir, typesDir]);

  console.log(
    `Generating Sui ABIs for ${contractNames.length} contracts on ${env}`
  );

  for (const contractName of contractNames) {
    console.log(`Generating Sui ABI for ${contractName} contract...`);

    const key = contractName as keyof typeof contracts;
    const contractAddress = contracts[key].address;

    // Download ABI from the rpc node
    await downloadABI(suiClient, contractAddress, abisDir);

    // This is a hack to avoid conflicts with Transaction class from @mysten/sui
    execSync(
      `sed -i 's/"name": "Transaction"/"name": "TxCall"/g' ${abisDir}/${contractAddress}.json`
    );
  }
  // Replace any "transaction" and "Transaction" with "txCall" and "TxCall" in the contracts["RelayerDiscovery"].address file
  // This is a hack to avoid conflicts with Transaction class from @mysten/sui
  execSync(
    `sed -i 's/"Transaction": {/"TxCall": {/g' ${abisDir}/${contracts["RelayerDiscovery"].address}.json`
  );

  // Generate the typescript files
  execSync(
    `pnpm typemove-sui --network ${rpc[0]} --target-dir=${typesDir} ${abisDir}`
  );

  for (const contractName of contractNames) {
    // replace any _contractAddress with ContractName in the src/types/index.ts file
    const key = contractName as keyof typeof contracts;

    // Replace any _contractAddress with ContractName in the src/types/index.ts file
    execSync(
      `sed -i 's/_${contracts[key].address}/${contractName}/g' ${typesDir}/index.ts`
    );
  }

  console.log("Done!");
}

run().catch(console.error);
