#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Command } from "commander";
import { $, path } from "zx";

const program = new Command();

// Define the command and its options
program
  .command("codegen")
  .description("Run the code generation script")
  .option("--src <source>", "The source directory", "")
  .option("--out <output>", "The output directory", "")
  .option("--exclude <patterns>", "Patterns to exclude")
  .option("--flatten", "Flatten the output", false)
  .action(async ({ src, out, flatten, exclude }) => {
    const npx = await getNpxCompatibleCommand();

    const scriptPath = path.join(getDirname(), "../scripts/codegen.ts");

    await $`${npx} tsx ${scriptPath} --src ${src} --out ${out} --exclude ${exclude} ${
      flatten ? "--flatten" : ""
    }`;
  });

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
