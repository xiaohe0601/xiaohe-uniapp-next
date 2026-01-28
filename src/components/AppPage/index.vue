<template>
  <wd-config-provider class="app-page" :style="styles">
    <slot></slot>

    <wd-toast></wd-toast>
    <wd-notify></wd-notify>
    <wd-message-box></wd-message-box>
  </wd-config-provider>
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

const styles = computed(() => {
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

onMounted(() => {
  deviceStore.triggerReadied();
});
</script>

<style lang="scss" scoped>
.app-page {
  position: relative;
  height: var(--window-height);
  overflow-y: auto;
  font-family: var(--font-global);
  color: rgb(var(--color-t1));
  background-color: rgb(var(--color-b2));

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>