import { castArray } from "@/plugins/lodash.ts";
import { $download } from "@/utils/network.ts";
import ToastManager from "@/utils/toast.ts";
import { isNumber } from "@/utils/validate.ts";

/**
 * Promise版setTimeout
 *
 * @param timeout 延时(单位: ms)
 */
export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * 控制函数最短执行时间
 *
 * @param actuator 执行器
 * @param timeout 最短执行时间(单位: ms)
 */
export async function withTimeout<T>(actuator: () => Promise<T>, timeout: number): Promise<T> {
  const start: number = Date.now();

  const result: T = await actuator();

  const diff: number = Date.now() - start;

  if (diff < timeout) {
    await sleep(timeout - diff);
  }

  return result;
}

/**
 * 生成UUID
 *
 * @param length 长度
 * @param radix 基数
 */
export function uuid(length?: number, radix: number = -1): string {
  const chars: string[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

  const uuid: string[] = [];

  if (length != null) {
    const radi: number = radix <= 0 ? chars.length : radix;

    for (let i = 0; i < length; i += 1) {
      uuid[i] = chars[0 | Math.random() * radi];
    }
  } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (let i = 0; i < 36; i += 1) {
      if (uuid[i] == null) {
        const r: number = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

/**
 * 剔除对象中值为undefined的属性
 *
 * @param objects 对象
 * @param effect 是否直接修改源对象
 */
export function eliminateUndefined<T>(objects: T, effect: boolean = false): Partial<T> {
  if (objects == null || typeof objects !== "object" || !("hasOwnProperty" in objects)) {
    return objects;
  }

  if (effect) {
    for (const key in objects) {
      if (Object.prototype.hasOwnProperty.call(objects, key) && objects[key] === undefined) {
        delete objects[key];
      }
    }

    return objects;
  }

  const result: Partial<T> = {};

  for (const key in objects) {
    if (Object.prototype.hasOwnProperty.call(objects, key) && objects[key] !== undefined) {
      result[key] = objects[key];
    }
  }

  return result;
}

/**
 * px转upx(rpx)
 *
 * @param px px数值
 * @param digits 小数位数
 */
export function px2upx(px: NullableNumber, digits?: number): number {
  if (px == null) {
    return 0;
  }

  const value: number = px / (uni.upx2px(750) / 750);

  if (digits == null) {
    return value;
  }

  return Number(value.toFixed(digits));
}

/**
 * 类数值转为px数值
 *
 * @param value 类数值
 */
export function toPx(value: NullableValue<number | string>): number {
  if (value == null) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (isNumber(value)) {
    return Number(value);
  }

  if (/(?:rpx|upx)$/.test(value)) {
    return uni.upx2px(Number.parseFloat(value));
  }

  return Number.parseFloat(value);
}

/**
 * 为数值添加单位
 *
 * @param value 数值
 * @param unit 单位
 */
export function withUnit(value?: number | string, unit: "px" | "rpx" = "px"): OptionalString {
  if (value === undefined) {
    return undefined;
  }

  return isNumber(String(value)) ? `${value}${unit}` : `${value}`;
}

/**
 * 获取单个节点信息
 *
 * @param component 组件实例
 * @param selector 选择器
 * @param fields 查询字段
 */
export function querySelect(component: any, selector: string, fields: UniNamespace.NodeField): Promise<UniNamespace.NodeInfo> {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .in(component)
      .select(selector)
      .fields(fields, () => {})
      .exec(([node]) => {
        resolve(node);
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
export function querySelectAll(component: any, selector: string, fields: UniNamespace.NodeField): Promise<UniNamespace.NodeInfo[]> {
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

/**
 * 分割字符串配置项
 */
export interface SplitOptions {
  /**
   * 是否移除开头的分隔符
   */
  removeLeadingSeparator?: boolean;
  /**
   * 是否移除结尾的分隔符
   */
  removeTrailingSeparator?: boolean;
}

/**
 * 分割字符串
 *
 * @param str 字符串
 * @param separator 分隔符
 * @param options 配置项
 */
export function split(str: NullableString, separator = ",", options: SplitOptions = {}): string[] {
  const { removeLeadingSeparator = true, removeTrailingSeparator = true } = options;

  if (str == null || str.length <= 0) {
    return [];
  }

  if (removeLeadingSeparator) {
    str = str.replace(new RegExp(`^${separator}`), "");
  }
  if (removeTrailingSeparator) {
    str = str.replace(new RegExp(`${separator}$`), "");
  }

  return str.split(separator);
}

/**
 * 转换URL相对路径配置项
 */
export interface ConvertUrlOptions {
  /**
   * 基地址
   */
  base?: string;
  /**
   * 额外前缀
   */
  prefix?: string;
}

/**
 * 转换URL相对路径
 *
 * @param value URL地址
 * @param options 配置项
 */
export function convertUrl(value?: NullableString, options: ConvertUrlOptions = {}): OptionalString {
  const { base = import.meta.env.VITE_SOURCE_BASE_URL, prefix = "" } = options;

  const excludes: string[] = ["http", "ws", "udp", "tcp", "/static", "/packages"];

  if (value == null) {
    return undefined;
  }

  if (value.length <= 0 || value.startsWith(base) || excludes.findIndex((it) => value.startsWith(it)) >= 0) {
    return value;
  }

  return `${prefix}${base}${value.startsWith("/") ? "" : "/"}${value}`;
}

/**
 * 解析文件名及后缀结果
 */
export interface ExtractFileNameResult {
  /**
   * 纯文件名.后缀
   */
  full?: string;
  /**
   * 纯文件名
   */
  pure?: string;
  /**
   * 后缀
   */
  suffix?: string;
}

/**
 * 解析文件名及后缀
 *
 * @param url 文件URL
 */
export function extractFileName(url: string): ExtractFileNameResult {
  const full: OptionalString = url.match(/\/([^/?#]+)(\?|#|$)/)?.[1];

  const [pure, suffix] = full?.split(".") ?? [];

  return { full, pure, suffix };
}

/**
 * 是否为图片后缀
 *
 * @param suffix 后缀
 */
export function isImageSuffix(suffix?: NullableString): boolean {
  if (suffix == null) {
    return false;
  }

  return ["jpg", "jpeg", "png", "svg", "webp", "gif", "bmp"].includes(suffix.toLowerCase());
}

/**
 * 是否为视频后缀
 *
 * @param suffix 后缀
 */
export function isVideoSuffix(suffix?: NullableString): boolean {
  if (suffix == null) {
    return false;
  }

  return ["mp4", "mov", "m4v", "3gp", "avi", "m3u8", "webm", "flv", "rtmp"].includes(suffix.toLowerCase());
}

/**
 * 是否为文档后缀
 *
 * @param suffix 后缀
 */
export function isDocumentSuffix(suffix?: NullableString): boolean {
  if (suffix == null) {
    return false;
  }

  return ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"].includes(suffix.toLowerCase());
}

/**
 * 全屏预览图片配置项
 */
export interface PreviewImageOptions extends Pick<UniNamespace.PreviewImageOptions, "showmenu" | "referrerPolicy"> {}

/**
 * 全屏预览图片
 *
 * @param links 图片URL
 * @param current 当前显示图片的索引
 * @param options 配置项
 */
export async function previewImage(
  links: Arrayable<string>,
  current: number = 0,
  options?: PreviewImageOptions
): Promise<void> {
  const urls: string[] = castArray(links).map((it) => convertUrl(it)!);

  await uni.previewImage(Object.assign({
    urls,
    current: urls[current],
    showmenu: true,
    referrerPolicy: "origin"
  }, options));
}

/**
 * 图片或视频资源
 */
export type MediaSourceLike = string | UniNamespace.MediaSource;

/**
 * 预览图片和视频配置项
 */
export interface PreviewMediaOptions extends Pick<UniNamespace.PreviewMediaOption, "showmenu" | "referrerPolicy"> {}

/**
 * 预览图片和视频（仅支持微信小程序）
 *
 * @param links 图片或视频资源
 * @param current 当前显示资源的索引
 * @param options 配置项
 */
export async function previewMedia(
  links: Arrayable<MediaSourceLike>,
  current: number = 0,
  options?: PreviewMediaOptions
): Promise<void> {
  const sources: UniNamespace.MediaSource[] = castArray(links).map((item) => {
    if (typeof item === "string") {
      return {
        url: convertUrl(item)!,
        type: isVideoSuffix(extractFileName(item).suffix) ? "video" : "image"
      };
    }

    return {
      url: convertUrl(item.url)!,
      type: item.type
    };
  });

  uni.previewMedia(Object.assign({
    sources,
    current,
    showmenu: true,
    referrerPolicy: "origin"
  }, options));
}

/**
 * 预览文档配置项
 */
export interface PreviewDocumentOptions extends Pick<UniNamespace.OpenDocumentOptions, "fileType" | "showMenu"> {}

/**
 * 预览文档（不支持H5）
 *
 * @param url 文件URL
 * @param options 配置项
 */
export async function previewDocument(url: string, options?: PreviewDocumentOptions): Promise<void> {
  // #ifndef H5
  const { tempFilePath } = await $download(url, { external: true });

  await uni.openDocument(Object.assign({
    filePath: tempFilePath!,
    showMenu: true
  }, options));
  // #endif
}

/**
 * 预览文件（遵循previewImage、previewMedia、previewDocument的兼容性）
 *
 * @param url 文件URL
 */
export async function previewFile(url: string): Promise<void> {
  const { suffix } = extractFileName(url);

  if (isImageSuffix(suffix)) {
    await previewImage(url);
  } else if (isVideoSuffix(suffix)) {
    // #ifdef MP-WEIXIN
    await previewMedia({ url, type: "video" });
    // #endif

    // #ifndef MP-WEIXIN
    ToastManager.text("暂不支持预览该文件");
    // #endif
  } else if (isDocumentSuffix(suffix)) {
    // #ifndef H5
    await previewDocument(url);
    // #endif

    // #ifdef H5
    ToastManager.text("暂不支持预览该文件");
    // #endif
  } else {
    ToastManager.text("暂不支持预览该文件");
  }
}

/**
 * 数据脱敏
 *
 * @param value 原始数据
 * @param type 数据类型
 */
export function desensitize(value: string, type: "mobile" | "idcard"): string {
  switch (type) {
    case "mobile":
      return value.replace(/^(1[3-9]\d)\d{4}(\d{4}$)/, "$1****$2");
    case "idcard":
      return value.replace(/^(.{6})\d+(.{4})$/, "$1******$2");
  }
}