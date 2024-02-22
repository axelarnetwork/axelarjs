import { confirm } from "@inquirer/prompts";
import { $ } from "zx";

import { name, version } from "../package.json";

$.verbose = false;

const TAG = `${name}@${version}`;

async function main() {
  console.log(`🚀  Creating release ${TAG} 🚀`);

  // use zx to check if the tag already exists, include remote tags
  const tagExists = await $`git tag --list ${TAG}`;

  if (tagExists.stdout) {
    console.log(`❌  Tag ${TAG} already exists`);
    return;
  }

  // check if gh is installed
  try {
    await $`gh --version`;
  } catch (e) {
    console.error(
      `❌  gh is not installed. Please install it from https://cli.github.com/`
    );
    return;
  }

  // check if the user is logged in
  try {
    await $`gh auth status`;
  } catch (e) {
    console.error(
      `❌  You are not logged in to GitHub. Please run 'gh auth login'`
    );
    return;
  }

  const changelogFile = await $`cat CHANGELOG.md`;

  const changelogLines = changelogFile.stdout.split("\n");

  // find the line with the version
  const changelogLineStartIndex = changelogLines.findIndex((line) =>
    line.startsWith(`## ${version}`)
  );

  const changelogLineEndIndex = changelogLines.findIndex(
    (line, index) =>
      index > changelogLineStartIndex && /^## \d+\.\d+\.\d+/.test(line)
  );

  const changelogContent = changelogLines
    .slice(changelogLineStartIndex + 2, changelogLineEndIndex)
    .join("\n");

  const changelog = `Release ${TAG}\n\n${changelogContent}`;

  // confirm the changelog

  console.log(changelog);

  const answer = await confirm({ message: "Is the changelog correct?" });

  if (!answer) {
    console.log("❌  Aborted");
    return;
  }

  console.log("Creating release tag...");

  // create tag
  await $`git tag -a ${TAG} -m ${changelog}`;

  // push tag
  await $`git push origin ${TAG}`;

  console.log(`✅  Release tag ${TAG} created`);

  // create a release on GitHub
  await $`gh release create ${TAG} -F -`;

  console.log(`✅  Release ${TAG} created on GitHub`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
