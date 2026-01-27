import process from "node:process";
import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV!, process.cwd());

export default defineUniPages({
  tabBar: {
    custom: true
  },
  globalStyle: {
    navigationStyle: "custom",
    navigationBarTitleText: env.VITE_PLATFORM_NAME,
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff",
    "mp-weixin": {
      handleWebviewPreload: "auto"
    }
  }
});