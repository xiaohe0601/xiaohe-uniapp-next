import type { EventChannel } from "@dcloudio/uni-shared";
import type { ComponentPublicInstance } from "vue";

declare global {
  interface Uni extends UniNamespace.Uni {
    $zp: ZPagingGlobal;
  }

  type PageComponentInstance = ComponentPublicInstance & {
    getOpenerEventChannel?: () => OptionalValue<EventChannel>;
  };
}

export {};