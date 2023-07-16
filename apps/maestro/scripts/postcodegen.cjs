#!/usr/bin/env node

const path = require("path");
const fs = require("fs/promises");
const prettier = require("prettier");

const destFolder = path.join(__dirname, "..", "src", "lib", "contracts");

const ESLINT_DISABLE_PREFIX =
  "/* eslint-disable @typescript-eslint/consistent-type-imports */";

/**
 * prepend eslint-disable to the top of the file
 * @param {string} prefix
 * @param {string} fileName
 */
async function prepend(prefix, fileName) {
  const filePath = path.join(destFolder, fileName);

  const content = await fs.readFile(filePath, "utf-8");

  const updatedContent = [prefix, content].join("\n\n");

  const formattedContent = prettier.format(updatedContent, {
    parser: "babel-ts",
  });

  await fs.writeFile(filePath, formattedContent);
}

async function main() {
  const patchFiles = await fs
    .readdir(destFolder)
    .then((xs) => xs.filter((x) => /\.(hooks|actions)\.ts/.test(x)));

  await Promise.all(patchFiles.map(prepend.bind(null, ESLINT_DISABLE_PREFIX)));
}

main();
