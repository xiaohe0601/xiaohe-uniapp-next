import { until } from "@vueuse/core";
import { debounce, last } from "lodash-es";

const router = useRouter();

/**
 * 触发认证失败拦截页面地址
 */
const authorityInterceptUrl = shallowRef<NullableString>(null);

/**
 * 重定向至首页
 */
function redirectToHome() {
  const homePage = getHomePage();

  if (homePage == null) {
    return;
  }

  if (isTabbarPage(homePage.path)) {
    return router.switchTab({
      url: homePage.path
    });
  }

  const pages = getCurrentPages();

  const index = pages.findIndex((item) => `/${item.route}` === homePage.path);

  if (index >= 0) {
    return router.back({
      delta: pages.length - index
    });
  }

  return router.reLaunch({
    url: homePage.path
  });
}

/**
 * 重定向至登录页
 *
 * @param intercept 是否为认证失败拦截调用
 */
async function _redirectToLogin(intercept = false) {
  const loginPage = getLoginPage();

  if (loginPage == null) {
    return;
  }

  const deviceStore = useDeviceStore();

  if (intercept) {
    await until(() => deviceStore.readied).toBeTruthy();

    // @ts-expect-error whatever
    authorityInterceptUrl.value = last(getCurrentPages())!.$page.fullPath;

    return router.redirect({
      url: loginPage.path
    });
  } else {
    authorityInterceptUrl.value = null;

    return router.reLaunch({
      url: loginPage.path
    });
  }
}

const redirectToLogin = debounce(_redirectToLogin, 1000, {
  leading: true,
  trailing: false
});

/**
 * 重定向至认证失败拦截时的页面
 */
function redirectToIntercept() {
  const url = authorityInterceptUrl.value;

  authorityInterceptUrl.value = null;

  if (url != null) {
    return router.redirect({ url });
  }

  return redirectToHome();
}

export function useRouterX() {
  return {
    redirectToHome,
    redirectToLogin,
    redirectToIntercept
  };
}