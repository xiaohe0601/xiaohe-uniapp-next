<script lang="ts" setup>
function registerAppUpdateListener() {
  // #ifdef MP
  const manager = uni.getUpdateManager();

  manager.onUpdateReady(async () => {
    const { confirm } = await uni.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否立即重启应用？"
    });

    if (confirm) {
      manager.applyUpdate();
    }
  });
  // #endif
}

onLaunch(() => {
  registerAppUpdateListener();
});
</script>

<style lang="scss">
@import "@/styles/reboot.scss";
@import "@/styles/palette.scss";
@import "@/styles/global.scss";
@import "@/styles/helpers.scss";
@import "nutui-uniapp/styles/index.scss";
</style>