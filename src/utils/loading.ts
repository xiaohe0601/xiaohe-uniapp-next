export default class LoadingManager {

  public static async show(title?: string, options?: UniApp.ShowLoadingOptions): Promise<void> {
    await uni.showLoading(Object.assign({
      title
    }, options));
  }

  public static async hide(): Promise<void> {
    // @ts-expect-error whatever
    await uni.hideLoading({
      noConflict: true
    });
  }

}