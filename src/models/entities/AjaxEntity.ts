import { isObjectLike } from "lodash-es";

export interface AjaxEntity<T = any> {
  code: number;
  message: string;
  data: T;
}

export function isAjaxEntity(value: any): value is AjaxEntity {
  return isObjectLike(value)
    && "code" in value
    && "message" in value;
}