const path = require("path");
const fs = require("fs/promises");

const destFolder = path.join(__dirname, "..", "src", "lib", "contracts");

/**
 * prepend eslint-disable to the top of the file
 * @param {string} fileName
 */
async function prepend(fileName) {
  const filePath = path.join(destFolder, fileName);

  const content = await fs.readFile(filePath, "utf-8");

  const updatedContent = [
    "/* eslint-disable @typescript-eslint/consistent-type-imports */",
    content,
  ].join("\n\n");

  await fs.writeFile(filePath, updatedContent);
}

async function main() {
  const patchFiles = await fs
    .readdir(destFolder)
    .then((xs) => xs.filter((x) => /\.(hooks|actions)\.ts/.test(x)));

  await Promise.all(patchFiles.map(prepend));
}

main();
