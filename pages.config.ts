import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  pages: [{
    path: "pages/home/index",
    type: "home",
    isHomePage: true
  }, {
    path: "pages/mine/index"
  }],
  tabBar: {
    custom: true,
    color: undefined,
    selectedColor: undefined,
    list: [{
      pagePath: "pages/home/index"
    }, {
      pagePath: "pages/mine/index"
    }]
  },
  subPackages: [],
  preloadRule: {},
  globalStyle: {
    navigationStyle: "custom",
    pageOrientation: "portrait",
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff",
    "h5": {
      navigationBarTitleText: ""
    },
    "mp-weixin": {
      handleWebviewPreload: "auto",
      visualEffectInBackground: "none"
    },
    "app-plus": {
      bounce: "none"
    }
  }
});