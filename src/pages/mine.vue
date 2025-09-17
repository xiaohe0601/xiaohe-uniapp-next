<template>
  <app-page>
    <app-navbar title="我的" :left-arrow="false"></app-navbar>

    <text>我的</text>

    <app-tabbar active="mine"></app-tabbar>
  </app-page>
</template>

<script lang="ts" setup>
definePage({
  tabBar: {
    index: 1,
    key: "mine",
    text: "我的",
    iconPath: "/static/images/tabbar/mine.png",
    selectedIconPath: "/static/images/tabbar/mine-selected.png"
  }
});
</script>