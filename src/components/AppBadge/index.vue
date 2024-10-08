<template>
  <wd-badge
    class="app-badge"
    :model-value="badge.value"
    :is-dot="badge.dot"
    :max="props.max"
    :top="badgeStyles.top"
    :right="badgeStyles.right"
    :hidden="props.hidden"
    :type="props.type"
    :show-zero="props.showZero"
    :bg-color="props.bgColor">
    <slot></slot>
  </wd-badge>
</template>

<script lang="ts" setup>
import type { BadgeObject, Props, Slots } from "./types.ts";
import { toPx } from "@/utils/helper.ts";

defineOptions({
  name: "AppBadge",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  hidden: false,
  showZero: false
});

defineSlots<Slots>();

const badge = computed<BadgeObject>(() => {
  if (typeof props.value === "boolean") {
    return { value: Number(props.value), dot: props.value };
  }

  return { value: props.value, dot: false };
});

const badgeStyles = computed(() => {
  const value = { top: 0, right: 0 };

  if (props.top != null) {
    value.top = toPx(props.top);
  }
  if (props.right != null) {
    value.right = toPx(props.right);
  }

  return value;
});
</script>

<style lang="scss" scoped>

</style>