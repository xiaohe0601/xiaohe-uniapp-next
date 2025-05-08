<template>
  <view class="app-tabbar" :class="classes">
    <view class="app-tabbar__inner" :class="innerClasses">
      <view class="app-tabbar__items">
        <app-tabbar-item
          v-for="(item) in pages"
          :key="item.key"
          :data="item"
          :selected="item.key === props.active"
          @tap="onItemClick(item)"></app-tabbar-item>
      </view>

      <app-safearea></app-safearea>
    </view>

    <view v-if="props.fixed && props.placeholder" class="app-tabbar__placeholder"></view>
  </view>
</template>

<script lang="ts" setup>
import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages";
import type { Props } from "./types";

defineOptions({
  name: "AppTabbar",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  fixed: true,
  placeholder: true,
  bordered: true
});

const deviceStore = useDeviceStore();

const router = useRouter();

const classes = computed(() => {
  return {
    "is-visible": props.visible,
    "is-fixed": props.fixed
  };
});

const innerClasses = computed(() => {
  return [
    {
      "hairline-top": props.bordered
    },
    props.innerClass
  ];
});

const pages = getTabbarPages();

function onItemClick(item: TabBarItem) {
  router.switchTab({
    url: item.pagePath
  });
}

onMounted(() => {
  // #ifndef MP-WEIXIN
  uni.hideTabBar();

  sleep().then(() => {
    deviceStore.updateDeviceInfo();
  });
  // #endif
});
</script>

<style lang="scss" scoped>
.app-tabbar {
  --tabbar-height: 60px;

  $block: &;

  &__inner {
    position: relative;
    z-index: 20;
    background-color: rgb(var(--color-b1));
    transition: bottom 300ms ease-out;
  }

  &__items {
    display: flex;
    height: var(--tabbar-height);
    padding: 0 16px;

    :deep() {
      #{$block}-item {
        flex: 1;
      }
    }
  }

  &__placeholder {
    height: var(--tabbar-height);
    transition: height 300ms ease-out;
  }

  &.is-fixed {
    #{$block}__inner {
      position: fixed;
      right: var(--window-right, 0);
      bottom: 0;
      left: var(--window-left, 0);
    }
  }

  &:not(.is-visible) {
    #{$block}__inner {
      bottom: calc(0px - var(--tabbar-height));
    }

    #{$block}__placeholder {
      height: 0;
    }
  }
}
</style>