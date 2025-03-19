<template>
  <view class="app-safearea" :style="styles">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { isNumber, isString } from "lodash-es";
import type { CSSProperties } from "vue";
import type { Addition, Position, Props, Slots } from "./types";

defineOptions({
  name: "AppSafearea",
  options: {
    virtualHost: true
  }
});

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  addition: 0
});

defineSlots<Slots>();

const deviceStore = useDeviceStore();

function getSize(position: Position, safearea: number, addition: Addition) {
  const ss = safearea > 0 ? `${safearea}px` : `env(safe-area-inset-${position})`;

  if (isNumber(addition) && addition === 0) {
    return ss;
  }

  if (isString(addition) && isEmpty(addition)) {
    return ss;
  }

  return `calc(${ss} + ${withUnit(addition)})`;
}

const styles = computed(() => {
  const value: CSSProperties = {};

  const { position, addition } = props;

  const safearea = deviceStore.safeareaInsets[position];

  switch (position) {
    case "top":
    case "bottom": {
      value.height = getSize(position, safearea, addition);
      break;
    }
    case "left":
    case "right": {
      value.width = getSize(position, safearea, addition);
      break;
    }
  }

  return value;
});
</script>