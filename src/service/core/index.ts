import type { uniappRequestAdapter } from "@alova/adapter-uniapp";
import AdapterUniapp from "@alova/adapter-uniapp";
import { createAlova } from "alova";
import { createServerTokenAuthentication } from "alova/client";
import type VueHook from "alova/vue";
import { isString } from "lodash-es";
import type { AjaxEntity } from "@/models/entities/AjaxEntity";
import { isAjaxEntity } from "@/models/entities/AjaxEntity";

const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  assignToken(method) {
    const { meta = {} } = method;
    const {
      ignoreToken = false,
      external = false
    } = meta;

    if (ignoreToken || external) {
      return;
    }

    const { token } = useUserStore();

    if (isEmpty(token)) {
      return;
    }

    method.config.headers.Authorization = `Bearer ${token}`;
  },
  refreshTokenOnSuccess: {
    isExpired(response, method) {
      const { meta = {} } = method;
      const { external = false } = meta;

      if (external) {
        return false;
      }

      if (response.statusCode === 401) {
        return true;
      }

      const res = response as UniApp.RequestSuccessCallbackResult;
      const data = res.data as AjaxEntity;

      return data.code === 401;
    },
    handler(response, method) {
      const userStore = useUserStore();

      const { meta = {} } = method;
      const { disableAuthRedirect = false } = meta;

      userStore.logout({
        serve: false,
        redirect: !disableAuthRedirect,
        intercept: true
      });

      throw response;
    }
  }
});

function triggerError(type: false | "toast" | "alert", message: OptionalString) {
  if (type === false) {
    return;
  }

  const msg = message || "未知错误";

  switch (type) {
    case "toast": {
      uni.showToast({
        title: msg,
        icon: msg.length <= 7 ? "error" : "none"
      });
      break;
    }
    case "alert": {
      uni.showModal({
        title: "错误",
        content: msg,
        showCancel: false
      });
      break;
    }
  }
}

function returnData<
  T extends UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult
>(type: "inner-data" | "data" | "response", response: T) {
  if (type === "response") {
    return response;
  }

  if (type === "data" || !isAjaxEntity(response.data)) {
    return response.data;
  }

  return response.data.data;
}

export const alova = createAlova({
  baseURL: import.meta.env.VITE_REQUEST_BASE_URL,
  ...AdapterUniapp(),
  cacheFor: null,
  beforeRequest: onAuthRequired((method) => {
    const { meta = {} } = method;
    const {
      enableLoading = false,
      loadingText = "请稍候",
      loadingDelay = 500
    } = meta;

    if (enableLoading) {
      meta.loadingTimer = setTimeout(() => {
        uni.showLoading({
          title: loadingText,
          mask: true
        });
      }, loadingDelay);
    }
  }),
  responded: onResponseRefreshToken({
    onSuccess(response, method) {
      if (!("data" in response)) {
        return response;
      }

      const { meta = {} } = method;
      const {
        external = false,
        errorType = "toast",
        returnType = "inner-data"
      } = meta;

      if (external) {
        return returnData(returnType, response);
      }

      const { statusCode } = response;

      if (statusCode !== 200) {
        triggerError(errorType, `${statusCode} 异常`);
        throw response;
      }

      if (response.data instanceof ArrayBuffer) {
        return returnData(returnType, response);
      }

      if (isString(response.data)) {
        try {
          response.data = JSON.parse(response.data);
        } catch (error) {
          const err = error as Error;
          triggerError(errorType, err.message);
          throw response;
        }
      }

      const { data } = response;

      if (!isAjaxEntity(data)) {
        return returnData(returnType, response);
      }

      if (data.code !== 200) {
        triggerError(errorType, data.message);
        throw response;
      }

      return returnData(returnType, response);
    },
    onError(error, method) {
      const { meta = {} } = method;
      const { errorType = "toast" } = meta;

      triggerError(errorType, error.message);
    },
    onComplete(method) {
      const { meta = {} } = method;
      const {
        enableLoading = false,
        loadingTimer
      } = meta;

      if (enableLoading) {
        if (loadingTimer) {
          clearTimeout(loadingTimer);
          meta.loadingTimer = undefined;
        }

        try {
          // #ifdef MP-WEIXIN
          wx.hideLoading({
            noConflict: true
          });
          // #endif
          // #ifndef MP-WEIXIN
          uni.hideLoading();
          // #endif

          // eslint-disable-next-line unused-imports/no-unused-vars
        } catch (error) {
          // nothing
        }
      }
    }
  })
});