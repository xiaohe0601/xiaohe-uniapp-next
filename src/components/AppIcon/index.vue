<template>
  <view class="app-icon" :class="[assertImage ? 'as-image' : 'as-icon']">
    <app-image v-if="assertImage"
               class="app-icon__image"
               :class="[classes]"
               :style="[styles]"
               :src="props.name"
               :width="props.width"
               :height="props.height"></app-image>

    <text v-else
          class="app-icon__icon"
          :class="[classes]"
          :style="[styles]"></text>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { Props } from "./types.ts";
import { eliminateUndefined, withUnit } from "@/utils/helper.ts";

defineOptions({
  name: "AppIcon",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  fontClass: "iconfont",
  fontPrefix: "icon"
});

const assertImage = computed(() => {
  return props.name?.includes("/") ?? false;
});

const classes = computed<string[]>(() => {
  if (assertImage.value) {
    return [];
  } else {
    return [props.fontClass, `${props.fontPrefix}-${props.name}`];
  }
});

const styles = computed(() => {
  const value: CSSProperties = {};

  if (!assertImage.value) {
    value.color = props.color;
    value.fontSize = withUnit(props.size);
  }

  return eliminateUndefined(value, true);
});
</script>

<style lang="scss" scoped>
.app-icon {
  --at-apply: inline-block;

  &.as-image {
    --at-apply: leading-0;
  }
}
</style>