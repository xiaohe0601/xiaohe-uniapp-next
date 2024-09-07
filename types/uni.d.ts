import type { EventChannel } from "@dcloudio/uni-shared";
import type { ComponentPublicInstance } from "vue";

declare global {
  type PageComponentInstance = ComponentPublicInstance & {
    getOpenerEventChannel?: () => OptionalValue<EventChannel>;
  };
}

export {};