import { defineConfig } from "tsup";
import { glob } from "zx";

const componetns = await glob("src/components/**/index.ts");

export default defineConfig((options) => ({
  entry: [
    "src/index.ts",
    "src/utils.ts",
    "src/theme.ts",
    "src/hooks/index.ts",
    "src/toaster/index.ts",
    "src/tw/index.ts",
    ...componetns,
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  dts: true,
  minify: !options.watch,
  format: ["cjs", "esm"],
  external: ["react"],
}));
