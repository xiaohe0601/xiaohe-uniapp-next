import type { BaseEvent } from "@uni-helper/uni-app-types";

export interface Props {
  /** 路由类型 */
  type?: RouterGoOptions["type"];
  /** 页面路径 */
  url?: LocationUrl;
  /** 路由查询参数 */
  query?: LocationQueryRaw;
  /** 路由配置项 */
  options?: Partial<
    | NavigateToOptions
    | RedirectToOptions
    | ReLaunchOptions
    | SwitchTabOptions
    | NavigateBackOptions
  >;
  /** 是否阻止路由行为 */
  preventDefault?: boolean;
  /** 同 view 的 hover-class */
  hoverClass?: string;
  /** 同 view 的 hover-start-time */
  hoverStartTime?: number;
  /** 同 view 的 hover-stay-time */
  hoverStayTime?: number;
  /** 同 view 的 hover-stop-propagation */
  hoverStopPropagation?: boolean;
}

export interface Emits {
  /** 点击 */
  (e: "click", event: BaseEvent): void;

  /** 跳转成功 */
  (e: "success", result: any): void;

  /** 跳转失败 */
  (e: "fail", error: any): void;

  /** 跳转完成 */
  (e: "complete"): void;
}

export interface Slots {
  default?: () => any;
}