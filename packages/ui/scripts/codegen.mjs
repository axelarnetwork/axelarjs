#!/usr/bin/env zx
import { Command } from "commander";

import "zx/globals";

import path from "path";

import { prompt } from "./lib.mjs";

const VALID_KINDS = ["component", "compound", "hook"];

const codegen =
  (kind = "component") =>
  async (componentName = "") => {
    if (!VALID_KINDS.includes(kind)) {
      throw new Error(`Invalid kind: ${kind}`);
    }

    let component = componentName;

    if (!component) {
      component = await prompt("Component name: ");
    }

    const targetDirName = `${kind}s`;

    const componentsDir = path.resolve("src", targetDirName);

    const targetDir = path.resolve(componentsDir, component);

    const message = `
This will scaffold a new component under ${targetDir}. 

The following files will be created:

- ${targetDir}/index.js
- ${targetDir}/${component}.tsx
- ${targetDir}/${component}.stories.tsx
- ${targetDir}/${component}.spec.tsx

Do you want to continue?
  `.trim();

    const answer = await prompt(message, ["y", "n"], "y");

    /**
     * @param {string} content
     * @returns
     */
    const replaceName = (content) =>
      content.replace(/ReactComponent/gi, component);

    if (answer === "y") {
      $.verbose = false;

      const templateName =
        kind === "compound" ? "ReactCompound" : "ReactComponent";

      const { stdout: indexContent } =
        await $`cat scripts/templates/${templateName}/index.ts`;
      const { stdout: componentContent } =
        await $`cat scripts/templates/${templateName}/ReactComponent.tsx`;
      const { stdout: storiesContent } =
        await $`cat scripts/templates/${templateName}/ReactComponent.stories.tsx`;
      const { stdout: specContent } =
        await $`cat scripts/templates/${templateName}/ReactComponent.spec.tsx`;

      const { stdout: componentsContent } = await $`ls ${componentsDir}`;
      const components = componentsContent
        .split("\n")
        .filter(Boolean)
        .map((x) => x.trim());

      const componentsIndexContent = components
        .filter((x) => x !== "index.ts")
        .concat([component])
        .sort((a, b) => a.localeCompare(b))
        .map((x) => `export * from "./${x}";`)
        .join("\n");

      try {
        console.log("Creating component...\n");

        if (!(indexContent || componentContent || storiesContent)) {
          throw new Error(
            `Missing one or more required values: (${Object.keys({
              indexContent,
              componentContent,
              storiesContent,
            })
              .filter((x) => !x)
              .join(", ")})`
          );
        }

        await $`mkdir ${targetDir}`;
        await $`echo ${replaceName(indexContent)} > ${targetDir}/index.ts`;
        await $`echo ${replaceName(
          componentContent
        )} > ${targetDir}/${component}.tsx`;
        await $`echo ${replaceName(
          storiesContent
        )} > ${targetDir}/${component}.stories.tsx`;
        await $`echo ${replaceName(
          specContent
        )} > ${targetDir}/${component}.spec.tsx`;

        await $`echo ${replaceName(
          componentsIndexContent
        )} > ${componentsDir}/index.ts`;

        console.log(`Created component (${component}): \n- ${targetDir}/`);

        process.exit(0);
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Failed to create component (${component})`);
        }
        process.exit(0);
      }
    } else {
      console.log("Aborted\n");
      process.exit(1);
    }
  };

const program = new Command();

program
  .name("codegen")
  .description("CLI to scaffold mew UI components")
  .version("0.8.0");

program
  .command("component")
  .description(
    "Scaffold a new component under src/components with a stories file"
  )
  .argument("<componentName>", "component name")
  .action(codegen("component"));

program
  .command("compound")
  .description(
    "Scaffold a new compound under src/compounds with a stories file"
  )
  .argument("<compoundName>", "compound name")
  .action(codegen("compound"));

program.parse();
