import type { RouteOptions } from "@/utils/router.ts";

export interface Props extends RouteOptions {
  /**
   * 是否阻止默认点击行为
   */
  prevent?: boolean;
  /**
   * 同view的hover-class
   */
  hoverClass?: string;
  /**
   * 同view的hover-start-time
   */
  hoverStartTime?: number;
  /**
   * 同view的hover-stay-time
   */
  hoverStayTime?: number;
  /**
   * 同view的hover-stop-propagation
   */
  hoverStopPropagation?: boolean;
}

export interface Emits {
  /**
   * 点击
   */
  (e: "click"): void;

  /**
   * 跳转成功
   */
  (e: "success"): void;

  /**
   * 跳转失败
   */
  (e: "fail"): void;

  /**
   * 跳转完成
   */
  (e: "complete"): void;
}

export interface Slots {
  /**
   * 内容
   */
  default: (props: Record<string, never>) => any;
}

export {};