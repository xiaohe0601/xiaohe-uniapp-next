import { castArray, isString } from "lodash-es";
import { alova } from "@/service/core";

export interface ExtractFileNameResult {
  /** 完整文件名（纯文件名.扩展名） */
  full: string;
  /** 纯文件名 */
  pure: string;
  /** 扩展名 */
  suffix: string;
}

/**
 * 解析文件名
 *
 * @param url 文件 URL
 */
export function extractFileName(url: string): NullableValue<ExtractFileNameResult> {
  const full = url.match(/([^/?#]+)(\?|#|$)/)?.[1];

  if (full == null || isEmpty(full)) {
    return null;
  }

  const [pure, suffix] = split(full, ".");

  return { full, pure, suffix };
}

/**
 * 是否为支持的图片扩展名
 *
 * @param suffix 扩展名
 */
export function isSupportImageSuffix(suffix: OptionalValue<NullableString>) {
  if (suffix == null || isEmpty(suffix)) {
    return false;
  }

  return ["jpg", "jpeg", "png", "svg", "webp", "gif", "bmp"].includes(suffix.toLowerCase());
}

/**
 * 是否为支持的视频扩展名
 *
 * @param suffix 扩展名
 */
export function isSupportVideoSuffix(suffix: OptionalValue<NullableString>) {
  if (suffix == null || isEmpty(suffix)) {
    return false;
  }

  return ["mp4", "mov", "m4v", "3gp", "avi", "m3u8", "webm", "flv", "rtmp"].includes(suffix.toLowerCase());
}

/**
 * 是否为支持的文档扩展名
 *
 * @param suffix 扩展名
 */
export function isSupportDocumentSuffix(suffix: OptionalValue<NullableString>) {
  if (suffix == null || isEmpty(suffix)) {
    return false;
  }

  return ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"].includes(suffix.toLowerCase());
}

/**
 * 预览图片
 *
 * @param urls 图片链接列表
 * @param current 当前显示图片的链接/索引
 * @param options 配置项
 */
export function previewImage(
  urls: Arrayable<string>,
  current: number | string = 0,
  options: Omit<UniApp.PreviewImageOptions, "urls" | "current"> = {}
) {
  return uni.previewImage({
    urls: castArray(urls).map((it) => withBaseUrl(it)),
    current,
    showmenu: true,
    referrerPolicy: "origin",
    ...options
  });
}

/**
 * 预览图片和视频（仅微信小程序）
 *
 * @param sources 图片或视频资源列表
 * @param current 当前显示资源的索引
 * @param options 配置项
 */
export function previewMedia(
  sources: Arrayable<string | UniApp.MediaSource>,
  current = 0,
  options: Omit<UniApp.PreviewMediaOption, "sources" | "current"> = {}
) {
  return uni.previewMedia({
    sources: castArray(sources).map((item) => {
      if (isString(item)) {
        return {
          url: withBaseUrl(item),
          type: isSupportVideoSuffix(extractFileName(item)?.suffix) ? "video" : "image"
        };
      } else {
        return {
          url: withBaseUrl(item.url),
          type: item.type,
          poster: item.poster
        };
      }
    }),
    current,
    showmenu: true,
    referrerPolicy: "origin",
    ...options
  });
}

/**
 * 预览文档
 *
 * @param url 文档链接
 * @param options 配置项
 */
export async function previewDocument(
  url: string,
  options: Omit<UniApp.OpenDocumentOptions, "filePath"> = {}
) {
  const serve = alova.Get<UniApp.DownloadSuccessData>(url, {
    requestType: "download",
    meta: {
      external: true
    }
  });
  serve.baseURL = "";

  const { tempFilePath } = await serve.send();

  return uni.openDocument({
    filePath: tempFilePath,
    showMenu: true,
    ...options
  });
}

/**
 * 预览文件
 *
 * @param url 文件链接
 */
export function previewFile(url: string) {
  const meta = extractFileName(url);

  if (meta != null) {
    const { suffix } = meta;

    if (isSupportImageSuffix(suffix)) {
      return previewImage(url);
    } else if (isSupportVideoSuffix(suffix)) {
      if (isMpWeixin) {
        return previewMedia({ url, type: "video" });
      }
    } else if (isSupportDocumentSuffix(suffix)) {
      return previewDocument(url);
    }
  }

  uni.showToast({
    title: "暂不支持预览该文件",
    icon: "none"
  });
}