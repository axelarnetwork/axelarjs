import { defineConfig } from "tsup";
import { glob } from "zx";

const componetns = await glob("src/components/**/index.ts");

export default defineConfig((options) => ({
  entry: [
    "src/index.ts",
    "src/hooks/index.ts",
    "src/utils.ts",
    "src/theme.ts",
    "src/toast.ts",
    "src/tw/index.ts",
    ...componetns.filter((c) => !c.includes("StoryPlayground")),
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
