import type { ComponentPublicInstance } from "vue";

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default component;
}

declare module "@vue/runtime-dom" {
  import type { AttributifyAttributes } from "@unocss/preset-attributify";

  interface HTMLAttributes extends AttributifyAttributes {}
}

declare module "vue" {
  import type { EventChannel } from "@dcloudio/uni-shared";

  type PageComponentInstance = ComponentPublicInstance & {
    getOpenerEventChannel?: () => OptionalValue<EventChannel>;

    /**
     * 用于挂载app-page组件实例（请勿手动修改！）
     */
    $magic?: any;
  }
}