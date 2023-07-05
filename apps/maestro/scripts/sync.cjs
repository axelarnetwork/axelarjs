#!/usr/bin/env node

const path = require("path");
const fs = require("fs/promises");
const prettier = require("prettier");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.local",
});

async function main() {
  const contractsDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "packages",
    "evm",
    "src",
    "contracts"
  );

  const contractFolders = await fs
    .readdir(contractsDir)
    .then((xs) => xs.filter((x) => /^[a-z-0-9]+$/.test(x)));

  const destFolder = path.join(__dirname, "..", "src", "lib", "contracts");

  await Promise.all(
    contractFolders.map((folder) =>
      fs.copyFile(
        path.join(contractsDir, folder, `${folder}.abi.ts`),
        path.join(destFolder, `${folder}.abi.ts`)
      )
    )
  );

  const toConstantName = (contract = "") =>
    contract.toUpperCase().replace(/\-/g, "_");

  const contractConfigs = `export const contracts = [
    ${contractFolders
      .map((folder) => {
        const constName = toConstantName(folder);
        const envKey = `NEXT_PUBLIC_${constName}_ADDRESS`;
        const contractAddress = process.env[envKey];
        const abiConstName = `${constName}_ABI`;

        return `({ 
          name: ${abiConstName}.contractName, 
          abi: ${abiConstName}.abi, 
          address: ${
            contractAddress
              ? `"${contractAddress}" as \`0x\${string}\` // read from .env.local (${envKey})`
              : `undefined // you can set this as ${envKey} in .env.local for fixed contract addresses`
          }
        })`;
      })
      .join(",\n")}
  ]`;

  const content = "".concat(
    contractFolders
      .map(
        (folder) =>
          `import ${toConstantName(folder)}_ABI from "./${folder}.abi";`
      )
      .join("\n")
      .concat("\n\n", contractConfigs)
  );

  const formattedContent = prettier.format(content, {
    parser: "babel-ts",
  });

  await fs.writeFile(path.join(destFolder, "index.ts"), formattedContent);

  console.log(
    `Synced ${contractFolders.length} contract ABIs to ${destFolder}`
  );
}

main();
