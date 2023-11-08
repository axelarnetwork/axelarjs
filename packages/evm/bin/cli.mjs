#!/usr/bin/env zx
import { $, argv } from "zx";

// List of valid commands
const VALID_COMMANDS = ["codegen"];

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
}

async function run() {
  const COMMAND = argv._[1];

  const NPX_COMMAND = await getNpxCompatibleCommand();

  switch (COMMAND) {
    case "codegen":
      {
        const { src, out, flatten, exclude } = argv;

        await $`${NPX_COMMAND} tsx ./scripts/codegen.ts --src ${src} --out ${out} --exclude ${exclude} ${
          flatten ? "--flatten" : ""
        }`;
      }
      break;
    default:
      await $`echo unknown command received: '${COMMAND}'`;
      await $`echo valid commands:`;

      // eslint-disable-next-line no-undef
      VALID_COMMANDS.forEach((cmd) => console.log(` * ${cmd}`));
  }
}

run().catch((e) => {
  // eslint-disable-next-line no-undef
  console.error(e);
  // eslint-disable-next-line no-undef
  process.exit(1);
});
