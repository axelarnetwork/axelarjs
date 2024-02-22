import { $ } from "zx";

import { name, version } from "../package.json";

const TAG = `${name}@${version}`;

async function main() {
  console.log(`🚀  Creating release ${TAG} 🚀`);

  // use zx to check if the tag already exists, include remote tags
  const tagExists = await $`git tag --list ${TAG}`;

  if (tagExists.stdout) {
    console.log(`❌  Tag ${TAG} already exists`);
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
