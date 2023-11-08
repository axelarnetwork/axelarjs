#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Command } from "commander";
import { $ } from "zx";

const program = new Command();

// Define the command and its options
program
  .command("codegen")
  .description("Run the code generation script")
  .option("--src <source>", "The source directory")
  .option("--out <output>", "The output directory")
  .option("--flatten", "Flatten the output")
  .option("--exclude <patterns>", "Patterns to exclude")
  .action(async (options) => {
    const { src, out, flatten, exclude } = options;

    const npx = await getNpxCompatibleCommand();

    await $`${npx} tsx ./scripts/codegen.ts --src ${src} --out ${out} --exclude ${exclude} ${
      flatten ? "--flatten" : ""
    }`;
  });

program.parse(process.argv);

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
