#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const prettier = require("prettier");

const kebabToPascalCase = (str = "") =>
  str
    .split("-")
    .reduce((acc, x) => acc.concat(x[0].toUpperCase().concat(x.slice(1))), "");

const kebabToConstantCase = (str = "") => str.toUpperCase().replace(/\-/g, "_");

const CONTRACT_FOLDERS = [
  "interchain-token-service",
  "interchain-token",
  "token-manager",
];

async function main() {
  for (const folder of CONTRACT_FOLDERS) {
    const pascalName = kebabToPascalCase(folder);
    const constantName = kebabToConstantCase(folder);

    const {
      contractName,
      abi,
    } = require(`@axelar-network/interchain-token-service/dist/${folder}/${pascalName}.sol/${pascalName}.json`);

    const indexFile = `
import { Chain } from "viem";

import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./${folder}.abi";

export const ${constantName}_ABI = ABI_FILE.abi;

export class ${contractName}Client extends PublicContractClient<
  typeof ABI_FILE.abi
> {
  static ABI = ABI_FILE.abi;
  static contractName = ABI_FILE.contractName;

  constructor(options: { chain: Chain; address: \`0x\${string}\` }) {
    super({
      abi: ${constantName}_ABI,
      address: options.address,
      chain: options.chain,
    });
  }
}`;

    const abiFile = `
export default ${JSON.stringify({ contractName, abi }, null, 2)} as const;
    `;

    const basePath = path.join(__dirname, "..", "src", "contracts", folder);

    // create folder if it doesn't exist
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }

    // write index file
    fs.writeFileSync(
      path.join(basePath, "index.ts"),
      prettier.format(indexFile, { parser: "babel-ts" })
    );

    // write abi file
    fs.writeFileSync(
      path.join(basePath, `${folder}.abi.ts`),
      prettier.format(abiFile, { parser: "babel-ts" })
    );
  }
}

main();
