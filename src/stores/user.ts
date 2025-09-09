import type { UserProfile } from "@/models/entities/UserProfile";

const routerX = useRouterX();

export const useUserStore = defineStore("user", () => {
  const token = shallowRef<NullableString>(null);

  /**
   * 是否为访客（未登录）
   */
  const isGuest = computed(() => {
    return isEmpty(token.value);
  });

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

  /**
   * 退出登录
   */
  async function logout(options: {
    /** 是否调用退出登录接口 */
    serve?: boolean;
    /** 是否重定向至登录页 */
    redirect?: boolean;
    /** 是否为认证失败拦截调用 */
    intercept?: boolean;
  } = {}) {
    const {
      serve = true,
      redirect = true,
      intercept = false
    } = options;

    if (serve) {
      // TODO: call logout api
      // await logoutServe().catch(() => {});
    }

    token.value = null;

    if (redirect) {
      routerX.redirectToLogin(intercept);
    }

    clearProfile();
  }

  return {
    token,
    isGuest,
    profile,
    fetchProfile,
    clearProfile,
    logout
  };
}, {
  persist: {
    pick: [
      "token"
    ]
  }
});