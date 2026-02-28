<template>
  <app-page>
    <app-navbar title="我的" :left-arrow="false"></app-navbar>

    <text>我的</text>

    <app-tabbar active="me"></app-tabbar>
  </app-page>
</template>

<script lang="ts" setup>
definePage({
  tabBar: {
    index: 1,
    key: "me",
    text: "我的",
    iconPath: "/static/images/tabbar/me.png",
    selectedIconPath: "/static/images/tabbar/me-selected.png"
  }
});
</script>