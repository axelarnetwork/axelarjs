const fs = require("fs").promises;
const dotenv = require("dotenv");
const prettier = require("prettier");

/**
 * Generates a TypeScript export statement for an environment variable.
 *
 * @param {string} envVar - The name of the environment variable.
 * @returns {string} The TypeScript export statement.
 */
const generateExportStatement = (envVar) => `
export const ${envVar} = Maybe.of<string>(process.env.${envVar});
`;

/**
 * Generates a TypeScript file with export statements for the given environment variables.
 *
 * @param {string[]} envVars - The names of the environment variables.
 * @returns {string} The TypeScript file content.
 */
const generateTsFileContent = (envVars) => `
import { Maybe } from "@axelarjs/utils";
${envVars.map(generateExportStatement).join("\n")}
`;

/**
 * Writes content to a file.
 *
 * @param {string} filePath - The path of the file.
 * @param {string} content - The content to write.
 */
const writeToFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    console.log("Generated TypeScript file with environment variables.");
  } catch (err) {
    console.error(
      "Failed to generate TypeScript file with environment variables.",
      err
    );
  }
};

/**
 * Tries to read a .env file and generate a TypeScript file with type-safe environment variables.
 *
 * @param {string} envFilePath - The path of the .env file.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 * @returns {Promise<boolean>} A promise that resolves to true if the .env file was successfully read and the TypeScript file was generated, or false otherwise.
 */
const tryGenerateTsFile = async (envFilePath, outputPath) => {
  try {
    const data = await fs.readFile(envFilePath);
    const envConfig = dotenv.parse(data);
    const envVars = Object.keys(envConfig);
    const fileContent = generateTsFileContent(envVars);
    const formattedFileContent = prettier.format(fileContent, {
      parser: "babel-ts",
    });

    await writeToFile(outputPath, formattedFileContent);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Generates a TypeScript file with type-safe environment variables read from a list of .env files.
 *
 * @param {string[]} envFilePaths - The paths of the .env files.
 * @param {string} outputPath - The path of the TypeScript file to generate.
 */
const generateTsFile = async (envFilePaths, outputPath) => {
  for (const envFilePath of envFilePaths) {
    const success = await tryGenerateTsFile(envFilePath, outputPath);
    if (success) {
      break;
    }
  }
};

generateTsFile([".env.local", ".env"], "src/config/env-safe.ts");
