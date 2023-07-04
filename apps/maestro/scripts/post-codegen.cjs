const path = require("path");
const fs = require("fs/promises");
const prettier = require("prettier");

async function main() {
  const destFolder = path.join(__dirname, "..", "src", "lib", "contracts");

  // prepednd /* eslint-disable */ to the top of the file

  const filePath = path.join(destFolder, "hooks.ts");

  const content = await fs.readFile(filePath, "utf-8");

  const updatedContent = [
    "/* eslint-disable @typescript-eslint/consistent-type-imports */",
    content,
  ].join("\n\n");

  await fs.writeFile(filePath, updatedContent);
}

main();
