const path = require("path");
const fs = require("fs/promises");
const prettier = require("prettier");

async function main() {
  const contractsDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "packages",
    "evm",
    "src",
    "lib",
    "contracts"
  );

  const contractFolders = await fs
    .readdir(contractsDir)
    .then((xs) => xs.filter((x) => /^[a-z-]+$/.test(x)));

  await Promise.all(
    contractFolders.map((folder) =>
      fs.copyFile(
        path.join(contractsDir, folder, `${folder}.abi.ts`),
        path.join(__dirname, "..", "src", "contracts", `${folder}.abi.ts`)
      )
    )
  );

  const toConstantName = (contract = "") =>
    contract.toUpperCase().replace(/\-/g, "_").concat("_ABI");

  const contractConfigs = `export const contracts = [
    ${contractFolders
      .map((folder) => {
        const CONST_NAME = toConstantName(folder);
        return `({ name: ${CONST_NAME}.contractName, abi: ${CONST_NAME}.abi })`;
      })
      .join(",\n")}
  ]`;

  const indexContent = contractFolders
    .map((folder) => `import ${toConstantName(folder)} from "./${folder}.abi";`)
    .join("\n")
    .concat("\n\n", contractConfigs);

  await fs.writeFile(
    path.join(__dirname, "..", "src", "contracts", "index.ts"),
    prettier.format(indexContent, { parser: "babel-ts" })
  );
}

main();
