<script lang="ts" setup>
import { useSystemStore } from "@/stores/system.ts";
import TokenManager from "@/utils/token.ts";

const systemStore = useSystemStore();

function registerAppUpdateListener(): void {
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

onLaunch(async () => {
  registerAppUpdateListener();

  if (await TokenManager.get() != null) {
    await systemStore.fetchProfile();
  }
});
</script>

<style lang="scss">
@import "@/styles/reboot.scss";
@import "@/styles/presets.scss";
</style>