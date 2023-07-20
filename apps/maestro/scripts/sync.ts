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

dotenv.config(
  hasEnvLocal
    ? {
        path: envLocalPath,
      }
    : undefined
);

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
  "contracts"
);

const contractFolders = await fs
  .readdir(contractsDir)
  .then((xs) => xs.filter((x) => /^[a-z-0-9]+$/.test(x)));

const destFolder = path.join(process.cwd(), "src", "lib", "contracts");

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
    (folder) => `import  ${toConstantName(folder)}_ABI from "./${folder}.abi";`
  )
  .join("\n")
  .concat("\n\n", contractConfigs);

const formatted = prettier.format(content, { parser: "typescript" });

await fs.writeFile(path.join(destFolder, "index.ts"), formatted);

console.log(`Synced ${contractFolders.length} contract ABIs to ${destFolder}`);
