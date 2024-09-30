<template>
  <NutBadge
    class="app-badge"
    :value="badge.value"
    :max="props.max"
    :dot="badge.dot"
    :bubble="props.bubble"
    :top="styles.top"
    :right="styles.right"
    :custom-color="props.color">
    <slot></slot>
  </NutBadge>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { BadgeObject, Props, Slots } from "./types.ts";
import { eliminateUndefined, withUnit } from "@/utils/helper.ts";

defineOptions({
  name: "AppBadge",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  bubble: false
});

defineSlots<Slots>();

const styles = computed(() => {
  const value: CSSProperties = {};

  value.top = withUnit(props.top);
  value.right = withUnit(props.right);

  return eliminateUndefined(value, true);
});

const badge = computed<BadgeObject>(() => {
  if (typeof props.value === "boolean") {
    return { value: Number(props.value), dot: props.value };
  }

  return { value: props.value, dot: false };
});
</script>

<style lang="scss" scoped>

</style>