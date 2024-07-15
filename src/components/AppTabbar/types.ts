import type { InjectionKey, Ref } from "vue";

export interface Props {
  /**
   * 是否展示底部导航栏
   */
  visible?: boolean;
  /**
   * 当前选中项
   */
  active?: string;
  /**
   * 是否为fixed定位
   */
  fixed?: boolean;
  /**
   * 是否启用底部导航栏占位元素
   */
  placeholder?: boolean;
  /**
   * 是否展示上边框
   */
  border?: boolean;
  /**
   * 高度
   */
  height?: number | string;
}

export interface Emits {
  (e: "update:active", value?: string): void;

  /**
   * 点击tabbar-item元素
   */
  (e: "item-click", key?: string): void;
}

export interface Slots {
  /**
   * 内容
   */
  default: (props: Record<string, never>) => any;
}

export interface Context {
  /**
   * 选中项的key
   */
  activeKey: Ref<OptionalString>;
  /**
   * 更新activeKey
   */
  updateActiveKey: (key?: string) => void;
}

export const CONTEXT_KEY: InjectionKey<Context> = Symbol();

export {};