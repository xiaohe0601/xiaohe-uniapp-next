declare module "@uni-helper/vite-plugin-uni-pages" {
  interface PageMetaDatum {
    /** 标识 */
    tag?: "login";
  }

  interface TabBarItem {
    /** 唯一标识 */
    key: string;
  }
}

export {};