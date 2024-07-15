import path from "node:path";
import UniApp from "@dcloudio/vite-plugin-uni";
import UniHelperComponents from "@uni-helper/vite-plugin-uni-components";
import UniHelperManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniHelperPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig, loadEnv } from "vite";
import { NutResolver } from "nutui-uniapp";

function resolve(dir: string): string {
  return path.resolve(process.cwd(), ".", dir);
}

export default defineConfig(({ mode }) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd());

  const compress: boolean = ["production", "preview"].includes(mode);

  return {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: [
      UniHelperManifest(),
      UniHelperPages({
        dts: "types/uni-pages.d.ts",
        mergePages: false
      }),
      UniHelperComponents({
        dts: "types/components.d.ts",
        dirs: ["src/components"],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        resolvers: [NutResolver()]
      }),
      AutoImport({
        dts: "types/auto-imports.d.ts",
        imports: ["vue", "uni-app", "pinia"]
      }),
      UnoCSS(),
      // @ts-ignore
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