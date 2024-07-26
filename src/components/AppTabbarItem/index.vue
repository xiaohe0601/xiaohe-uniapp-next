<template>
  <app-badge class="app-tabbar-item" :class="[classes]" :value="props.badge" @tap="onTap">
    <app-icon v-if="icon != null"
              class="app-tabbar-item__icon"
              :name="icon"
              :size="props.iconSize"
              :width="props.iconWidth"
              :height="props.iconHeight"
              :font-class="props.iconFontClass"
              :font-prefix="props.iconFontPrefix"></app-icon>

    <text v-if="props.text != null" class="app-tabbar-item__text">{{ props.text }}</text>
  </app-badge>
</template>

<script lang="ts" setup>
import { CONTEXT_KEY as TABBAR_CONTEXT_KEY } from "../AppTabbar/types.ts";
import type { Emits, Props } from "./types.ts";

defineOptions({
  name: "AppTabbarItem",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  iconSize: "44rpx",
  iconWidth: "44rpx",
  iconHeight: "44rpx",
  iconFontClass: "xh-iconfont",
  iconFontPrefix: "xh-icon",
  badge: false
});

const emit = defineEmits<Emits>();

const { activeKey, updateActiveKey } = inject(TABBAR_CONTEXT_KEY)!;

const selected = computed(() => {
  return props.path === activeKey.value;
});

const classes = computed<Record<string, boolean>>(() => {
  return {
    "is-selected": selected.value
  };
});

const icon = computed(() => {
  if (selected.value) {
    return props.selectedIcon ?? props.icon;
  }

  return props.icon;
});

function onTap(): void {
  emit("click", props.path);

  updateActiveKey(props.path);
}
</script>

<style lang="scss" scoped>
.app-tabbar-item {
  --at-apply: relative flex flex-col items-center justify-center px-20rpx text-t1;

  &.is-selected {
    --at-apply: text-primary;
  }
}

.app-tabbar-item__icon {
  & + .app-tabbar-item__text {
    --at-apply: mt-4rpx;
  }
}
</style>