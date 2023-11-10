#!/usr/bin/env zx
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import prettier from "prettier";

// checks if .env.local exists
const envLocalPath = path.join(process.cwd(), ".env.local");
const hasEnvLocal = await fs
  .access(envLocalPath)
  .then(() => true)
  .catch(() => false);

// load .env.local if it exists, otherwise load .env
dotenv.config(hasEnvLocal ? { path: envLocalPath } : undefined);

console.log(
  `📝 Loaded environment variables from ${
    hasEnvLocal ? ".env.local" : ".env"
  }\n`
);

const contractsDir = path.join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "evm",
  "src",
  "contracts",
  "its"
);

const WHITELISTED_CONTRACTS = [
  "IERC20MintableBurnable",
  "InterchainTokenService",
  "InterchainTokenFactory",
  "InterchainToken",
];

const contractFolders = await fs
  .readdir(contractsDir)
  .then((xs) => xs.filter((x) => WHITELISTED_CONTRACTS.includes(x)));

const destFolder = path.join(process.cwd(), "src", "lib", "contracts");

await Promise.all(
  contractFolders.map((folder) =>
    fs.copyFile(
      path.join(contractsDir, folder, `${folder}.abi.ts`),
      path.join(destFolder, `${folder}.abi.ts`)
    )
  )
);

const pascalToConstName = (contract = "") =>
  contract
    .replace(/([A-Z])/g, "_$1")
    .replace(/-/g, "_")
    .replace(/^_/, "")
    .toUpperCase()
    // handle ERC*, IERC* and Interface* names
    .replace(/^E_R_C/, "ERC")
    .replace(/^I_E_R_C/, "IERC")
    .replace(/^I_/, "I");

const contractConfigs = `export const contracts = [
    ${contractFolders
      .map((folder) => {
        const constName = pascalToConstName(folder);
        const envKey = `NEXT_PUBLIC_${constName}_ADDRESS`;
        const contractAddress = process.env[envKey];
        const abiConstName = `${constName}_ABI`;

        if (!contractAddress) {
          const envFile = hasEnvLocal
            ? ".env.local"
            : "Vercel environment variables";
          console.warn(
            `WARNING: ${envKey} is missing under ${envFile}. The interactions will require an explicit address.\n`
          );
        }

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

const content = contractFolders
  .map(
    (folder) =>
      `import  ${pascalToConstName(folder)}_ABI from "./${folder}.abi";`
  )
  .join("\n")
  .concat("\n\n", contractConfigs);

const formatted = prettier.format(content, { parser: "typescript" });

await fs.writeFile(path.join(destFolder, "index.ts"), formatted);

console.log(`Synced ${contractFolders.length} contract ABIs 🎉`);
console.log(`dest: ${destFolder}`);
