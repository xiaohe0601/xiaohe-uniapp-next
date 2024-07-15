import type { ReLaunchOptions } from "./uni-pages.d.ts";

declare module "@uni-helper/vite-plugin-uni-pages" {
  interface PageMetaDatum {
    /**
     * 是否为首页
     */
    isHomePage?: boolean;
    /**
     * 是否为登录页
     */
    isLoginPage?: boolean;
  }
}

declare global {
  type PageUrls = ReLaunchOptions["url"];
}

export {};