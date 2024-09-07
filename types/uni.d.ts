import type { EventChannel } from "@dcloudio/uni-shared";
import type { ComponentPublicInstance } from "vue";

declare global {
  interface Uni extends UniNamespace.Uni {
    $zp: ZPagingGlobal;
  }

  type PageComponentInstance = ComponentPublicInstance & {
    getOpenerEventChannel?: () => OptionalValue<EventChannel>;

    /**
     * 用于挂载app-page组件实例（请勿手动修改！）
     */
    $magic?: any;
  };
}

export {};