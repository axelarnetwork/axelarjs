import fs from "fs/promises";
import chalk from "chalk";
import packageJson from "package-json";
import stripAnsi from "strip-ansi";

const REPOSITORY_URL = "https://github.com/axelarnetwork/axelarjs";

const pad = (n = 0, char = " ") => char.repeat(n);

type Line = string | ((ctx: { center: (str: string) => string }) => string);

const makeCenter =
  (maxLength: number, padding: number) =>
  (str = "") => {
    const len = stripAnsi(str).length;
    const raw = (maxLength - padding * 2 - len) / 2;
    const [padL, padR] = [Math.floor, Math.ceil].map((f) => pad(f(raw)));

    return `${padL}${str}${padR}`;
  };

function renderBox(
  lines: Line[] = [],
  { color = chalk.green, padding = 1 } = {}
) {
  const maxLineLength = lines
    .map((line) =>
      typeof line === "function" ? line({ center: (x) => x }) : line
    )
    .reduce((max, line) => Math.max(max, stripAnsi(line).length), 0);

  const maxLength = maxLineLength + padding * 2;

  const center = makeCenter(maxLength, padding);

  const [tr, tl, br, bl, h, v] = [
    color("╗"),
    color("╔"),
    color("╝"),
    color("╚"),
    color("═"),
    color("║"),
  ];

  const border = h.repeat(maxLength);

  const py = `\n${v}${pad(maxLength)}${v}`.repeat(padding / 2);

  console.log(`
${tl}${border}${tr}${py}
${lines
  .map((line) => {
    const [short, long] = [
      maxLength,
      stripAnsi(typeof line === "function" ? line({ center }) : line).length,
    ].sort() as [number, number];

    const padX = pad(padding);
    const rPad = long === short ? 0 : long - short - padding * 2;

    const withBounds = (str = "") => `${v}${padX}${str}${padX}${v}`;

    return typeof line === "function"
      ? withBounds(`${line({ center })}`)
      : withBounds(`${line}${pad(Math.max(rPad, 0))}`);
  })
  .join("\n")}${py}
${bl}${border}${br}`);
}

const PACKAGE_LOCK_FILES = ["yarn.lock", "package-lock.json", "pnpm-lock.yaml"];

/**
 * inferPackageManager - infer package manager
 * @returns {Promise<"yarn" | "npm" | "pnpm">}
 */
async function inferPackageManager() {
  const [hasYarnLock, hasPackageLock, hasPnpmLock] = await Promise.all(
    PACKAGE_LOCK_FILES.map((file) =>
      fs
        .readFile(file, "utf8")
        .then(Boolean)
        .catch(() => false)
    )
  );

  if (hasYarnLock) return "yarn";
  if (hasPackageLock) return "npm";
  if (hasPnpmLock) return "pnpm";

  return "npm";
}

async function main() {
  const { version, name } = await fs
    .readFile("./package.json", "utf-8")
    .then(JSON.parse);

  // check for latest version on npm
  const { version: latest } = await packageJson(name, {
    version: "latest",
  }).catch(() => ({ version: "0.1.1" }));

  if (version == latest) {
    // nothing to see here
    return;
  }

  const releaseUrl = `${REPOSITORY_URL}/releases/tag/v${latest}`;
  const changelogUrl = `${REPOSITORY_URL}/blob/v${latest}/CHANGELOG.md`;

  const updateLine = chalk.bold(
    `📦 Update available! ${chalk.red(version)} → ${chalk.green(latest)}`
  );

  const AXELARJS_TAG = [
    "                     .__                 __",
    "_____  ___  ___ ____ |  | _____ _______ |__| ______",
    "\\__  \\ \\  \\/  // __ \\|  | \\__  \\\\_  __ \\|  |/  ___/",
    " / __ \\_>    <\\  ___/|  |__/ __ \\|  | \\/|  |\\___ \\",
    "(____  /__/\\_ \\\\___  >____(____  /__/\\__|  /____  >",
    "     \\/      \\/    \\/          \\/   \\______|    \\/",
  ];

  const packageManager = await inferPackageManager();

  const installCommands = {
    npm: `npm i ${name}@latest`,
    yarn: `yarn add ${name}@latest`,
    pnpm: `pnpm add ${name}@latest`,
  };

  renderBox(
    [
      ...AXELARJS_TAG.map((x) => chalk.bold.green(pad(9).concat(x))),
      "",
      (ctx) => ctx.center(chalk.bold.yellow(name)),
      "",
      (ctx) => ctx.center(updateLine),
      "",
      (ctx) =>
        ctx.center(
          `Run ${chalk.bgGray(installCommands[packageManager])} to update!`
        ),
      "",
      "Find out more about this release:",
      "",
      `${chalk.cyan(changelogUrl)}`,
      `${chalk.cyan(releaseUrl)}`,
      "",
    ],
    {
      color: chalk.bold.yellow,
    }
  );
}

main().catch(console.error);
