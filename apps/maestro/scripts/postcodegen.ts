#!/usr/bin/env zx
import fs from "fs/promises";
import path from "path";
import prettier from "prettier";
import { filter, test } from "rambda";

const destFolder = path.join(process.cwd(), "src", "lib", "contracts");

const DISABLED_RULES = [
  "@typescript-eslint/consistent-type-imports",
  "@typescript-eslint/no-explicit-any",
];

const ESLINT_DISABLE_PREFIX = DISABLED_RULES.map(
  (rule) => `/* eslint-disable ${rule} */`,
).join("\n");

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

async function replaceContentInFile(filePath: string) {
  // Read the content of the file
  const fileContent = await fs.readFile(filePath, "utf8");

  // Regular expression to match the pattern and capture the dynamic constant name
  // The part '(\w+ABI)' captures the dynamic constant name
  const regexPattern = /(export const (\w+ABI) = \[\s*[\s\S]*?\]) as const;/;

  const fileName = path.basename(filePath);

  // Replace the matched content with the new content, maintaining the dynamic name
  const replacedContent = fileContent
    .replace(regexPattern, (_match, _p1, p2) => {
      return `export const ${p2} = ABI.abi;`;
    })
    .replace(
      `from "wagmi";`,
      `from "wagmi";
       import ABI from "./${fileName.replace("hooks.ts", "abi")}";`,
    );

  const formattedContent = await prettier.format(replacedContent, {
    parser: "typescript",
  });

  await fs.writeFile(filePath, formattedContent);
}

await Promise.all(
  patchFiles.map(async (file) => {
    await prepend(ESLINT_DISABLE_PREFIX, file);
    await replaceContentInFile(path.join(destFolder, file));
  }),
);

console.log(`\nPatched ${patchFiles.length} files 🎉`);
