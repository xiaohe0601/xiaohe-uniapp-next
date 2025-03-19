export const UniStorage = {
  getItem(key: string) {
    return uni.getStorageSync(key);
  },
  setItem(key: string, value: any) {
    uni.setStorageSync(key, value);
  },
  removeItem(key: string) {
    uni.removeStorageSync(key);
  }
};