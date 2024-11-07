/**
 * 获取窗口信息
 *
 * @see [uni.getWindowInfo](https://uniapp.dcloud.net.cn/api/system/getWindowInfo.html)
 */
export function getWindowInfo() {
  if (uni.getWindowInfo && uni.canIUse("getWindowInfo")) {
    return uni.getWindowInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}