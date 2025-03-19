export const useSystemStore = defineStore("system", () => {
  /** 平台信息 */
  const platform = ref({
    /** 平台名称 */
    name: import.meta.env.VITE_PLATFORM_NAME
  });

  return {
    platform
  };
});