<template>
  <view class="app-navigator"
        :hover-class="props.hoverClass"
        :hover-start-time="props.hoverStartTime"
        :hover-stay-time="props.hoverStayTime"
        :hover-stop-propagation="props.hoverStopPropagation"
        @tap="onTap">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import type { Emits, Props, Slots } from "./types.ts";
import Router from "@/utils/router.ts";

defineOptions({
  name: "AppNavigator",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  prevent: false,
  target: "self",
  type: "navigate",
  delta: 1,
  version: "release",
  noRelaunchIfPathUnchanged: false,
  allowFullScreen: false,
  hoverClass: "preset-alpha-hover",
  hoverStartTime: 50,
  hoverStayTime: 70,
  hoverStopPropagation: true
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

function onTap(): void {
  emit("click");

  if (props.prevent) {
    return;
  }

  Router.route(props)
    .then(onSuccess)
    .catch(onFail)
    .finally(onComplete);
}

function onSuccess(): void {
  emit("success");
}

function onFail(): void {
  emit("fail");
}

function onComplete(): void {
  emit("complete");
}
</script>

<style lang="scss" scoped>
.app-navigator {
  --at-apply: relative;
}
</style>