#!/usr/bin/env zx
import fs from "fs/promises";
import dotenv from "dotenv";
import prettier from "prettier";

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
 * Writes content to a file.
 *
 * @param {string} filePath - The path of the file.
 * @param {string} content - The content to write.
 */
async function writeToFile(filePath: string, content: string) {
  try {
    await fs.writeFile(filePath, content);
    console.log("Generated TypeScript file with environment variables.");
  } catch (err) {
    console.error(
      "Failed to generate TypeScript file with environment variables.",
      err
    );
  }
}

/**
 * Tries to read a .env file and generate a TypeScript file with type-safe environment variables.
 *
 * @param {string} envFilePath - The path of the .env file.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 */
async function tryGenerateTsFile(envFilePath: string, outputPath: string) {
  try {
    const data = await fs.readFile(envFilePath);
    const envConfig = dotenv.parse(data);
    const envVars = Object.keys(envConfig);
    const content = generateTsFileContent(envVars);
    const formatted = prettier.format(content, {
      parser: "babel-ts",
    });

    await writeToFile(outputPath, formatted);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Generates a TypeScript file with type-safe environment variables read from a list of .env files.
 *
 * @param {string[]} envFilePaths - The paths of the .env files.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 */
async function generateTsFile(envFilePaths: string[], outputPath: string) {
  for (const envFilePath of envFilePaths) {
    const success = await tryGenerateTsFile(envFilePath, outputPath);
    if (success) {
      break;
    }
  }
}

generateTsFile([".env.local", ".env"], "src/config/env-safe.ts");
