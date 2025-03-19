import "alova";

declare module "alova" {
  export interface AlovaCustomTypes {
    meta: {
      /**
       * 返回值类型
       *
       * - inner-data：统一响应体中的数据
       * - data：原始响应数据
       * - response：原始响应体
       *
       * @default inner-data
       */
      returnType?: "inner-data" | "data" | "response";
      /**
       * 错误提示方式
       *
       * - false：不提示
       * - toast：轻提示
       * - alert：弹窗提示
       *
       * @default toast
       */
      errorType?: false | "toast" | "alert";
      /**
       * 是否启用等待动画
       *
       * @default false
       */
      enableLoading?: boolean;
      /**
       * 等待动画提示文字
       *
       * @default 请稍候
       */
      loadingText?: string;
      /**
       * 等待动画展示延时（单位: ms）
       *
       * @default 500
       */
      loadingDelay?: number;
      /**
       * 是否跳过自动添加 token
       *
       * @default false
       */
      ignoreToken?: boolean;
      /**
       * 是否为第三方请求
       *
       * @default false
       */
      external?: boolean;
      /**
       * 是否禁用登录失效重定向
       *
       * @default false
       */
      disableAuthRedirect?: boolean;

      /** 是否为登录请求 */
      login?: boolean;
      /** 是否为退出登录请求 */
      logout?: boolean;

      /** _._ 等待动画定时器 */
      loadingTimer?: OptionalValue<ReturnType<typeof setTimeout>>;
    };
  }
}