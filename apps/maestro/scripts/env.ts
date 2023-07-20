#!/usr/bin/env zx
import fs from "fs/promises";
import dotenv from "dotenv";
import prettier from "prettier";
import { pipe } from "rambda";

const format = (x: string) => prettier.format(x, { parser: "babel-ts" });

/**
 * Generates a TypeScript export statement for an environment variable.
 *
 * @param {string} envVar - The name of the environment variable.
 */
const generateExportStatement = (envVar: string) => `
  export const ${envVar} = Maybe.of<string>(process.env.${envVar});
`;

/**
 * Generates a TypeScript file with export statements for the given environment variables.
 *
 * @param {string[]} envVars - The names of the environment variables.
 */
const generateTsFileContent = (envVars: string[]) => `
  import { Maybe } from "@axelarjs/utils";

  ${envVars.map(generateExportStatement).join("\n")}
`;

/**
 * Tries to read a .env file and generate a TypeScript file with type-safe environment variables.
 *
 * @param {string} envFilePath - The path of the .env file.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 */
function tryGenerateTsFile(envFilePath: string, outputPath: string) {
  return fs
    .readFile(envFilePath)
    .then(
      pipe(
        dotenv.parse,
        Object.keys,
        generateTsFileContent,
        format,
        fs.writeFile.bind(null, outputPath)
      )
    )
    .then(() => true)
    .catch(() => false);
}

/**
 * Generates a TypeScript file with type-safe environment variables read from a list of .env files.
 *
 * @param {string[]} envFilePaths - The paths of the .env files.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 */
async function generateTsFile(envFilePaths: string[], outputPath: string) {
  for (const envFilePath of envFilePaths) {
    if (await tryGenerateTsFile(envFilePath, outputPath)) {
      console.log(`Generated ${outputPath} from ${envFilePath} 🎉`);
      break;
    }
  }
}

await generateTsFile([".env.local", ".env"], "src/config/env-safe.ts");
