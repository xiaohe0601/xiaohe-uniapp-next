import type { Ref } from "vue";

declare global {
  type OptionalValue<T> = T | undefined;
  type OptionalNumber = OptionalValue<number>;
  type OptionalString = OptionalValue<string>;
  type OptionalBoolean = OptionalValue<boolean>;

  type NullableValue<T> = T | null;
  type NullableNumber = NullableValue<number>;
  type NullableString = NullableValue<string>;
  type NullableBoolean = NullableValue<boolean>;

  type Arrayable<T> = T | T[];

  type RefsObject<T> = { [K in keyof T]: Ref<T[K]> };

  type EnumDict<E, K> = { readonly [key in E]: K };

  type HEXColor = `#${string}`;
  type RGBColor = `rgb(${number}, ${number}, ${number})`;
  type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
}

export {};