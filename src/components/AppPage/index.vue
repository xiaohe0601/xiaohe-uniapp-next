<template>
  <view class="app-page" :class="[classes]">
    <slot v-if="!props.useScrollView"></slot>

    <scroll-view v-else
                 class="app-page__scroller"
                 :scroll-y="true"
                 enhanced
                 :show-scrollbar="false">
      <slot></slot>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import type { Props, Slots } from "./types.ts";
import { useDeviceStore } from "@/stores/device.ts";

defineOptions({
  name: "AppPage",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false,
  enableFlex: false,
  useScrollView: false
});

defineSlots<Slots>();

const deviceStore = useDeviceStore();

const classes = computed<Record<string, boolean>>(() => {
  const { fullscreen, enableFlex, useScrollView } = props;

  return {
    "is-fullscreen": fullscreen || useScrollView,
    "is-flex": enableFlex
  };
});

onMounted(() => {
  deviceStore.triggerReadied();
});
</script>

<style lang="scss" scoped>
.app-page {
  --at-apply: relative font-global leading-tight;

  &.is-fullscreen {
    --at-apply: h-screen overflow-y-auto;
  }

  &.is-flex {
    --at-apply: flex flex-col;
  }
}

.app-page__scroller {
  --at-apply: h-full;
}
</style>