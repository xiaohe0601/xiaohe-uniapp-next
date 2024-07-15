import type { NetworkConfig } from "@/utils/network.ts";

/**
 * token请求头的key
 */
export const REQUEST_TOKEN_KEY: string = "Authorization";

/**
 * token请求头的前缀
 */
export const REQUEST_TOKEN_PREFIX: string = "Bearer ";

/**
 * 请求成功状态码
 */
export const RESPONSE_STATUS_SUCCESS: number = 200;

/**
 * 身份认证失败状态码
 */
export const RESPONSE_STATUS_UNAUTHORIZED: number = 401;

/**
 * 请求成功code
 */
export const RESPONSE_CODE_SUCCESS: number = 200;

/**
 * 请求ContentType
 */
export const REQUEST_CONTENT_TYPE: string = "application/json";

/**
 * 请求默认配置
 */
export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  timeout: 20 * 1000,
  promptError: true,
  promptMethod: "toast",
  enableLoading: true,
  loadingText: "请稍候",
  loadingDelay: 600,
  ignoreLoadingDelay: false,
  ignoreToken: false,
  external: false,
  disableAuthRedirect: false
};