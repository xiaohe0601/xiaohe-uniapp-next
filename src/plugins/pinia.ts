import { createPersistedState } from "pinia-plugin-persistedstate";
import type { App } from "vue";

export function setupPinia(app: App) {
  const pinia = createPinia();

  pinia.use(createPersistedState({
    storage: UniStorage
  }));

  app.use(pinia);
}