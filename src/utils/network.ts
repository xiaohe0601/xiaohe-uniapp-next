import type { UnCancelTokenSource, UnConfig, UnData, UnInstance, UnParams, UnResponse } from "@uni-helper/uni-network";
import UniNetwork from "@uni-helper/uni-network";
import QS from "qs";
import type { AjaxEntity } from "@/entities/AjaxEntity.ts";
import { isAjaxEntity } from "@/entities/AjaxEntity.ts";
import {
  DEFAULT_NETWORK_CONFIG,
  REQUEST_CONTENT_TYPE,
  REQUEST_TOKEN_KEY,
  REQUEST_TOKEN_PREFIX,
  RESPONSE_CODE_SUCCESS,
  RESPONSE_STATUS_SUCCESS,
  RESPONSE_STATUS_UNAUTHORIZED
} from "@/constants/network.ts";
import { merge } from "@/plugins/lodash.ts";
import TokenManager from "@/utils/token.ts";
import ToastManager from "@/utils/toast.ts";
import LoadingManager from "@/utils/loading.ts";
import { useSystemStore } from "@/stores/system.ts";
import { uuid } from "@/utils/helper.ts";

/**
 * 网络请求配置
 */
export interface NetworkConfig<T = UnData, D = UnData> extends UnConfig<T, D> {
  /**
   * 网络请求ID
   */
  __id__?: string;
  /**
   * CancelTokenSource
   */
  source?: UnCancelTokenSource<T, D>;
  /**
   * 是否提示错误信息
   */
  promptError?: boolean;
  /**
   * 错误信息提示方式
   */
  promptMethod?: "toast";
  /**
   * 是否启用等待动画
   */
  enableLoading?: boolean;
  /**
   * 等待动画提示文字
   */
  loadingText?: string;
  /**
   * 等待动画展示延时(单位: ms)
   */
  loadingDelay?: number;
  /**
   * 是否忽略等待动画展示延时(若为true, 等待动画会在请求开始时立即展示)
   */
  ignoreLoadingDelay?: boolean;
  /**
   * 是否跳过自动添加TOKEN
   */
  ignoreToken?: boolean;
  /**
   * 是否为第三方请求(若为true, 则直接返回响应内容, 不会进行进一步处理)
   */
  external?: boolean;
  /**
   * 是否禁用登录失效重定向
   */
  disableAuthRedirect?: boolean;
}

/**
 * 网络请求响应体
 */
export interface NetworkResponse<T = UnData, D = UnData, K = any> extends Omit<UnResponse<T, D>, "data"> {
  config: NetworkConfig<T, D>;
  /**
   * 统一响应体的data
   */
  data: K;
  /**
   * 服务器响应原始数据
   */
  datas: T;
}

/**
 * 网络请求管理器
 */
export class NetworkManager {

  /**
   * 网络请求池
   *
   * @private
   */
  static #pool: Map<string, NetworkConfig<any, any>> = new Map();

  /**
   * 插入一个网络请求
   *
   * @param config 网络请求配置
   */
  public static insert(config: NetworkConfig<any, any>): void {
    if (config.__id__ == null) {
      config.__id__ = uuid();
    }

    if (config.source == null) {
      config.source = UniNetwork.CancelToken.source();
    }
    config.cancelToken = config.source.token;

    NetworkManager.#pool.set(config.__id__, config);
  }

  /**
   * 移除一个网络请求
   *
   * @param id 网络请求ID
   */
  public static remove(id?: string): void {
    if (id == null) {
      return;
    }

    NetworkManager.#pool.delete(id);
  }

  /**
   * 中断网络请求
   *
   * @param type 中断类型
   * @param config 网络请求配置
   */
  public static abort(type: "all" | "single" | "token", config?: NetworkConfig<any, any>): void {
    switch (type) {
      case "all":
      case "token": {
        for (const [id, config] of NetworkManager.#pool.entries()) {
          if (type === "all" || (type === "token" && !(config.external || config.ignoreToken))) {
            if (config?.__id__ == null || config?.__id__ !== id) {
              config.source?.cancel();
            }
          }
        }
        break;
      }
      case "single": {
        if (config?.__id__ == null) {
          return;
        }

        const request = NetworkManager.#pool.get(config.__id__);

        if (request == null) {
          return;
        }

        request.source?.cancel();
        break;
      }
    }
  }

}

/**
 * UniNetwork实例
 */
const instance: UnInstance = UniNetwork.create({
  baseUrl: import.meta.env.VITE_REQUEST_BASE_URL,
  validateStatus: () => true
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(async (config: NetworkConfig) => {
  if (config.headers == null) {
    config.headers = {};
  }

  if (!(config.ignoreToken || config.external)) {
    const token: NullableString = await TokenManager.get();

    if (token != null) {
      config.headers[REQUEST_TOKEN_KEY] = `${REQUEST_TOKEN_PREFIX}${token}`;
    }
  }

  if (typeof config.data === "object") {
    switch (config.headers?.["content-type"]) {
      case "application/json": {
        config.data = JSON.stringify(config.data);
        break;
      }
      case "application/x-www-form-urlencoded": {
        config.data = QS.stringify(config.data);
        break;
      }
    }
  }

  return config;
});

/**
 * 响应拦截器
 */
instance.interceptors.response.use(async (res: UnResponse) => {
  const response = res as NetworkResponse;

  if (response.config == null) {
    if (response.errMsg) {
      ToastManager.text(response.errMsg);
    }

    return Promise.reject(response);
  }

  if (response.data instanceof ArrayBuffer) {
    return response;
  }

  if (typeof response.data === "string") {
    try {
      response.data = JSON.parse(response.data);
    } catch (error) {
      console.error("JSON解析异常", error);
      return Promise.reject(response);
    }
  }

  const { status, data, config } = response;

  if (config.external) {
    return response;
  }

  if (status === RESPONSE_STATUS_UNAUTHORIZED) {
    NetworkManager.abort("token", config);

    const systemStore = useSystemStore();

    if (!config.disableAuthRedirect) {
      await systemStore.redirectToAuthorityPage({ intercept: true });
    }

    systemStore.clearProfile();
    systemStore.logout(false);

    return Promise.reject(response);
  }

  if (!isAjaxEntity(data)) {
    return response;
  }

  response.datas = data;
  response.data = null;

  if (status === RESPONSE_STATUS_SUCCESS) {
    if (data.code === RESPONSE_CODE_SUCCESS) {
      response.data = data.data;
      return response;
    }
  }

  promptError(data, config);

  return Promise.reject(response);
});

/**
 * 合并请求配置
 *
 * @param config 自定义配置项
 */
export function mergeConfig<T = UnData, D = UnData>(config?: NetworkConfig<T, D>): NetworkConfig<T, D> {
  const defaults: NetworkConfig = {
    headers: {
      "content-type": REQUEST_CONTENT_TYPE
    }
  };

  if (config?.adapter === "upload") {
    delete defaults.headers!["content-type"];
  }

  return merge(defaults, DEFAULT_NETWORK_CONFIG, config);
}

/**
 * 错误提示
 *
 * @param data 响应数据
 * @param config 自定义配置项
 */
export function promptError(data: NullableValue<AjaxEntity>, config: NetworkConfig): void {
  if (!config.promptError) {
    return;
  }

  const message: string = data?.message ?? "未知错误";

  switch (config.promptMethod) {
    case "toast": {
      ToastManager.toast({
        title: message,
        icon: message.length <= 7 ? "error" : "none"
      });
      break;
    }
  }
}

export async function $request<T = UnData, D = UnData>(url: string, cfg?: NetworkConfig<T, D>): Promise<NetworkResponse<T, D>> {
  const config: NetworkConfig<T, D> = mergeConfig<T, D>(cfg);

  const loading: { timer: NullableNumber; instance: boolean; } = { timer: null, instance: false };

  if (config.enableLoading) {
    if (config.loadingDelay == null || config.loadingDelay <= 0 || config.ignoreLoadingDelay) {
      LoadingManager.show(config.loadingText, { mask: true });
      loading.instance = true;
    } else {
      // @ts-expect-error whatever
      loading.timer = setTimeout(() => {
        LoadingManager.show(config.loadingText, { mask: true });
        loading.instance = true;
      }, config.loadingDelay);
    }
  }

  try {
    NetworkManager.insert(config);

    return await instance.request<T, D>(merge({ url } satisfies NetworkConfig<T, D>, config)) as Promise<NetworkResponse<T, D>>;
  } finally {
    NetworkManager.remove(config.__id__);

    if (loading.timer != null) {
      clearTimeout(loading.timer);
      loading.timer = null;
    }

    if (loading.instance) {
      LoadingManager.hide();
      loading.instance = false;
    }
  }
}

export function $get<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "get",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $delete<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "delete",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $head<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "head",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $options<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "options",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $trace<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "trace",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $connect<K = any, P extends UnParams = UnParams>(url: string, params?: P, config?: NetworkConfig<AjaxEntity<K>, null>): Promise<NetworkResponse<AjaxEntity<K>, null, K>> {
  return $request<AjaxEntity<K>, null>(url, merge({
    params,
    method: "connect",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, null>, config));
}

export function $post<K = any, D = UnData>(url: string, data?: D, config?: NetworkConfig<AjaxEntity<K>, D>): Promise<NetworkResponse<AjaxEntity<K>, D, K>> {
  return $request<AjaxEntity<K>, D>(url, merge({
    data,
    method: "post",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, D>, config));
}

export function $put<K = any, D = UnData>(url: string, data?: D, config?: NetworkConfig<AjaxEntity<K>, D>): Promise<NetworkResponse<AjaxEntity<K>, D, K>> {
  return $request<AjaxEntity<K>, D>(url, merge({
    data,
    method: "put",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, D>, config));
}

export function $patch<K = any, D = UnData>(url: string, data?: D, config?: NetworkConfig<AjaxEntity<K>, D>): Promise<NetworkResponse<AjaxEntity<K>, D, K>> {
  return $request<AjaxEntity<K>, D>(url, merge({
    data,
    method: "patch",
    adapter: "request"
  } satisfies NetworkConfig<AjaxEntity<K>, D>, config));
}

export function $upload<K = any, D = UnData>(url: string, path: string, config?: NetworkConfig<AjaxEntity<K>, D>): Promise<NetworkResponse<AjaxEntity<K>, D, K>> {
  return $request<AjaxEntity<K>, D>(url, merge({
    filePath: path,
    adapter: "upload",
    timeout: 2 * 60 * 1000
  } satisfies NetworkConfig<AjaxEntity<K>, D>, config));
}

export function $download<T = UnData, D = UnData>(url: string, config?: NetworkConfig<T, D>): Promise<NetworkResponse<T, D>> {
  return $request<T, D>(url, merge({ adapter: "download" } satisfies NetworkConfig<T, D>, config));
}

export function $external<T = UnData, D = UnData>(url: string, config?: NetworkConfig<T, D>): Promise<NetworkResponse<T, D>> {
  return $request<T, D>(url, merge({ adapter: "request", external: true } satisfies NetworkConfig<T, D>, config));
}