<template>
  <view class="app-tabbar" :class="[classes]">
    <view class="app-tabbar__inner" :style="[styles]">
      <view class="app-tabbar__items" :style="[itemsStyles]">
        <slot></slot>
      </view>

      <app-safearea :addition="0"></app-safearea>
    </view>

    <view v-if="props.fixed && props.placeholder" class="app-tabbar__placeholder" :style="[placeholderStyles]"></view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { Emits, Props, Slots } from "./types.ts";
import { CONTEXT_KEY } from "./types.ts";
import { useDeviceStore } from "@/stores/device.ts";
import { eliminateUndefined, withUnit } from "@/utils/helper.ts";

defineOptions({
  name: "AppTabbar",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  fixed: true,
  placeholder: true,
  border: true,
  height: "120rpx"
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const activeKey = computed<OptionalString>({
  get() {
    return props.active;
  },
  set(value?: string) {
    emit("update:active", value);
  }
});

const deviceStore = useDeviceStore();
const { safeareaInsets } = storeToRefs(deviceStore);

const classes = computed<Record<string, boolean>>(() => {
  return { "is-visible": props.visible, "is-fixed": props.fixed, "has-border": props.border };
});

const itemsStyles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  value.height = withUnit(props.height);

  return eliminateUndefined(value, true);
});

const placeholderStyles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  value.height = `calc(${itemsStyles.value.height} + ${safeareaInsets.value.bottom}px)`;

  if (!props.visible) {
    value.height = 0;
  }

  return eliminateUndefined(value, true);
});

const styles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  if (!props.visible) {
    value.bottom = `calc(0px - ${placeholderStyles.value.height})`;
  }

  return eliminateUndefined(value, true);
});

function updateActiveKey(key?: string): void {
  activeKey.value = key;

  emit("item-click", key);
}

provide(CONTEXT_KEY, {
  activeKey,
  updateActiveKey
});

onMounted(async () => {
  // #ifndef MP-WEIXIN || H5
  await uni.hideTabBar();
  // #endif
});
</script>

<style lang="scss" scoped>
.app-tabbar {
  --at-apply: relative z-100;

  &.is-fixed {
    .app-tabbar__inner {
      --at-apply: fixed inset-x-0 bottom-0;
    }
  }

  &.has-border {
    .app-tabbar__inner {
      --at-apply: border-0 border-t-1rpx border-solid border-black/5;
    }
  }
}

.app-tabbar__inner {
  --at-apply: bg-white transition-bottom-300 ease-out;
}

.app-tabbar__items {
  --at-apply: flex items-center justify-around h-full px-20rpx text-24rpx;
}

.app-tabbar__placeholder {
  --at-apply: transition-height-300 ease-out;
}
</style>