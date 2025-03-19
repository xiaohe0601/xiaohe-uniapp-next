<template>
  <nut-config-provider class="app-page" :style="styles">
    <slot></slot>

    <nut-toast></nut-toast>
    <nut-notify></nut-notify>
  </nut-config-provider>
</template>

<script lang="ts" setup>
import type { Slots } from "./types";

defineOptions({
  name: "AppPage",
  options: {
    virtualHost: true
  }
});

defineSlots<Slots>();

const deviceStore = useDeviceStore();

const _styles = computed(() => {
  const { windows, navbar, safeareaInsets } = deviceStore;

  return {
    "--window-width": `${windows.width}px`,
    "--window-height": `${windows.height}px`,
    "--navbar-height": `${navbar.height}px`,
    "--status-bar-height": `${navbar.statusBarHeight}px`,
    "--title-bar-height": `${navbar.titleBarHeight}px`,
    "--safearea-inset-top": `${safeareaInsets.top}px`,
    "--safearea-inset-right": `${safeareaInsets.right}px`,
    "--safearea-inset-bottom": `${safeareaInsets.bottom}px`,
    "--safearea-inset-left": `${safeareaInsets.left}px`
  };
});

const styles = computed(() => {
  if (isWeb) {
    return undefined;
  }

  return _styles.value;
});

// #ifdef WEB
watchEffect(() => {
  for (const [key, value] of Object.entries(_styles.value)) {
    document.documentElement.style.setProperty(key, value);
  }
});
// #endif

onMounted(() => {
  deviceStore.triggerReadied();
});
</script>

<style lang="scss" scoped>
.app-page {
  position: relative;
}
</style>