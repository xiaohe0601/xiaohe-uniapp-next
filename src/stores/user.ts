import type { UserProfile } from "@/models/entities/UserProfile";

export const useUserStore = defineStore("user", () => {
  const token = shallowRef<NullableString>(null);

  /** 用户信息 */
  const profile = ref<NullableValue<UserProfile>>(null);

  /**
   * 拉取用户信息
   */
  async function fetchProfile() {

  }

  /**
   * 清除用户信息
   */
  function clearProfile() {
    profile.value = null;
  }

  return {
    token,
    profile,
    fetchProfile,
    clearProfile
  };
}, {
  persist: {
    pick: ["token"]
  }
});