import type { UserProfile } from "@/entities/account/UserProfile.ts";
import { debounce, isEmpty, last } from "@/plugins/lodash.ts";
import { useDeviceStore } from "@/stores/device.ts";
import PagesManager from "@/utils/pages.ts";
import type { RouteOptions } from "@/utils/router.ts";
import Router from "@/utils/router.ts";
import TokenManager from "@/utils/token.ts";

/**
 * 平台信息
 */
export interface PlatformInformation {
  /**
   * 平台名称
   */
  name: string;
}

export const useSystemStore = defineStore("system", () => {
  const deviceStore = useDeviceStore();

  /**
   * 平台信息
   */
  const platform = ref<PlatformInformation>({
    name: import.meta.env.VITE_PLATFORM_NAME
  });

  /**
   * 用户信息
   */
  const profile = ref<NullableValue<UserProfile>>(null);

  /**
   * 拉取用户信息
   */
  async function fetchProfile(): Promise<void> {

  }

  /**
   * 清除用户信息
   */
  function clearProfile(): void {
    profile.value = null;
  }

  /**
   * 退出登录
   *
   * @param call 是否调用接口
   */
  async function logout(call: boolean = true): Promise<void> {
    if (call) {
      const token: NullableString = await TokenManager.get();

      if (!isEmpty(token)) {
        // 调用退出登录接口
      }
    }

    await TokenManager.remove();
  }

  /**
   * 重定向至首页
   */
  async function redirectToHomePage(options: { routeType?: RouteOptions["type"]; } = {}): Promise<void> {
    const url: NullableString = PagesManager.getHomePage()?.path ?? null;

    if (url == null) {
      return;
    }

    if (options.routeType != null) {
      await Router.route({ url, type: options.routeType });
      return;
    }

    if (PagesManager.isTabbarPage(url)) {
      await Router.switchTab(url);
      return;
    }

    const pages: Page.PageInstance[] = getCurrentPages();

    const index: number = pages.findIndex((item) => `/${item.route}` === url);

    if (index >= 0) {
      await Router.back(pages.length - index);
      return;
    }

    await Router.reLaunch(url);
  }

  /**
   * 触发认证失败拦截页面地址
   */
  const authorityInterceptPage = ref<NullableString>(null);

  /**
   * 重定向至认证页面
   *
   * @param options
   * @param options.intercept 是否为认证失败拦截调用(若为用户主动请求重定向至认证页面, 则应传false)
   */
  async function _redirectToAuthorityPage(options: { intercept?: boolean; } = {}): Promise<void> {
    const { intercept } = Object.assign({ intercept: false }, options);

    const url: NullableString = PagesManager.getLoginPage()?.path ?? null;

    if (url == null) {
      return;
    }

    if (intercept) {
      await deviceStore.awaitReadied();

      // @ts-expect-error whatever
      authorityInterceptPage.value = last(getCurrentPages()).$page.fullPath;

      await Router.redirect(url);
    } else {
      authorityInterceptPage.value = null;

      await Router.reLaunch(url);
    }
  }

  const redirectToAuthorityPage = debounce(_redirectToAuthorityPage, 1000, {
    leading: true,
    trailing: false
  });

  /**
   * 重定向至认证失败拦截时的页面
   */
  async function redirectToAuthorityInterceptPage(options: {
    routeType?: RouteOptions["type"];
    url?: string;
  } = {}): Promise<void> {
    const { routeType, url: customUrl } = options;

    if (authorityInterceptPage.value != null) {
      if (PagesManager.isTabbarPage(authorityInterceptPage.value)) {
        await Router.switchTab(authorityInterceptPage.value);
      } else {
        await Router.redirect(authorityInterceptPage.value);
      }
    } else {
      if (routeType != null && customUrl != null) {
        await Router.route({ url: customUrl, type: routeType });
      } else {
        await redirectToHomePage();
      }
    }

    authorityInterceptPage.value = null;
  }

  return {
    platform,
    profile,
    fetchProfile,
    clearProfile,
    logout,
    redirectToHomePage,
    redirectToAuthorityPage,
    redirectToAuthorityInterceptPage
  };
});