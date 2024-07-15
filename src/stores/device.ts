import { DEFAULT_STATUS_BAR_HEIGHT, DEFAULT_TITLE_BAR_HEIGHT } from "@/constants/layout.ts";
import { cloneDeep } from "@/plugins/lodash.ts";

/**
 * 基础尺寸
 */
export interface BaseDimensions {
  /**
   * 宽度
   */
  width: number;
  /**
   * 高度
   */
  height: number;
}

/**
 * 垂直边界
 */
export interface VerticalBounds {
  /**
   * 顶部位置
   */
  top: number;
  /**
   * 底部位置
   */
  bottom: number;
}

/**
 * 水平边界
 */
export interface HorizontalBounds {
  /**
   * 左侧位置
   */
  left: number;
  /**
   * 右侧位置
   */
  right: number;
}

/**
 * 基于垂直边界的矩形尺寸
 */
export interface VerticalBoundedDimensions extends BaseDimensions, VerticalBounds {}

/**
 * 基于水平、垂直边界的矩形尺寸
 */
export interface BoundedDimensions extends BaseDimensions, VerticalBounds, HorizontalBounds {}

/**
 * 导航栏原始尺寸
 */
export interface NavbarDimensions {
  /**
   * 状态栏高度
   */
  statusBarHeight: number;
  /**
   * 标题栏高度
   */
  titleBarHeight: number;
}

/**
 * 导航栏计算尺寸
 */
export interface NavbarComputedDimensions extends NavbarDimensions {
  /**
   * 总高度
   */
  height: number;
}

export const useDeviceStore = defineStore("device", () => {
  /**
   * 是否已准备完毕
   */
  const readied = ref<boolean>(false);

  /**
   * 屏幕尺寸信息
   */
  const screen = ref<BaseDimensions>({ width: 0, height: 0 });

  /**
   * 可用窗口尺寸信息
   */
  const windows = ref<VerticalBoundedDimensions>({ width: 0, height: 0, top: 0, bottom: 0 });

  /**
   * 安全区域尺寸信息
   */
  const safearea = ref<BoundedDimensions>({ width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 });

  /**
   * 安全区域插入尺寸信息
   */
  const safeareaInsets = computed<BoundedDimensions>(() => {
    if (safearea.value == null || windows.value == null) {
      return { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
    }

    const { width: windowWidth, height: windowHeight, bottom: windowBottom } = windows.value;
    const { width, height, top, right, bottom, left } = safearea.value;

    return {
      width,
      height,
      top,
      right: windowWidth - right,
      bottom: windowHeight + windowBottom - bottom,
      left
    };
  });

  /**
   * 导航栏原始尺寸信息
   */
  const navbar = ref<NavbarDimensions>({
    statusBarHeight: DEFAULT_STATUS_BAR_HEIGHT,
    titleBarHeight: DEFAULT_TITLE_BAR_HEIGHT
  });

  /**
   * 导航栏计算尺寸信息
   */
  const navbarComputed = computed<NavbarComputedDimensions>(() => {
    const nav = cloneDeep(navbar.value);

    // #ifdef MP-WEIXIN
    if (wx.getEnterOptionsSync().apiCategory !== "default") {
      nav.statusBarHeight = 0;
    }
    // #endif

    return {
      statusBarHeight: nav.statusBarHeight,
      titleBarHeight: nav.titleBarHeight,
      height: nav.statusBarHeight + nav.titleBarHeight
    };
  });

  /**
   * 更新设备信息
   */
  async function updateDeviceInfo(): Promise<void> {
    const {
      screenWidth, screenHeight,
      windowWidth, windowHeight, windowTop, windowBottom,
      statusBarHeight,
      safeArea
    } = uni.getSystemInfoSync();

    screen.value = { width: screenWidth, height: screenHeight };
    windows.value = { width: windowWidth, height: windowHeight, top: windowTop, bottom: windowBottom };

    if (safeArea != null) {
      safearea.value = safeArea;
    } else {
      safearea.value = { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
    }

    if (statusBarHeight != null) {
      navbar.value.statusBarHeight = statusBarHeight;
    } else {
      navbar.value.statusBarHeight = DEFAULT_STATUS_BAR_HEIGHT;
    }

    if (typeof uni.getMenuButtonBoundingClientRect === "function") {
      const rect = uni.getMenuButtonBoundingClientRect();

      navbar.value.titleBarHeight = 2 * (rect.top - navbar.value.statusBarHeight) + rect.height;
    } else {
      navbar.value.titleBarHeight = DEFAULT_TITLE_BAR_HEIGHT;
    }
  }

  /**
   * 触发准备完毕
   */
  async function triggerReadied(): Promise<void> {
    if (readied.value) {
      return;
    }

    readied.value = true;

    await updateDeviceInfo();
  }

  /**
   * await readied
   */
  function awaitReadied(): Promise<void> {
    return new Promise((resolve) => {
      if (readied.value) {
        resolve();
        return;
      }

      const unwatch = watch(readied, (value) => {
        if (value) {
          resolve();
          unwatch();
        }
      });
    });
  }

  return {
    readied,
    screen,
    windows,
    safearea,
    safeareaInsets,
    navbar: navbarComputed,
    updateDeviceInfo,
    triggerReadied,
    awaitReadied
  };
});