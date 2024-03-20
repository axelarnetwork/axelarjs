#!/usr/bin/env zx
import prettier from "prettier";
import { $, argv, chalk, fs, glob, path, spinner } from "zx";

import { ARGS_FILE, GENERATED_DISCLAIMER, INDEX_FILE } from "./templates";
import { ABIItem } from "./types";
import { pascalToConstName, pascalToKebabCase } from "./utils";

$.verbose = false;

/**
 * Extracts the contract formatted name and path from the folder name
 *
 * @param folderPath
 */
function extractContractNameAndPath(folderPath: string) {
  const pascalName = path.basename(folderPath).replace(/.sol$/, "");

  return {
    pascalName,
    kebabName: pascalToKebabCase(pascalName),
    abiPath: path.join(folderPath, `${pascalName}.json`),
  };
}

export type NamingConvention = "pascal" | "kebab" | undefined;

export type CodegenOptions = {
  excludePatterns?: string[];
  outputFolder?: string;
  flatten?: boolean;
  foldercase?: NamingConvention;
  filecase?: NamingConvention;
  index?: boolean;
  client?: string;
};

export type CodegenConfig = CodegenOptions & {
  /**
   * The folder where the contracts are located
   */
  contractsFolder: string;
};

async function codegenContract({
  abiPath = "",
  abiFileJson = "",
  pascalName = "",
  contractFolder = "",
  foldercase = "",
  filecase = "",
  index = false,
  clientPath = "",
}) {
  const { abi, contractName } = JSON.parse(abiFileJson) as {
    abi: ABIItem[];
    contractName: string;
  };

  const abiJsonFile = `${JSON.stringify({ contractName, abi }, null, 2)}`;

  // only generate args file if there are functions with inputs
  const abiFns = abi.filter((x) => x.type === "function");

  // replace ERC* with erc* and EIP* with eip* to avoid inconsistent casing
  const sanitizedPascalName = pascalName.replace(
    /^(ERC|EIP)([0-9]+)/,
    (_, p1, p2) => `${p1.toLowerCase()}${p2}`,
  );
  const kebabtName = pascalToKebabCase(sanitizedPascalName);

  const fileName = filecase === "kebab" ? kebabtName : pascalName;
  const folderName = foldercase === "kebab" ? kebabtName : pascalName;

  const constantName = pascalToConstName(pascalName);

  const abiFile = `
    export default ${abiJsonFile} as const;
    `;

  const subPath = path.dirname(
    contractFolder.replace(config.contractsFolder, ""),
  );

  const outputFolderPath = path.resolve(config.outputFolder ?? "");

  const outputPath = path.join(
    config.flatten ? outputFolderPath : path.join(outputFolderPath, subPath),
    folderName,
  );

  // create base path folder
  await $`mkdir -p ${outputPath}`;

  const files = [
    {
      name: `${fileName}.abi.ts`,
      content: abiFile,
      parser: "babel-ts",
    },
  ];

  const readFns = abiFns.filter(
    (x) => x.stateMutability === "view" || x.stateMutability === "pure",
  );

  if (abiFns.length) {
    const argsFile = ARGS_FILE({
      pascalName,
      abiFns,
      fileName,
      constantName,
      readFns,
      clientPath,
    });

    files.push({
      name: `${fileName}.args.ts`,
      content: argsFile,
      parser: "babel-ts",
    });
  }

  if (index) {
    const indexFile = INDEX_FILE({
      fileName,
      constantName,
      pascalName,
      clientPath,
      hasArgs: abiFns.length > 0,
      hasReadFns: readFns.length > 0,
    });

    files.push({
      name: "index.ts",
      content: indexFile,
      parser: "babel-ts",
    });
  }

  // write files
  await Promise.all(
    files.map(async ({ name, content, parser }) =>
      {
        const file = await prettier.format(
          parser === "json"
            ? content
            : `${GENERATED_DISCLAIMER({ abiPath })}\n\n${content}`,
          { parser },
        )
        return fs.writeFile(
        path.join(outputPath, name),
        file,
      )},
    ),
  );
}

async function codegen(config: CodegenConfig) {
  const ignored =
    config.excludePatterns?.flatMap((pattern) => [
      `${config.contractsFolder}/${pattern}/**`,
      `**/${pattern}/**`,
    ]) ?? [];

  const contractFolders = await glob(`${config.contractsFolder}/**/**.sol`, {
    onlyDirectories: true,
    ignore: ignored,
  });

  const promises = contractFolders.map(async (contractFolder) => {
    const { pascalName, abiPath } = extractContractNameAndPath(contractFolder);

    const { stdout: abiFileJson } = await $`cat ./${abiPath}`;

    if (!abiFileJson) {
      console.log(`ABI file not found: ${abiPath}`);
      return;
    }

    try {
      await codegenContract({
        abiFileJson,
        abiPath,
        contractFolder,
        pascalName,
        foldercase: config.foldercase,
        filecase: config.filecase,
        index: config.index,
        clientPath: config.client,
      });
    } catch (error) {
      console.error(`Failed to process contract ${pascalName}`, error);
    }
  });

  await spinner("Generating contract ABIs", () => Promise.all(promises));

  const summary = `Done. Generated ${chalk.green(
    contractFolders.length,
  )} typed contract ABIs! 🎉`;
  console.log(summary);
  process.exit(0);
}

const HELP_BLOCK = `
Usage: codegen [options]

Options:
  --src <src>         The folder where the contracts are located (required)
  --out <out>         The folder where the generated files will be written (required)
  --exclude <exclude> Comma separated list of glob patterns to exclude (optional, default: [])
  --flatten           Whether to flatten the output folder structure (optional, default: false)
  --filecase          The case of the generated file names (optional, default: pascal)
  --foldercase        The case of the generated folder names (optional, default: pascal)
  --index             Whether to generate index files (optional, default: false)
  --client            Path to the PublicClient module (optional, default: "@axelarjs/evm")
`;

function printMissingArgument(arg: string) {
  console.error(chalk.yellow(`Missing argument: ${chalk.red(arg)}`));
  console.log(HELP_BLOCK);
}

function validateArg(arg: string, type: string) {
  if (!argv[arg] || typeof argv[arg] !== type) {
    printMissingArgument(arg);
    process.exit(0);
  }
}

/**
 * parseConfig
 *
 * Parses the command line arguments
 * @returns {CodegenConfig}
 */
function parseConfig(): CodegenConfig {
  validateArg("src", "string");
  validateArg("out", "string");

  return {
    contractsFolder: String(argv["src"] ?? ""),
    outputFolder: String(argv["out"] ?? ""),
    excludePatterns: String(argv["exclude"] ?? "").split(","),
    foldercase: argv["foldercase"] as NamingConvention,
    filecase: argv["filecase"] as NamingConvention,
    index: Boolean(argv["index"] ?? false),
    client: String(argv["client"] ?? "@axelarjs/evm"),
    flatten: Boolean(argv["flatten"] ?? false),
  };
}

const config = parseConfig();

codegen(config).catch((err) => {
  console.error(err);
  process.exit(1);
});
