import path from "node:path";
import UniApp from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import type { PluginOption, TerserOptions } from "vite";
import { defineConfig, loadEnv } from "vite";

function r(...paths: string[]) {
  return path.resolve(process.cwd(), ".", ...paths);
}

function buildPlugins(): PluginOption[] {
  return [
    UniManifest(),
    UniPages({
      dts: "types/uni-pages.d.ts",
      mergePages: false
    }),
    UniComponents({
      dts: "types/components.d.ts",
      dirs: ["src/components"],
      directoryAsNamespace: true,
      collapseSamePrefixes: true
    }),
    AutoImport({
      dts: "types/auto-imports.d.ts",
      imports: ["vue", "uni-app", "pinia"]
    }),
    UnoCSS(),
    // @ts-expect-error whatever
    UniApp.default()
  ];
}

function buildTerserOptions(mode: string, env: Record<string, string>) {
  const options: TerserOptions = {};

  if (mode === "development") {
    options.compress = false;
  } else {
    options.compress = {
      keep_infinity: true,
      drop_console: env.VITE_ENABLE_DROP_CONSOLE === "true",
      drop_debugger: true
    };
  }

  return options;
}

export default defineConfig(({ mode }) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: {
        "@": r("src")
      }
    },
    plugins: buildPlugins(),
    server: {
      host: true,
      port: 5173
    },
    build: {
      minify: "terser",
      terserOptions: buildTerserOptions(mode, env)
    }
  };
});