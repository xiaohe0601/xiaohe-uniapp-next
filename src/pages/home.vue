<template>
  <app-page>
    <app-navbar title="首页" :left-arrow="false"></app-navbar>

    <text>首页</text>

    <app-tabbar active="home"></app-tabbar>
  </app-page>
</template>

<script lang="ts" setup>
definePage({
  type: "home",
  tabBar: {
    index: 0,
    key: "home",
    text: "首页",
    iconPath: "/static/images/tabbar/home.png",
    selectedIconPath: "/static/images/tabbar/home-selected.png"
  }
});
</script>