import { isString } from "es-toolkit";
import { isArrayLike, isEmpty as isEmptyCore, isNumber, isObjectLike } from "es-toolkit/compat";

/**
 * setTimeout 的 Promise 版本
 *
 * @param timeout 超时（单位: ms）
 */
export function sleep(timeout?: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * 返回第一个有效的值，如果 value 为 null、undefined 或 NaN，则返回下一个默认值
 *
 * @param value 待检查的值
 * @param defaultValues 默认值列表
 */
export function defaultTo<T = any>(value: unknown, ...defaultValues: unknown[]): T {
  if (defaultValues.length === 0) {
    return value as T;
  }

  // eslint-disable-next-line no-self-compare
  if (value == null || value !== value) {
    return defaultTo(defaultValues[0], ...defaultValues.slice(1));
  }

  return value as T;
}

/**
 * 检查是否为空值
 *
 * @param value 待检查的值
 */
export function isEmpty(value: unknown) {
  if (value == null) {
    return true;
  }

  if (isString(value) || isObjectLike(value)) {
    return isEmptyCore(value);
  }

  return false;
}

/**
 * 携带默认值
 *
 * @param value 原始值
 * @param defaultValue 默认值
 */
export function withDefaultValue<T = any>(value: unknown, defaultValue: unknown = "-"): T {
  if (isEmpty(value)) {
    return defaultValue as T;
  }

  return value as T;
}

/**
 * 将字符串根据指定的分隔符拆分为子字符串数组
 *
 * @param value 字符串
 * @param separator 分隔符
 */
export function split(value: NullableString, separator = ",") {
  if (value == null || isEmpty(value)) {
    return [];
  }

  return value.split(separator);
}

/**
 * 数据脱敏
 *
 * @param value 原始数据
 * @param type 数据类型
 */
export function desensitize(value: string, type: "mobile" | "idcard") {
  switch (type) {
    case "mobile": {
      return value.replace(/^(1[3-9]\d)\d{4}(\d{4}$)/, "$1****$2");
    }
    case "idcard": {
      return value.replace(/^(.{6})\d+(.{4})$/, "$1******$2");
    }
  }
}

/**
 * 规范化 URL
 *
 * @param value 原始 URL
 */
export function normalizeUrl(value: string) {
  return value.replace("://", "\0")
    .replace(/\/{2,}/g, "/")
    .replace("\0", "://");
}

/**
 * 将配置的 base 追加到给定的 URL 路径
 *
 * @param value URL 路径
 */
export function withBaseUrl<T extends NullableString>(value: T): T {
  const excludes = ["http", "ws", "udp", "tcp", "data:", "@"];

  // #ifdef WEB
  let BASE_URL = import.meta.env.BASE_URL;

  if (BASE_URL === "./") {
    BASE_URL = "/";
  }

  if (import.meta.env.DEV) {
    excludes.push(`${BASE_URL}src`);
  } else {
    excludes.push(`${BASE_URL}assets`);
  }
  // #endif

  const base = import.meta.env.VITE_SOURCE_BASE_URL;

  if (value == null
    || isEmpty(value)
    || value.startsWith(base)
    || excludes.findIndex((it) => value.startsWith(it)) >= 0) {
    return value;
  }

  return normalizeUrl(`${base}/${value}`) as T;
}

/**
 * 剔除对象中值为 undefined 的属性
 *
 * @param object 待剔除对象
 * @param effect 是否直接修改源对象
 */
export function eliminateUndefined<T extends object>(object: T, effect = false) {
  if (object == null || !isObjectLike(object) || isArrayLike(object)) {
    return object;
  }

  if (effect) {
    for (const key in object) {
      if (object[key] === undefined) {
        delete object[key];
      }
    }

    return object;
  }

  const result = {} as T;

  for (const key in object) {
    if (object[key] !== undefined) {
      result[key] = object[key];
    }
  }

  return result;
}

/**
 * 类数值转为 px 数值
 *
 * @param value 类数值
 */
export function toPx(value: NullableValue<number | string>) {
  if (value == null || isEmpty(value)) {
    return 0;
  }

  if (isNumber(value)) {
    return value;
  }

  if (isNumberString(value)) {
    return Number(value);
  }

  if (/(?:rpx|upx)$/.test(value)) {
    return uni.upx2px(Number.parseFloat(value));
  }

  return Number.parseFloat(value);
}

/**
 * 携带单位
 *
 * @param value 值
 * @param unit 单位
 */
export function withUnit(value: number | string, unit = "px") {
  if (isNumber(value) || isNumberString(value)) {
    return `${value}${unit}`;
  }

  return value;
}

/**
 * 获取单个节点信息
 *
 * @param component 组件实例
 * @param selector 选择器
 * @param fields 查询字段
 */
export function querySelect(
  component: any,
  selector: string,
  fields: UniApp.NodeField
): Promise<UniApp.NodeInfo> {
  return new Promise((resolve, reject) => {
    uni.createSelectorQuery()
      .in(component)
      .select(selector)
      .fields(fields, () => {})
      .exec(([node]) => {
        if (node) {
          resolve(node);
        } else {
          reject();
        }
      });
  });
}

/**
 * 获取多个节点信息
 *
 * @param component 组件实例
 * @param selector 选择器
 * @param fields 查询字段
 */
export function querySelectAll(
  component: any,
  selector: string,
  fields: UniApp.NodeField
): Promise<UniApp.NodeInfo[]> {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .in(component)
      .selectAll(selector)
      .fields(fields, () => {})
      .exec(([nodes]) => {
        resolve(nodes);
      });
  });
}