import * as Pinia from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";
import "virtual:uno.css";
import "@/assets/iconfont/iconfont.css";
import "@/assets/xh-iconfont/xh-iconfont.css";
import "@/plugins/dayjs.ts";
// #ifdef H5
import "@/plugins/vconsole.ts";
// #endif
import "@/plugins/z-paging.ts";

export function createApp() {
  const app = createSSRApp(App);

  app.use(Pinia.createPinia());

  return {
    app,
    Pinia
  };
}