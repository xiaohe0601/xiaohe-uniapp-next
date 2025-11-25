import process from "node:process";
import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV!, process.cwd());

export default defineUniPages({
  easycom: {
    custom: {
      "^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)": "z-paging/components/z-paging$1/z-paging$1.vue"
    }
  },
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