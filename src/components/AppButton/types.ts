import type {
  BaseEvent,
  ButtonOnAgreeprivacyauthorizationEvent,
  ButtonOnChooseavatarEvent,
  ButtonOnErrorEvent,
  ButtonOnGetphonenumberEvent,
  ButtonOnOpensettingEvent,
  ButtonOpenType
} from "@uni-helper/uni-app-types";
import type { ButtonSize, ButtonType } from "wot-design-uni/components/wd-button/types.ts";

export interface Props {
  /**
   * 类型
   */
  type?: ButtonType;
  /**
   * 尺寸
   */
  size?: ButtonSize;
  /**
   * 是否为朴素按钮
   */
  plain?: boolean;
  /**
   * 是否为圆角按钮
   */
  round?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否细边框
   */
  hairline?: boolean;
  /**
   * 是否为块级元素
   */
  block?: boolean;
  /**
   * 圆角大小
   */
  radius?: number | string;
  /**
   * 是否为加载中状态
   */
  loading?: boolean;
  /**
   * 加载图标颜色
   */
  loadingColor?: string;
  /**
   * 图标类名
   */
  icon?: string;
  /**
   * 图标类名前缀
   */
  classPrefix?: string;
  /**
   * 指定是否阻止本节点的祖先节点出现点击态
   */
  hoverStopPropagation?: boolean;
  /**
   * 小程序开放能力
   */
  openType?: ButtonOpenType;
  /**
   * 会话来源
   */
  sessionFrom?: string;
  /**
   * 会话内消息卡片标题
   */
  sendMessageTitle?: string;
  /**
   * 会话内消息卡片点击跳转小程序路径
   */
  sendMessagePath?: string;
  /**
   * 会话内消息卡片图片
   */
  sendMessageImg?: string;
  /**
   * 是否显示会话内消息卡片
   */
  showMessageCard?: boolean;
  /**
   * 按钮的唯一标识，可用于设置隐私同意授权按钮的id
   */
  buttonId?: string;
  /**
   * 防抖延时
   */
  debounceTime?: number;
}

export interface Emits {
  /**
   * 点击
   */
  (e: "click", event: BaseEvent): void;

  /**
   * 客服消息回调
   */
  (e: "contact", event: BaseEvent): void;

  /**
   * 手机号快速验证回调
   */
  (e: "getphonenumber", event: ButtonOnGetphonenumberEvent): void;

  /**
   * 在打开授权设置页后回调
   */
  (e: "opensetting", event: ButtonOnOpensettingEvent): void;

  /**
   * 获取用户头像回调
   */
  (e: "chooseavatar", event: ButtonOnChooseavatarEvent): void;

  /**
   * 用户同意隐私协议事件回调
   */
  (e: "agreeprivacyauthorization", event: ButtonOnAgreeprivacyauthorizationEvent): void;

  /**
   * 当使用开放能力时，发生错误的回调
   */
  (e: "error", event: ButtonOnErrorEvent): void;
}

export interface Slots {
  /**
   * 内容
   */
  default: (props: Record<string, never>) => any;
}

export {};