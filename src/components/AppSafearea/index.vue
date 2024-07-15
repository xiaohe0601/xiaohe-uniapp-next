<template>
  <view class="app-safearea" :style="[styles]"></view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { Props } from "./types.ts";
import { useDeviceStore } from "@/stores/device.ts";
import { eliminateUndefined, withUnit } from "@/utils/helper.ts";

defineOptions({
  name: "AppSafearea",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  direction: "bottom",
  addition: "60rpx"
});

const deviceStore = useDeviceStore();
const { safeareaInsets } = storeToRefs(deviceStore);

const styles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  const size: string = `calc(${safeareaInsets.value[props.direction]}px + ${withUnit(props.addition)})`;

  switch (props.direction) {
    case "top":
    case "bottom": {
      value.height = size;
      break;
    }
    case "left":
    case "right": {
      value.width = size;
      break;
    }
  }

  return eliminateUndefined(value, true);
});
</script>

<style lang="scss" scoped>

</style>