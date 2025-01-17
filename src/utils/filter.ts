import { isEmpty } from "lodash-es";
import type { ConvertUrlOptions } from "@/utils/helper.ts";
import { convertUrl } from "@/utils/helper.ts";

export function $defaults(value: any, def: string = "-"): string {
  if (typeof value === "number") {
    return String(value);
  }

  return isEmpty(value) ? def : String(value);
}

export function $sources(value?: NullableString, options?: ConvertUrlOptions): OptionalString {
  return convertUrl(value, options);
}