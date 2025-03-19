import type { AlovaGenerics } from "alova";
import type { AlovaFrontMiddleware } from "alova/client";

export function loadingDelayMiddleware(delay = 500): AlovaFrontMiddleware<AlovaGenerics> {
  return async (context, next) => {
    context.controlLoading();

    const { loading } = context.proxyStates;

    const timer = setTimeout(() => {
      loading.v = true;
    }, delay);

    await next();

    loading.v = false;
    clearTimeout(timer);
  };
}