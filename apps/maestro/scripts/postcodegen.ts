#!/usr/bin/env zx
import fs from "fs/promises";
import path from "path";
import prettier from "prettier";
import { filter, test } from "rambda";

const destFolder = path.join(process.cwd(), "src", "lib", "contracts");

const ESLINT_DISABLE_PREFIX =
  "/* eslint-disable @typescript-eslint/consistent-type-imports */";

/**
 * prepend eslint-disable to the top of the file
 * @param prefix
 * @param fileName
 */
async function prepend(prefix: string, fileName: string) {
  const filePath = path.join(destFolder, fileName);

  const content = await fs.readFile(filePath, "utf-8");

  const updatedContent = [prefix, content].join("\n\n");

  const formattedContent = await prettier.format(updatedContent, {
    parser: "typescript",
  });

  await fs.writeFile(filePath, formattedContent);
}

const patchFiles = await fs
  .readdir(destFolder)
  .then(filter(test(/\.(hooks|actions)\.ts/)));

await Promise.all(
  patchFiles.map((file) => prepend(ESLINT_DISABLE_PREFIX, file))
);

console.log(`\nPatched ${patchFiles.length} files 🎉`);
