import path from "node:path";
import process from "node:process";
import Uni from "@uni-helper/plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import type { PluginOption, TerserOptions } from "vite";
import { defineConfig, loadEnv } from "vite";
import UniPolyfill from "vite-plugin-uni-polyfill";

function r(...paths: string[]) {
  return path.resolve(process.cwd(), ".", ...paths);
}

function buildPlugins(): PluginOption[] {
  return [
    AutoImport({
      dts: "types/auto-imports.d.ts",
      imports: [
        "vue",
        "uni-app",
        "pinia",
        {
          "@vueuse/core": [
            "useEventBus"
          ]
        },
        {
          "alova/client": [
            "useRequest"
          ]
        },
        {
          "nutui-uniapp/composables": [
            "useToast",
            "useNotify"
          ]
        }
      ],
      dirs: [
        "src/composables",
        "src/stores",
        "src/utils"
      ],
      vueTemplate: true
    }),
    UniComponents({
      dts: "types/components.d.ts",
      dirs: [
        "src/components"
      ],
      directoryAsNamespace: true,
      collapseSamePrefixes: true
    }),
    UniManifest(),
    UniPages({
      dts: "types/uni-pages.d.ts",
      dir: "src/pages",
      subPackages: [],
      exclude: [
        "**/components/**/*.*"
      ]
    }),
    UniPolyfill(),
    Uni(),
    UnoCSS()
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
  const env = loadEnv(mode, process.cwd());

  return {
    base: process.env.UNI_PLATFORM === "h5" ? env.VITE_WEB_BASE_URL : "/",
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
      target: "es6",
      cssTarget: "chrome61",
      terserOptions: buildTerserOptions(mode, env)
    }
  };
});