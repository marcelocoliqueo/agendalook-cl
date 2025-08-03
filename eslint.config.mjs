import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { js: { ignorePatterns: [] } },
  allConfig: { js: { ignorePatterns: [] } },
});

const js = () => [
  ...compat.extends("next/core-web-vitals"),
];

export default [
  {
    ignores: ["node_modules/", ".next/", "out/", "dist/"],
  },
  ...js(),
];
