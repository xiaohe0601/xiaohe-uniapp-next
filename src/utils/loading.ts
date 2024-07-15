export default class LoadingManager {

  public static async show(title?: string, options?: UniNamespace.ShowLoadingOptions): Promise<void> {
    await uni.showLoading(Object.assign({
      title
    }, options));
  }

  public static async hide(): Promise<void> {
    // @ts-ignore
    await uni.hideLoading({ noConflict: true });
  }

}