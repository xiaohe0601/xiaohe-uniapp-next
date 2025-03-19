import type { NavigationFrontColor } from "@uni-helper/uni-app-types";

export interface Props {
  /** 是否展示导航栏 */
  visible?: boolean;
  /** 是否为 fixed 定位 */
  fixed?: boolean;
  /** 是否启用导航栏占位元素 */
  placeholder?: boolean;
  /** 导航栏内部 class */
  innerClass?: any;
  /** 标题 */
  title?: string;
  /** 标题 class */
  titleClass?: any;
  /** 原生标题 */
  nativeTitle?: string;
  /** 是否显示下边框 */
  bordered?: boolean;
  /** 状态栏文字颜色 */
  statusFrontColor?: NavigationFrontColor;
  /** 标题栏左侧文字 */
  leftText?: string;
  /** 标题栏左侧 class */
  leftClass?: any;
  /** 是否显示标题栏左侧箭头 */
  leftArrow?: boolean;
  /** 是否禁用标题栏左侧按钮 */
  leftDisabled?: boolean;
  /** 标题栏右侧文字 */
  rightText?: string;
  /** 标题栏右侧 class */
  rightClass?: any;
  /** 是否显示标题栏右侧箭头 */
  rightDisabled?: boolean;
  /** 是否禁用点击标题栏左侧返回 */
  disableLeftBack?: boolean;
}

export interface Emits {
  /** 点击标题栏左侧 */
  (e: "leftClick"): void;

  /** 点击标题栏右侧 */
  (e: "rightClick"): void;
}

export interface Slots {
  /** 自定义标题栏 */
  default?: () => any;
  /** 标题栏左侧内容 */
  left?: () => any;
  /** 标题栏中间内容 */
  center?: () => any;
  /** 标题栏右侧内容 */
  right?: () => any;
}