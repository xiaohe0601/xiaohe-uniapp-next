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

export {};