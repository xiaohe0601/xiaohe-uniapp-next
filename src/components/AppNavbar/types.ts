import type { NavigationFrontColor } from "@uni-helper/uni-app-types";

export interface Props {
  /**
   * 是否展示导航栏
   */
  visible?: boolean;
  /**
   * 是否为fixed定位
   */
  fixed?: boolean;
  /**
   * 是否启用导航栏占位元素
   */
  placeholder?: boolean;
  /**
   * 标题
   */
  title?: string;
  /**
   * 页面标题
   */
  nativeTitle?: string;
  /**
   * 是否展示下边框
   */
  border?: boolean;
  /**
   * 状态栏文字颜色
   */
  statusFrontColor?: NavigationFrontColor;
  /**
   * 是否展示左侧内容
   */
  showLeft?: boolean;
  /**
   * 左侧图标
   */
  leftIcon?: string;
  /**
   * 左侧图标大小
   */
  leftIconSize?: number | string;
  /**
   * 左侧图标宽度
   */
  leftIconWidth?: number | string;
  /**
   * 左侧图标高度
   */
  leftIconHeight?: number | string;
  /**
   * 左侧图标字体class
   */
  leftIconFontClass?: string;
  /**
   * 左侧图标字体class前缀
   */
  leftIconFontPrefix?: string;
  /**
   * 右侧文字
   */
  leftText?: string;
  /**
   * 是否启用左侧点击返回
   */
  enableClickLeftBack?: boolean;
  /**
   * 是否展示右侧内容
   */
  showRight?: boolean;
  /**
   * 右侧图标
   */
  rightIcon?: string;
  /**
   * 右侧图标大小
   */
  rightIconSize?: number | string;
  /**
   * 右侧图标宽度
   */
  rightIconWidth?: number | string;
  /**
   * 右侧图标高度
   */
  rightIconHeight?: number | string;
  /**
   * 右侧图标字体class
   */
  rightIconFontClass?: string;
  /**
   * 右侧图标字体class前缀
   */
  rightIconFontPrefix?: string;
  /**
   * 右侧文字
   */
  rightText?: string;
}

export interface Emits {
  /**
   * 点击左侧内容
   */
  (e: "left-click"): void;

  /**
   * 点击中间内容
   */
  (e: "center-click"): void;

  /**
   * 点击右侧内容
   */
  (e: "right-click"): void;
}

export interface Slots {
  /**
   * 自定义标题栏
   */
  custom: (props: Record<string, never>) => any;
  /**
   * 左侧内容
   */
  left: (props: Record<string, never>) => any;
  /**
   * 中间内容
   */
  center: (props: Record<string, never>) => any;
  /**
   * 右侧内容
   */
  right: (props: Record<string, never>) => any;
}

export {};