import * as Pinia from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";
import { setupPinia } from "@/stores";
import "virtual:uno.css";
import "@/assets/iconfont/iconfont.css";
import "@/plugins/dayjs";
import "@/plugins/z-paging";
// #ifdef WEB
import "@/plugins/vconsole";
// #endif

export function createApp() {
  const app = createSSRApp(App);

  setupPinia(app);

  return {
    app,
    Pinia
  };
}