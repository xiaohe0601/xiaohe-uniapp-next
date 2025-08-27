<template>
  <view class="app-navbar" :class="classes">
    <view class="app-navbar__inner" :class="innerClasses">
      <view class="app-navbar__status-bar"></view>

      <view class="app-navbar__title-bar">
        <slot v-if="slots.default"></slot>

        <template v-else>
          <view
            v-if="hasLeftEl"
            class="app-navbar__left"
            :class="leftClasses"
            @tap="onLeftClick()">
            <slot v-if="slots.left" name="left"></slot>

            <template v-else>
              <template v-if="props.leftArrow">
                <text
                  v-if="shouldBackToHome"
                  class="app-navbar__home i-carbon:home"
                  @tap="redirectToHome()"></text>

                <text v-else class="app-navbar__left__arrow i-carbon:chevron-left"></text>
              </template>

              <text v-if="hasLeftText && !shouldBackToHome" class="app-navbar__left__text">{{ props.leftText }}</text>
            </template>
          </view>

          <view class="app-navbar__center">
            <slot v-if="slots.center" name="center"></slot>

            <text v-else class="app-navbar__title truncate" :class="props.titleClass">{{ props.title }}</text>
          </view>

          <view
            v-if="hasRightEl"
            class="app-navbar__right"
            :class="rightClasses"
            @tap="onRightClick()">
            <slot v-if="slots.right" name="right"></slot>

            <template v-else>
              <text v-if="hasRightText" class="app-navbar__right__text">{{ props.rightText }}</text>
            </template>
          </view>
        </template>
      </view>
    </view>

    <view v-if="props.fixed && props.placeholder" class="app-navbar__placeholder"></view>
  </view>
</template>

<script lang="ts" setup>
import { last } from "lodash-es";
import type { Emits, Props, Slots } from "./types";

defineOptions({
  name: "AppNavbar",
  options: {
    virtualHost: true
  }
});

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  fixed: true,
  placeholder: true,
  bordered: true,
  leftArrow: true
});

const emit = defineEmits<Emits>();

const slots = defineSlots<Slots>();

const router = useRouter();
const routerX = useRouterX();

const classes = computed(() => {
  return {
    "is-visible": props.visible,
    "is-fixed": props.fixed,
    "is-transparent": props.transparent
  };
});

const innerClasses = computed(() => {
  return [
    {
      "hairline-bottom": props.bordered
    },
    props.innerClass
  ];
});

const leftClasses = computed(() => {
  return [
    {
      "is-disabled": props.leftDisabled
    },
    props.leftClass
  ];
});

const rightClasses = computed(() => {
  return [
    {
      "is-disabled": props.rightDisabled
    },
    props.rightClass
  ];
});

const hasLeftText = computed(() => {
  return !isEmpty(props.leftText);
});

const hasLeftEl = computed(() => {
  return props.leftArrow || hasLeftText.value || slots.left;
});

const hasRightText = computed(() => {
  return !isEmpty(props.rightText);
});

const hasRightEl = computed(() => {
  return hasRightText.value || slots.right;
});

const finalNativeTitle = computed(() => {
  return defaultTo<OptionalString>(props.nativeTitle, props.title);
});

function updateNativeTitle() {
  const title = finalNativeTitle.value;

  if (title == null || isEmpty(title)) {
    return;
  }

  uni.setNavigationBarTitle({ title });
}

watch(finalNativeTitle, () => {
  updateNativeTitle();
});

function updateStatusFrontColor() {
  const { statusFrontColor: color } = props;

  if (color == null || isEmpty(color)) {
    return;
  }

  uni.setNavigationBarColor({
    frontColor: color,
    backgroundColor: ""
  });
}

watch(() => props.statusFrontColor, () => {
  updateStatusFrontColor();
});

const shouldBackToHome = shallowRef(false);

function updateShouldBackToHome() {
  const pages = getCurrentPages();
  const path = last(pages)!.route!;

  shouldBackToHome.value = pages.length === 1
    && !isHomePage(path)
    && !isTabbarPage(path);
}

function onLeftClick() {
  if (props.leftDisabled) {
    return;
  }

  emit("leftClick");

  if (!props.disableLeftBack) {
    router.back();
  }
}

function onRightClick() {
  if (props.rightDisabled) {
    return;
  }

  emit("rightClick");
}

function redirectToHome() {
  routerX.redirectToHome();
}

onMounted(() => {
  updateShouldBackToHome();
  updateNativeTitle();
  updateStatusFrontColor();
});
</script>

<style lang="scss" scoped>
.app-navbar {
  font-size: 16px;
  line-height: 1;
  color: rgb(var(--color-t1));
  user-select: none;

  $block: &;

  &__inner {
    position: relative;
    z-index: 20;
    background-color: rgb(var(--color-b1));
    transition: top 300ms ease-out;
  }

  &__status-bar {
    height: var(--status-bar-height);
  }

  &__title-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--title-bar-height);
  }

  &__center {
    max-width: 60%;
  }

  &__title {
    display: inline-block;
    width: 100%;
  }

  &__left,
  &__right {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    cursor: pointer;

    &.is-disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }
  }

  &__left {
    left: 16px;

    &__arrow {
      width: 1.4em;
      height: 1.4em;
      margin-left: -6px;

      & + #{$block}__left__text {
        margin-left: 4px;
      }
    }
  }

  &__right {
    right: 16px;
  }

  &__home {
    width: 1.4em;
    height: 1.4em;
  }

  &__placeholder {
    height: var(--navbar-height);
    transition: height 300ms ease-out;
  }

  &.is-fixed {
    #{$block}__inner {
      position: fixed;
      top: var(--window-top, 0);
      right: var(--window-right, 0);
      left: var(--window-left, 0);
    }
  }

  &.is-transparent {
    #{$block}__inner {
      background-color: transparent;
    }
  }

  &:not(.is-visible) {
    #{$block}__inner {
      top: calc(var(--window-top, 0px) - var(--navbar-height));
    }

    #{$block}__placeholder {
      height: 0;
    }
  }
}
</style>