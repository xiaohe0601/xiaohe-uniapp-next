/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * uniapp的appid
   */
  readonly VITE_UNI_APPID: string;
  /**
   * 版本名称
   */
  readonly VITE_VERSION_NAME: string;
  /**
   * 版本号
   */
  readonly VITE_VERSION_CODE: string;
  /**
   * H5路由模式
   */
  readonly VITE_H5_ROUTER_MODE: "hash" | "history";
  /**
   * H5路由基础路径
   */
  readonly VITE_H5_BASE_URL: string;
  /**
   * 微信小程序的appid
   */
  readonly VITE_WEIXIN_APPID: string;
  /**
   * 平台名称
   */
  readonly VITE_PLATFORM_NAME: string;
  /**
   * 请求基地址
   */
  readonly VITE_REQUEST_BASE_URL: string;
  /**
   * 资源基地址
   */
  readonly VITE_SOURCE_BASE_URL: string;
  /**
   * 是否启用console剔除
   */
  readonly VITE_ENABLE_DROP_CONSOLE: string;
  /**
   * 是否启用vConsole
   */
  readonly VITE_ENABLE_VCONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}