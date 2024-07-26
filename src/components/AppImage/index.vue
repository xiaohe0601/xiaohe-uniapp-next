<template>
  <view class="app-image" :class="[classes]" :style="[styles]" @tap="onTap">
    <image class="app-image__inner"
           :src="url"
           :mode="props.mode"
           :webp="props.webp"
           :lazy-load="props.lazyLoad"
           :show-menu-by-longpress="props.showMenuByLongpress"
           @load="onLoad"
           @error="onError"></image>

    <template v-if="feature">
      <view v-if="showError && error" class="app-image__error">
        <slot v-if="$slots.error" name="error"></slot>

        <app-icon v-else
                  class="app-image__icon"
                  name="picture"
                  font-class="xh-iconfont"
                  font-prefix="xh-icon"></app-icon>
      </view>

      <view v-if="showLoading && loading" class="app-image__loading">
        <slot v-if="$slots.loading" name="loading"></slot>

        <app-icon v-else
                  class="app-image__icon animate-spin"
                  name="loading"
                  font-class="xh-iconfont"
                  font-prefix="xh-icon"></app-icon>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { ImageOnErrorEvent, ImageOnLoadEvent } from "@uni-helper/uni-app-types";
import type { Emits, Props, Slots } from "./types.ts";
import { isEmpty } from "@/plugins/lodash.ts";
import { $sources } from "@/utils/filter.ts";
import { eliminateUndefined, previewImage, withUnit } from "@/utils/helper.ts";
import { isUrl } from "@/utils/validate.ts";

defineOptions({
  name: "AppImage",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  webp: true,
  lazyLoad: true,
  enablePreview: false,
  showMenuByLongpress: false,
  showError: true,
  showLoading: true,
  forceEnableFeature: false
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const error = ref(false);
const loading = ref(false);

const classes = computed<Record<string, boolean>>(() => {
  return {
    "is-error": error.value,
    "is-loading": loading.value
  };
});

const styles = computed(() => {
  const value: CSSProperties = {};

  value.width = withUnit(props.width);
  value.height = withUnit(props.height);

  return eliminateUndefined(value, true);
});

const url = computed(() => {
  return $sources(props.src);
});

const feature = computed(() => {
  return props.forceEnableFeature || isUrl(url.value) || isEmpty(url.value);
});

watch(url, (value) => {
  if (isEmpty(value)) {
    loading.value = false;
    error.value = true;
  } else {
    loading.value = true;
    error.value = false;
  }
}, { immediate: true });

async function onTap(): Promise<void> {
  emit("click", { error: error.value, loading: loading.value });

  if (error.value || loading.value) {
    return;
  }

  if (props.enablePreview) {
    await previewImage(url.value!);
  }
}

function onLoad(event: ImageOnLoadEvent): void {
  loading.value = false;
  error.value = false;

  emit("load", event);
}

function onError(event: ImageOnErrorEvent): void {
  loading.value = false;
  error.value = true;

  emit("error", event);

  console.error("app-image @error", event);
}
</script>

<style lang="scss" scoped>
.app-image {
  --at-apply: relative inline-block leading-0;
}

.app-image__inner,
.app-image__error,
.app-image__loading {
  --at-apply: w-inherit h-inherit;
}

.app-image__error,
.app-image__loading {
  --at-apply: "absolute inset-x-0 inset-y-0 flex items-center justify-center text-#595959 bg-gray-100 overflow-hidden";
}

.app-image__icon {
  --at-apply: text-40rpx leading-none animate-duration-1500;
}

.app-image__error {
  --at-apply: z-5;
}

.app-image__loading {
  --at-apply: z-6;
}
</style>