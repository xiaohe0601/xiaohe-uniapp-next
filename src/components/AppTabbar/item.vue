<template>
  <view class="app-tabbar-item" :class="classes">
    <image
      v-if="!isEmpty(innerIcon)"
      class="app-tabbar-item__icon"
      :src="innerIcon"
    ></image>

    <text
      v-if="!isEmpty(innerText)"
      class="app-tabbar-item__text"
    >
      {{ innerText }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages";

defineOptions({
  name: "AppTabbarItem",
  options: {
    virtualHost: true
  }
});

const props = withDefaults(defineProps<{
  data: TabBarItem;
  selected?: boolean;
}>(), {});

const classes = computed(() => {
  return {
    "is-selected": props.selected
  };
});

const innerIcon = computed(() => {
  const { iconPath, selectedIconPath } = props.data;

  if (props.selected) {
    if (!isEmpty(selectedIconPath)) {
      return selectedIconPath;
    }
  }

  return iconPath;
});

const innerText = computed(() => {
  return props.data.text;
});
</script>

<style lang="scss" scoped>
.app-tabbar-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  color: rgb(var(--color-t1));
  cursor: pointer;

  $block: &;

  &__icon {
    width: 22px;
    height: 22px;

    & + #{$block}__text {
      margin-top: 4px;
      font-size: 12px;
    }
  }

  &__text {
    font-size: 14px;
    white-space: nowrap;
  }

  &.is-selected {
    color: rgb(var(--color-primary));
  }
}
</style>