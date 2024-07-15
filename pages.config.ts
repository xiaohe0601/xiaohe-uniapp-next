import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      "^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)": "z-paging/components/z-paging$1/z-paging$1.vue"
    }
  },
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
      pagePath: "pages/home/index",
      text: "首页",
      icon: "home"
    }, {
      pagePath: "pages/mine/index",
      text: "我的",
      icon: "mine"
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