<template>
  <WdButton
    class="app-button"
    :style="[styles]"
    :type="props.type"
    :size="props.size"
    :plain="props.plain"
    :round="props.round"
    :disabled="props.disabled"
    :hairline="props.hairline"
    :block="props.block"
    :loading="props.loading"
    :loading-color="props.loadingColor"
    :icon="props.icon"
    :class-prefix="props.classPrefix"
    :hover-stop-propagation="props.hoverStopPropagation"
    :open-type="props.openType"
    :session-from="props.sessionFrom"
    :send-message-title="props.sendMessageTitle"
    :send-message-path="props.sendMessagePath"
    :send-message-img="props.sendMessageImg"
    :show-message-card="props.showMessageCard"
    :button-id="props.buttonId"
    @click="debounceOnClick"
    @contact="emit('contact', $event)"
    @getphonenumber="emit('getphonenumber', $event)"
    @opensetting="emit('opensetting', $event)"
    @chooseavatar="emit('chooseavatar', $event)"
    @agreeprivacyauthorization="emit('agreeprivacyauthorization', $event)"
    @error="emit('error', $event)">
    <slot></slot>
  </WdButton>
</template>

<script lang="ts" setup>
import type { BaseEvent } from "@uni-helper/uni-app-types";
import type { CSSProperties } from "vue";
import type { Emits, Props, Slots } from "./types.ts";
import { debounce } from "@/plugins/lodash.ts";
import { eliminateUndefined, withUnit } from "@/utils/helper.ts";

defineOptions({
  name: "AppButton",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  plain: false,
  round: true,
  disabled: false,
  hairline: false,
  block: false,
  loading: false,
  radius: "16rpx",
  hoverStopPropagation: false,
  showMessageCard: false,
  debounceTime: 0
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const styles = computed(() => {
  const value: CSSProperties = {};

  if (props.round) {
    value.borderRadius = withUnit(props.radius);
  }

  return eliminateUndefined(value, true);
});

function onClick(event: BaseEvent): void {
  emit("click", event);
}

const debounceOnClick = debounce(onClick, props.debounceTime, { leading: true, trailing: false });
</script>

<style lang="scss" scoped>

</style>