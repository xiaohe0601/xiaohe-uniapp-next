declare module "@uni-helper/vite-plugin-uni-pages" {
  interface PageMetaDatum {
    /** 是否为登录页 */
    isLoginPage?: boolean;
  }

  interface TabBarItem {
    /** 唯一标识 */
    key: string;
  }
}

export {};