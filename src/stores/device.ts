import { cloneDeep } from "lodash-es";

export const useDeviceStore = defineStore("device", () => {
  /** 是否已准备完毕 */
  const readied = shallowRef(false);

  /** 屏幕尺寸信息 */
  const screen = shallowRef({ width: 0, height: 0 });

  /** 可用窗口尺寸信息 */
  const windows = shallowRef({ width: 0, height: 0, top: 0, bottom: 0 });

  /** 安全区域尺寸信息 */
  const safeareaInsets = shallowRef({ top: 0, right: 0, bottom: 0, left: 0 });

  /** 导航栏原始尺寸信息 */
  const navbar = ref({
    statusBarHeight: isWeb ? 0 : 20,
    titleBarHeight: 44
  });

  /** 导航栏计算尺寸信息 */
  const computedNavbar = computed(() => {
    const nav = cloneDeep(navbar.value);

    // #ifdef MP-WEIXIN
    if (wx.getEnterOptionsSync().apiCategory !== "default") {
      nav.statusBarHeight = 0;
    }
    // #endif

    return {
      ...nav,
      height: nav.statusBarHeight + nav.titleBarHeight
    };
  });

  function updateDeviceInfo() {
    const {
      screenWidth,
      screenHeight,
      windowWidth,
      windowHeight,
      windowTop,
      windowBottom,
      statusBarHeight,
      safeAreaInsets
    } = getWindowInfo();

    screen.value = { width: screenWidth, height: screenHeight };
    windows.value = { width: windowWidth, height: windowHeight, top: windowTop, bottom: windowBottom };

    if (statusBarHeight != null) {
      navbar.value.statusBarHeight = statusBarHeight;
    }

    if (safeAreaInsets != null) {
      safeareaInsets.value = safeAreaInsets;
    }

    if (uni.getMenuButtonBoundingClientRect) {
      const rect = uni.getMenuButtonBoundingClientRect();

      navbar.value.titleBarHeight = 2 * (rect.top - navbar.value.statusBarHeight) + rect.height;
    }
  }

  function triggerReadied() {
    if (readied.value) {
      return;
    }

    readied.value = true;

    updateDeviceInfo();
  }

  return {
    readied,
    screen,
    windows,
    safeareaInsets,
    navbar: computedNavbar,
    updateDeviceInfo,
    triggerReadied
  };
});