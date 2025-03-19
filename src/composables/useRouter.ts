import { omit } from "lodash-es";
import { stringify } from "picoquery";

export type LocationUrl = string;
export type LocationQueryRaw = Record<string, unknown>;

export interface QueryOptions {
  url: LocationUrl;
  query?: LocationQueryRaw;
}

export type NavigateToOptions = UniApp.NavigateToOptions & QueryOptions;
export type RedirectToOptions = UniApp.RedirectToOptions & QueryOptions;
export type ReLaunchOptions = UniApp.ReLaunchOptions & QueryOptions;
export type SwitchTabOptions = UniApp.SwitchTabOptions;
export type NavigateBackOptions = UniApp.NavigateBackOptions;

function buildUrl(url: LocationUrl, query?: LocationQueryRaw) {
  if (query == null || isEmpty(query)) {
    return url;
  }

  const serializedQuery = stringify(query);

  if (isEmpty(serializedQuery)) {
    return url;
  }

  return url.includes("?") ? `${url}&${serializedQuery}` : `${url}?${serializedQuery}`;
}

function buildOptions<T extends QueryOptions>(options: T) {
  const { url, query, ...opts } = options;

  return {
    ...opts,
    url: buildUrl(url, query)
  };
}

function warpPromiseOptions<T = any>(
  options: T,
  resolve: (result: any) => any,
  reject: (error: any) => any
) {
  const {
    success = (result: any) => result,
    fail = (error: any) => error,
    complete = () => {}
  } = options as any;

  return {
    ...options,
    success: (result: any) => resolve(success(result)),
    fail: (error: any) => reject(fail(error)),
    complete
  };
}

function navigateTo(options: NavigateToOptions): Promise<UniApp.NavigateToSuccessOptions> {
  return new Promise((resolve, reject) => {
    uni.navigateTo(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

function redirectTo(options: RedirectToOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.redirectTo(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

function reLaunch(options: ReLaunchOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.reLaunch(warpPromiseOptions(buildOptions(options), resolve, reject));
  });
}

function switchTab(options: SwitchTabOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.switchTab(warpPromiseOptions(options, resolve, reject));
  });
}

function navigateBack(options?: NavigateBackOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.navigateBack(warpPromiseOptions(defaultTo(options, {}), resolve, reject));
  });
}

export type RouterGoOptions =
  | ({ type: "navigate" } & NavigateToOptions)
  | ({ type: "redirect" } & RedirectToOptions)
  | ({ type: "reLaunch" } & ReLaunchOptions)
  | ({ type: "switchTab" } & SwitchTabOptions)
  | ({ type: "back" } & NavigateBackOptions);

export function useRouter() {
  function navigate(options: NavigateToOptions) {
    if (isTabbarPage(options.url)) {
      return switchTab(options);
    }

    return navigateTo(options);
  }

  function redirect(options: RedirectToOptions) {
    if (isTabbarPage(options.url)) {
      return switchTab(options);
    }

    return redirectTo(options);
  }

  function go(opts: RouterGoOptions) {
    switch (opts.type) {
      case "navigate": {
        return navigate(omit(opts, "type"));
      }
      case "redirect": {
        return redirect(omit(opts, "type"));
      }
      case "reLaunch": {
        return reLaunch(omit(opts, "type"));
      }
      case "switchTab": {
        return switchTab(omit(opts, "type"));
      }
      case "back": {
        return navigateBack(omit(opts, "type"));
      }
    }
  }

  return {
    go,
    navigate,
    redirect,
    reLaunch,
    switchTab,
    back: navigateBack
  };
}