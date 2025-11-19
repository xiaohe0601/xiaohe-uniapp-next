import { defineConfig } from "@xiaohe01/eslint-config";

export default defineConfig({
  pnpm: true,
  ignores: [
    "src/custom-tab-bar",
    "src/uni_modules"
  ]
});