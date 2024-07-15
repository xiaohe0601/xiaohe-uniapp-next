import QS from "qs";

export interface RouteOptions {
  /**
   * 跳转对象
   */
  target?: "self" | "miniProgram" | "embeddedMiniProgram";
  /**
   * 跳转链接
   */
  url?: PageUrls | string;
  /**
   * 跳转方式
   */
  type?: "navigateTo" | "navigate" | "push" | "redirectTo" | "redirect" | "replace" | "switchTab" | "reLaunch" | "navigateBack" | "back" | "restart" | "exit";
  /**
   * 链接参数（除"switchTab"外其他带url或path的跳转方式有效）
   */
  params?: string | Record<string, any>;
  /**
   * 回退层数（仅"navigateBack"|"back"有效）
   */
  delta?: number;
  /**
   * 页面间通信接口（仅"navigateTo" | "navigate" | "push"有效）
   */
  // eslint-disable-next-line ts/no-unsafe-function-type
  events?: Record<string, Function>;

  /**
   * 要打开的小程序appId
   */
  appId?: string;
  /**
   * 打开的页面路径
   */
  path?: string;
  /**
   * 需要传递给目标小程序的数据
   */
  extraData?: Record<string, any>;
  /**
   * 要打开的小程序版本
   */
  version?: "develop" | "trial" | "release";
  /**
   * 小程序链接
   */
  shortLink?: string;
  /**
   * 校验方式
   */
  verify?: "binding" | "unionProduct";
  /**
   * 不reLaunch目标小程序，直接打开目标跳转的小程序退后台时的页面
   */
  noRelaunchIfPathUnchanged?: boolean;
  /**
   * 打开的小程序是否支持全屏
   */
  allowFullScreen?: boolean;
}

export default class Router {

  public static route(options: RouteOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const params: OptionalString = options.params && (typeof options.params === "string" ? options.params : QS.stringify(options.params));

      const url: string = `${options.url ?? ""}${params ? `?${params}` : ""}`;
      const path: string = `${options.path ?? ""}${params ? `?${params}` : ""}`;

      switch (options.type) {
        case "navigateTo":
        case "navigate":
        case "push": {
          switch (options.target) {
            case undefined:
            case "self": {
              uni.navigateTo({
                url,
                events: options.events,
                success: resolve,
                fail: reject
              });
              break;
            }
            case "miniProgram": {
              // #ifdef MP-WEIXIN
              wx.navigateToMiniProgram({
                appId: options.appId,
                path,
                extraData: options.extraData,
                envVersion: options.version,
                shortLink: options.shortLink,
                noRelaunchIfPathUnchanged: options.noRelaunchIfPathUnchanged,
                success: resolve,
                fail: reject
              });
              // #endif
              break;
            }
            case "embeddedMiniProgram": {
              // #ifdef MP-WEIXIN
              wx.openEmbeddedMiniProgram({
                appId: options.appId!,
                path,
                extraData: options.extraData,
                envVersion: options.version,
                shortLink: options.shortLink,
                verify: options.verify,
                noRelaunchIfPathUnchanged: options.noRelaunchIfPathUnchanged,
                allowFullScreen: options.allowFullScreen,
                success: resolve,
                fail: reject
              });
              // #endif
              break;
            }
          }
          break;
        }
        case "redirectTo":
        case "redirect":
        case "replace": {
          uni.redirectTo({
            url,
            success: resolve,
            fail: reject
          });
          break;
        }
        case "switchTab": {
          uni.switchTab({
            url,
            success: resolve,
            fail: reject
          });
          break;
        }
        case "reLaunch": {
          uni.reLaunch({
            url,
            success: resolve,
            fail: reject
          });
          break;
        }
        case "navigateBack":
        case "back": {
          switch (options.target) {
            case undefined:
            case "self": {
              uni.navigateBack({
                delta: options.delta!,
                success: resolve,
                fail: reject
              });
              break;
            }
            case "miniProgram": {
              // #ifdef MP-WEIXIN
              wx.navigateBackMiniProgram({
                extraData: options.extraData,
                success: resolve,
                fail: reject
              });
              // #endif
              break;
            }
          }
          break;
        }
        case "restart": {
          // #ifdef MP-WEIXIN
          wx.restartMiniProgram({
            path,
            success: resolve,
            fail: reject
          });
          // #endif
          break;
        }
        case "exit": {
          // #ifdef MP-WEIXIN
          uni.exitMiniProgram({
            success: resolve,
            fail: reject
          });
          // #endif
          break;
        }
      }
    });
  }

  public static navigate(url: RouteOptions["url"], options?: Omit<RouteOptions, "type" | "url">): Promise<any> {
    return Router.route(Object.assign({}, {
      url,
      type: "navigateTo"
    } satisfies RouteOptions, options));
  }

  public static redirect(url: RouteOptions["url"], options?: Omit<RouteOptions, "type" | "url">): Promise<any> {
    return Router.route(Object.assign({}, {
      url,
      type: "redirectTo"
    } satisfies RouteOptions, options));
  }

  public static switchTab(url: RouteOptions["url"], options?: Omit<RouteOptions, "type" | "url">): Promise<any> {
    return Router.route(Object.assign({}, {
      url,
      type: "switchTab"
    } satisfies RouteOptions, options));
  }

  public static reLaunch(url: RouteOptions["url"], options?: Omit<RouteOptions, "type" | "url">): Promise<any> {
    return Router.route(Object.assign({}, {
      url,
      type: "reLaunch"
    } satisfies RouteOptions, options));
  }

  public static back(delta?: RouteOptions["delta"], options?: Omit<RouteOptions, "type" | "delta">): Promise<any> {
    return Router.route(Object.assign({}, {
      delta,
      type: "navigateBack"
    } satisfies RouteOptions, options));
  }

  public static restart(path: RouteOptions["path"], options?: Omit<RouteOptions, "type" | "path">): Promise<any> {
    return Router.route(Object.assign({}, {
      path,
      type: "restart"
    } satisfies RouteOptions, options));
  }

  public static exit(options?: Omit<RouteOptions, "type">): Promise<any> {
    return Router.route(Object.assign({}, {
      type: "exit"
    } satisfies RouteOptions, options));
  }

}