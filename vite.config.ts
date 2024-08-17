import path from "node:path";
import UniApp from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig, loadEnv } from "vite";

function r(...paths: string[]) {
  return path.resolve(process.cwd(), ".", ...paths);
}

export default defineConfig(({ mode }) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd());

  const compress = ["production", "preview"].includes(mode);

  return {
    resolve: {
      alias: {
        "@": r("src")
      }
    },
    plugins: [
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
    ],
    server: {
      host: true,
      port: 5173
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: compress && {
          keep_infinity: true,
          drop_console: env.VITE_ENABLE_DROP_CONSOLE === "true",
          drop_debugger: true
        }
      }
    }
  };
});