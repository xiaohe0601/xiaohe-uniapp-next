export interface AjaxEntity<T = any> {
  code: number;
  message: string;
  data: T;
}

export function isAjaxEntity(data: any): data is AjaxEntity {
  return data != null && "code" in data && "message" in data;
}

export {};