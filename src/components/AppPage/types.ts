import type { Ref } from "vue";
import type { Inst as DialogInst } from "../AppDialog/types.ts";

export interface Props {
  /**
   * 容器是否占满屏幕（即高度为100vh）
   */
  fullscreen?: boolean;
  /**
   * 是否使用flex布局（纵向）
   */
  enableFlex?: boolean;
  /**
   * 是否使用scroll-view
   */
  useScrollView?: boolean;
}

export interface Slots {
  /**
   * 页面内容
   */
  default: (props: Record<string, never>) => any;
}

export interface Inst {
  /**
   * Dialog实例（可使用DialogManager操作）
   */
  dialog: Ref<NullableValue<DialogInst>>;
}

export {};