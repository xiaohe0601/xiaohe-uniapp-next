<template>
  <nut-button class="app-button"
              :style="[styles]"
              :type="props.type"
              :size="props.size"
              :shape="props.shape"
              :plain="props.plain"
              :disabled="props.disabled"
              :block="props.block"
              :loading="props.loading"
              :form-type="props.formType"
              :open-type="props.openType"
              :session-from="props.sessionFrom"
              :send-message-title="props.sendMessageTitle"
              :send-message-path="props.sendMessagePath"
              :send-message-img="props.sendMessageImg"
              :show-message-card="props.showMessageCard"
              @click="debounceOnClick"
              @contact="emit('contact', $event)"
              @getphonenumber="emit('getphonenumber', $event)"
              @getrealtimephonenumber="emit('getrealtimephonenumber', $event)"
              @opensetting="emit('opensetting', $event)"
              @chooseavatar="emit('chooseavatar', $event)"
              @agreeprivacyauthorization="emit('agreeprivacyauthorization', $event)"
              @error="emit('error', $event)">
    <slot></slot>
  </nut-button>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { BaseEvent } from "@uni-helper/uni-app-types";
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
  disabled: false,
  block: false,
  loading: false,
  radius: "16rpx",
  showMessageCard: false,
  debounceTime: 0
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const styles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  value.borderRadius = withUnit(props.radius);

  return eliminateUndefined(value, true);
});

function onClick(event: BaseEvent): void {
  emit("click", event);
}

const debounceOnClick = debounce(onClick, props.debounceTime, { leading: true, trailing: false });
</script>

<style lang="scss" scoped>

</style>