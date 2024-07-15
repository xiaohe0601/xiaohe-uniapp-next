import type { ImageMode, ImageOnErrorEvent, ImageOnLoadEvent } from "@uni-helper/uni-app-types";

export interface Props {
  /**
   * 图片地址
   */
  src?: string;
  /**
   * 图片宽度
   */
  width?: number | string;
  /**
   * 图片高度
   */
  height?: number | string;
  /**
   * 图片裁剪、缩放的模式
   */
  mode?: ImageMode;
  /**
   * 是否解析webp格式
   */
  webp?: boolean;
  /**
   * 是否启用懒加载
   */
  lazyLoad?: boolean;
  /**
   * 是否启用预览功能
   */
  enablePreview?: boolean;
  /**
   * 长按是否显示菜单
   */
  showMenuByLongpress?: boolean;
  /**
   * 是否展示错误状态
   */
  showError?: boolean;
  /**
   * 是否展示加载中状态
   */
  showLoading?: boolean;
  /**
   * 强制启用特性（即使不是网络地址也会展示错误或加载中状态）
   */
  forceEnableFeature?: boolean;
}

export interface OnClickEvent {
  /**
   * 否为错误状态
   */
  error: boolean;
  /**
   * 否为加载中状态
   */
  loading: boolean;
}

export interface Emits {
  /**
   * 图片加载完成
   */
  (e: "load", event: ImageOnLoadEvent): void;

  /**
   * 图片加载错误
   */
  (e: "error", event: ImageOnErrorEvent): void;

  /**
   * 点击图片
   */
  (e: "click", event: OnClickEvent): void;
}

export interface Slots {
  /**
   * 错误状态
   */
  error: (props: Record<string, never>) => any;
  /**
   * 加载中状态
   */
  loading: (props: Record<string, never>) => any;
}

export {};