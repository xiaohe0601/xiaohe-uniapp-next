import type { EventChannel } from "@dcloudio/uni-shared";
import type { ComponentPublicInstance } from "vue";

declare global {
  interface Uni extends UniApp.Uni {
    $zp: ZPagingGlobal;
  }

  type PageComponentInstance = ComponentPublicInstance & {
    getOpenerEventChannel?: () => OptionalValue<EventChannel>;
  };
}

export {};