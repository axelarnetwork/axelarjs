#!/usr/bin/env node
import { exec } from "child_process";
import { readFile, writeFile } from "fs/promises";

import { rainbow } from "./lib";

const scriptName = rainbow("postexport");

console.log(`\nRunning ${scriptName} script...`);

const nextIndexHtml = await readFile("./out/index.html", "utf-8").then((x) =>
  x.replace(/\_next\//g, "next/")
);

await Promise.all([
  exec("mv out/_next out/next"),
  writeFile("./out/index.html", nextIndexHtml),
]);

console.log(`\nFinished ${scriptName} script!`);
