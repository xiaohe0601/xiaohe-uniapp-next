export default class ToastManager {

  public static async toast(options?: UniNamespace.ShowToastOptions): Promise<void> {
    await uni.showToast(options);
  }

  public static async success(title?: string, options?: UniNamespace.ShowToastOptions): Promise<void> {
    await ToastManager.toast(Object.assign({
      title,
      icon: "success"
    }, options));
  }

  public static async error(title?: string, options?: UniNamespace.ShowToastOptions): Promise<void> {
    await ToastManager.toast(Object.assign({
      title,
      icon: "error"
    }, options));
  }

  public static async text(title?: string, options?: UniNamespace.ShowToastOptions): Promise<void> {
    await ToastManager.toast(Object.assign({
      title,
      icon: "none"
    }, options));
  }

  public static async hide(): Promise<void> {
    // @ts-expect-error whatever
    await uni.hideToast({
      noConflict: true
    });
  }

}