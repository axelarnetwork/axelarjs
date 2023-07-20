#!/usr/bin/env node
import { readFile, writeFile } from "fs/promises";

import { rainbow } from "./lib";

const scriptName = rainbow("postbuild");

console.log(`\nRunning ${scriptName} script...`);

const { version } = await readFile("./package.json", "utf-8").then(JSON.parse);
const manifestJson = await readFile("./public/manifest.json", "utf-8").then(
  JSON.parse
);

const nextManifestJson = JSON.stringify({ ...manifestJson, version }, null, 2);

await writeFile("./public/manifest.json", nextManifestJson);

console.log(`\nFinished ${scriptName} script!`);
