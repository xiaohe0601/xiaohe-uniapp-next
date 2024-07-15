<template>
  <view class="app-navbar" :class="[classes]">
    <view class="app-navbar__inner" :style="[styles]">
      <view class="app-navbar__status-bar" :style="{ height: `${navbar.statusBarHeight}px` }"></view>
      <view class="app-navbar__title-bar" :style="{ height: `${navbar.titleBarHeight}px` }">
        <slot v-if="$slots.custom" name="custom"></slot>

        <template v-else>
          <view class="app-navbar__left" @tap="clickLeft">
            <template v-if="props.showLeft">
              <slot v-if="$slots.left" name="left"></slot>

              <template v-else>
                <view v-if="shouldBackToHome" class="app-navbar__home" @tap.stop="redirectToHomePage">
                  <app-icon class="app-navbar__home__icon"
                            name="home"
                            font-class="xh-iconfont"
                            font-prefix="xh-icon"></app-icon>
                </view>

                <template v-else>
                  <app-icon v-if="!isEmpty(props.leftIcon)"
                            class="app-navbar__left__icon"
                            :name="props.leftIcon"
                            :size="props.leftIconSize"
                            :width="props.leftIconWidth"
                            :height="props.leftIconHeight"
                            :font-class="props.leftIconFontClass"
                            :font-prefix="props.leftIconFontPrefix"></app-icon>
                  <text v-if="!isEmpty(props.leftText)" class="app-navbar__left__text">{{ props.leftText }}</text>
                </template>
              </template>
            </template>
          </view>

          <view class="app-navbar__center" @tap="clickCenter">
            <slot v-if="$slots.center" name="center"></slot>

            <template v-else>
              <text class="app-navbar__title">{{ props.title }}</text>
            </template>
          </view>

          <view class="app-navbar__right" @tap="clickRight">
            <template v-if="props.showRight">
              <slot v-if="$slots.right" name="right"></slot>

              <template v-else>
                <text v-if="!isEmpty(props.rightText)" class="app-navbar__right__text">{{ props.rightText }}</text>
                <app-icon v-if="!isEmpty(props.rightIcon)"
                          class="app-navbar__right__icon"
                          :name="props.rightIcon"
                          :size="props.rightIconSize"
                          :width="props.rightIconWidth"
                          :height="props.rightIconHeight"
                          :font-class="props.rightIconFontClass"
                          :font-prefix="props.rightIconFontPrefix"></app-icon>
              </template>
            </template>
          </view>
        </template>
      </view>
    </view>

    <view v-if="props.fixed && props.placeholder" class="app-navbar__placeholder" :style="[placeholderStyles]"></view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { Emits, Props, Slots } from "./types.ts";
import { isEmpty, last } from "@/plugins/lodash.ts";
import { useDeviceStore } from "@/stores/device.ts";
import { useSystemStore } from "@/stores/system.ts";
import { eliminateUndefined, sleep } from "@/utils/helper.ts";
import PagesManager from "@/utils/pages.ts";

defineOptions({
  name: "AppNavbar",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  fixed: true,
  placeholder: true,
  border: false,
  statusFrontColor: "#000000",
  showLeft: true,
  leftIcon: "arrow-left",
  leftIconSize: "36rpx",
  leftIconFontClass: "xh-iconfont",
  leftIconFontPrefix: "xh-icon",
  enableClickLeftBack: true,
  showRight: false
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const deviceStore = useDeviceStore();
const { navbar } = storeToRefs(deviceStore);

const systemStore = useSystemStore();

const classes = computed<Record<string, boolean>>(() => {
  return { "is-visible": props.visible, "is-fixed": props.fixed, "has-border": props.border };
});

const styles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  if (!props.visible) {
    value.top = `calc(0px - ${navbar.value.height}px)`;
  }

  return eliminateUndefined(value, true);
});

const placeholderStyles = computed<CSSProperties>(() => {
  const value: CSSProperties = {};

  value.height = `${navbar.value.height}px`;

  if (!props.visible) {
    value.height = 0;
  }

  return eliminateUndefined(value, true);
});

const finalNativeTitle = computed<string>(() => {
  return props.nativeTitle ?? props.title ?? "";
});

watch(finalNativeTitle, async (value) => {
  await sleep(0);

  uni.setNavigationBarTitle({
    title: value
  });
}, { immediate: true });

watch(() => props.statusFrontColor, async (value) => {
  await uni.setNavigationBarColor({
    frontColor: value,
    backgroundColor: ""
  });
}, { immediate: true });

const shouldBackToHome = ref<boolean>(false);

async function updateShouldBackToHome(): Promise<void> {
  const pages: Page.PageInstance[] = getCurrentPages();
  const path: string = `/${last(pages)!.route}`;

  shouldBackToHome.value = pages.length === 1 && PagesManager.getHomePage()?.path !== path && !PagesManager.isTabbarPage(path);
}

onMounted(async () => {
  await nextTick();

  await updateShouldBackToHome();
});

function clickLeft(): void {
  emit("left-click");

  if (props.enableClickLeftBack) {
    uni.navigateBack();
  }
}

function clickCenter(): void {
  emit("center-click");
}

function clickRight(): void {
  emit("right-click");
}

async function redirectToHomePage(): Promise<void> {
  await systemStore.redirectToHomePage();
}
</script>

<style lang="scss" scoped>
.app-navbar {
  --at-apply: relative z-100;

  &.is-fixed {
    .app-navbar__inner {
      --at-apply: fixed top-0 inset-x-0;
    }
  }

  &.has-border {
    .app-navbar__inner {
      --at-apply: border-0 border-b-1rpx border-solid border-black/5;
    }
  }
}

.app-navbar__inner {
  --at-apply: text-t1 bg-white transition-top-300 ease-out;
}

.app-navbar__title-bar {
  --at-apply: flex items-center px-20rpx text-34rpx;
}

.app-navbar__left {
  --at-apply: flex flex-1 items-center;
}

.app-navbar__left__icon {
  --at-apply: mr-10rpx;
}

.app-navbar__home {
  --at-apply: flex items-center justify-center w-62rpx h-62rpx bg-black/12 text-white rounded-full;
}

.app-navbar__home__icon {
  --at-apply: text-32rpx;
}

.app-navbar__center {
  --at-apply: flex items-center justify-center w-320rpx;
}

.app-navbar__right {
  --at-apply: flex flex-1 items-center justify-end;
}

.app-navbar__right__icon {
  --at-apply: ml-10rpx;
}

.app-navbar__placeholder {
  --at-apply: transition-height-300 ease-out;
}
</style>