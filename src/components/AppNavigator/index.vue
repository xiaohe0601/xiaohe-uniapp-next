<template>
  <view
    class="app-navigator"
    :hover-class="props.hoverClass"
    :hover-start-time="props.hoverStartTime"
    :hover-stay-time="props.hoverStayTime"
    :hover-stop-propagation="props.hoverStopPropagation"
    @tap="onClick"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import type { BaseEvent } from "@uni-helper/uni-app-types";
import type { Emits, Props, Slots } from "./types";

defineOptions({
  name: "AppNavigator",
  options: {
    virtualHost: true
  }
});

const props = withDefaults(defineProps<Props>(), {
  type: "navigate",
  options: () => ({})
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const router = useRouter();

function onClick(event: BaseEvent) {
  emit("click", event);

  if (props.preventDefault || isEmpty(props.url)) {
    return;
  }

  router
    .go({
      type: props.type,
      url: props.url,
      query: props.query,
      ...(props.options as any)
    })
    .then((result) => {
      emit("success", result);
    })
    .catch((error) => {
      console.warn(error);

      emit("fail", error);
    })
    .finally(() => {
      emit("complete");
    });
}
</script>