import type { CSSProperties } from "vue";
import type { FooterDirection, NutAnimationName, TextAlign } from "nutui-uniapp";

export interface Props {
  /**
   * 是否展示弹窗
   */
  visible?: boolean;
  /**
   * 标题
   */
  title?: string;
  /**
   * 内容
   */
  content?: string;
  /**
   * 确认按钮文字
   */
  okText?: string;
  /**
   * 取消按钮文字
   */
  cancelText?: string;
  /**
   * 文字对齐方式
   */
  textAlign?: TextAlign;
  /**
   * 底栏排列方向
   */
  footerDirection?: FooterDirection;
  /**
   * 是否隐藏确认按钮
   */
  noOkBtn?: boolean;
  /**
   * 是否隐藏取消按钮
   */
  noCancelBtn?: boolean;
  /**
   * 是否隐藏底栏
   */
  noFooter?: boolean;
  /**
   * 是否锁定背景滚动
   */
  lockScroll?: boolean;
  /**
   * 取消按钮是否自动关闭弹窗
   */
  cancelAutoClose?: boolean;
  /**
   * 点击蒙层是否关闭弹窗
   */
  closeOnClickOverlay?: boolean;
  /**
   * css z-index
   */
  zIndex?: number;
  /**
   * 蒙层class
   */
  overlayClass?: string;
  /**
   * 蒙层style
   */
  overlayStyle?: CSSProperties;
  /**
   * 弹窗class
   */
  popClass?: string;
  /**
   * 弹窗style
   */
  popStyle?: CSSProperties;
  /**
   * 过渡动画
   */
  transition?: NutAnimationName;
  /**
   * 弹窗关闭回调
   *
   * @param action 关闭行为
   */
  beforeClose?: (action: string) => boolean | Promise<boolean>;
}

export interface Emits {
  (e: "update:visible", value: boolean): void;

  /**
   * 点击确认按钮
   */
  (e: "ok"): void;

  /**
   * 点击取消按钮
   */
  (e: "cancel"): void;

  /**
   * 弹窗已打开
   */
  (e: "opened"): void;

  /**
   * 弹窗已关闭
   */
  (e: "closed"): void;
}

export interface Slots {
  /**
   * 内容
   */
  default: (props: Record<string, never>) => any;
  /**
   * 顶栏
   */
  header: (props: Record<string, never>) => any;
  /**
   * 底栏
   */
  footer: (props: Record<string, never>) => any;
}

export interface Callback {
  resolve: NullableValue<() => void>;
  reject: NullableValue<() => void>;
}

export interface Inst {
  /**
   * 显示弹窗
   */
  show: (options?: Props) => Promise<void>;
  /**
   * 显示确认弹窗
   */
  confirm: (options?: Props) => Promise<void>;
  /**
   * 显示提示弹窗
   */
  alert: (options?: Props) => Promise<void>;
  /**
   * 确认
   */
  ok: () => void;
  /**
   * 取消
   */
  cancel: () => void;
}

export {};