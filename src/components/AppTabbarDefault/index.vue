<template>
  <app-tabbar
    class="app-tabbar-default"
    :visible="props.visible"
    :active="props.active"
    :fixed="props.fixed"
    :placeholder="props.placeholder"
    :border="props.border"
    :height="props.height">
    <app-tabbar-item
      v-for="(item) in pages"
      :key="item.pagePath"
      :path="item.pagePath!"
      :text="item.text"
      :icon="item.iconPath ?? item.icon"
      :selected-icon="item.selectedIconPath ?? item.selectedIcon"
      @click="onItemClick(item)"></app-tabbar-item>
  </app-tabbar>
</template>

<script lang="ts" setup>
import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages";
import type { Props as TabbarProps } from "../AppTabbar/types.ts";
import PagesManager from "@/utils/pages.ts";

defineOptions({
  name: "AppTabbarDefault",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<TabbarProps>(), {
  visible: true,
  fixed: true,
  placeholder: true,
  border: true,
  height: "120rpx"
});

const pages: TabBarItem[] = PagesManager.tabbarPages();

function onItemClick(item: TabBarItem): void {
  uni.switchTab({
    url: item.pagePath
  });
}
</script>

<style lang="scss" scoped>

</style>