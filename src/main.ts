import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import App from "./App.vue";
import "virtual:uno.css";
import "@/assets/xh-iconfont/xh-iconfont.css";
import "@/assets/iconfont/iconfont.css";
import "@/plugins/dayjs.ts";
import "@/plugins/z-paging.ts";
// #ifdef H5
import "@/plugins/vconsole.ts";
// #endif

export function createApp() {
  const app = createSSRApp(App);

  app.use(Pinia.createPinia());

  return {
    app,
    Pinia
  };
}