import defineConfig from "@xiaohe01/eslint-config";

export default defineConfig({
  uniapp: true,
  markdown: false,
  ignores: [
    "src/custom-tab-bar",
    "src/uni_modules"
  ]
});