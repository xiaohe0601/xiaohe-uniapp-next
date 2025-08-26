import process from "node:process";
import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV!, process.cwd());

export default defineUniPages({
  easycom: {
    custom: {
      "^nut-(.*)?-(.*)": "nutui-uniapp/components/$1$2/$1$2.vue",
      "^nut-(.*)": "nutui-uniapp/components/$1/$1.vue",
      "^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)": "z-paging/components/z-paging$1/z-paging$1.vue"
    }
  },
  tabBar: {
    custom: true,
    list: [
      {
        key: "home",
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "/static/images/tabbar/home.png",
        selectedIconPath: "/static/images/tabbar/home-selected.png"
      },
      {
        key: "mine",
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "/static/images/tabbar/mine.png",
        selectedIconPath: "/static/images/tabbar/mine-selected.png"
      }
    ]
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