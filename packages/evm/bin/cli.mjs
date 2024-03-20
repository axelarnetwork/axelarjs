#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Command } from "commander";
import { $, path } from "zx";

const program = new Command("codegen");

program
  .description("Run the code generation script")
  .option("--src <source>", "The source directory", "")
  .option("--out <output>", "The output directory", "")
  .option(
    "--foldercase <case>",
    "The case format for the folder names",
    "pascal",
  )
  .option("--filecase <case>", "The case format for the file names", "pascal")
  .option("--exclude <patterns>", "Patterns to exclude", "")
  .option(
    "--client <path>",
    "The path to the publicClient module",
    "@axelarjs/evm",
  )
  .option("--flatten", "Flatten the output", false)
  .option("--index", "Generate index files", false)
  .action(
    async ({
      src,
      out,
      flatten,
      exclude,
      foldercase,
      filecase,
      index,
      client,
    }) => {
      const npx = await getNpxCompatibleCommand();

      const scriptPath = path.join(getDirname(), "../scripts/codegen");

      await $`${npx} tsx ${scriptPath} \
      --src ${src} \
      --out ${out} \
      --foldercase ${foldercase} \
      --filecase ${filecase} \
      --exclude ${exclude} \
      --client ${client} \
      ${index ? "--index" : ""} \
      ${flatten ? "--flatten" : ""}`;
    },
  );

program.parse(process.argv);

function getDirname() {
  return path.dirname(import.meta.url.replace("file://", ""));
}

async function getNpxCompatibleCommand() {
  const commands = ["npx", "pnpx", "bunx"];

  for (const cmd of commands) {
    try {
      await $`command -v ${cmd}`;
      return cmd; // Return early if the command is found
    } catch {
      continue; // Continue to the next iteration if the command is not found
    }
  }
  throw new Error("No compatible NPX command found");
}

// Handle the case when no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
