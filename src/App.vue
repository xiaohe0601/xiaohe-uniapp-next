<script lang="ts" setup>
const userStore = useUserStore();

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

  if (userStore.isGuest) {
    return;
  }

  userStore.fetchProfile();
});
</script>

<style lang="scss">
@import "@/styles/reboot.scss";
@import "@/styles/palette.scss";
@import "@/styles/global.scss";
@import "@/styles/helpers.scss";
</style>