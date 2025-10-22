declare module "@uni-helper/vite-plugin-uni-pages" {
  interface PageMetaDatum {
    /** 场景 */
    scene?: "login";
  }

  interface TabBarItem {
    /** 唯一标识 */
    key: string;
  }
}

export {};