<template>
  <nut-config-provider class="app-page" :class="[classes]">
    <slot v-if="!props.useScrollView"></slot>

    <scroll-view v-else
                 class="app-page__scroller"
                 :scroll-y="true"
                 enhanced
                 :show-scrollbar="false">
      <slot></slot>
    </scroll-view>

    <app-dialog ref="dialog"></app-dialog>
  </nut-config-provider>
</template>

<script lang="ts" setup>
import type { Inst as DialogInst } from "../AppDialog/types.ts";
import type { Inst, Props, Slots } from "./types.ts";
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

const instance = getCurrentInstance();

const deviceStore = useDeviceStore();

const dialog = ref<NullableValue<DialogInst>>(null);

const classes = computed<Record<string, boolean>>(() => {
  const { fullscreen, enableFlex, useScrollView } = props;

  return {
    "is-fullscreen": fullscreen || useScrollView,
    "is-flex": enableFlex
  };
});

const INSTANCE: Inst = {
  dialog
};

function mountInstToPageProxy(): void {
  const page: OptionalValue<NullableValue<PageComponentInstance>> = instance?.parent?.proxy;

  if (page != null) {
    page.$magic = INSTANCE;
  }
}

onMounted(() => {
  mountInstToPageProxy();

  deviceStore.triggerReadied();
});

defineExpose(INSTANCE);
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