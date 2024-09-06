import type { PageMetaDatum, SubPageMetaDatum, TabBar, TabBarItem } from "@uni-helper/vite-plugin-uni-pages";
import type { Inst as PageInst } from "@/components/AppPage/types.ts";
import PAGES_JSON from "@/pages.json";
import { last } from "@/plugins/lodash.ts";
import { sleep } from "@/utils/helper.ts";

export interface PagesConfig {
  pages?: PageMetaDatum[];
  subPackages?: SubPageMetaDatum[];
  tabBar?: TabBar;

  [key: string]: any;
}

export interface MagicPageInstance extends Page.PageInstance {
  $magic?: PageInst;
}

/**
 * 页面管理器
 */
export default class PagesManager {

  /**
   * pages.json
   *
   * @private
   */
  static readonly #config: PagesConfig = PAGES_JSON as unknown as PagesConfig;

  /**
   * 页面列表(含分包页面)
   *
   * @private
   */
  static #pages: NullableValue<PageMetaDatum[]> = null;

  /**
   * tabbar页面列表
   *
   * @private
   */
  static #tabbarPages: NullableValue<TabBarItem[]> = null;

  /**
   * 首页信息
   *
   * @private
   */
  static #homePage?: NullableValue<PageMetaDatum> = undefined;

  /**
   * 登录页信息
   *
   * @private
   */
  static #loginPage?: NullableValue<PageMetaDatum> = undefined;

  /**
   * 获取页面列表(含分包页面)
   */
  public static pages(): PageMetaDatum[] {
    if (PagesManager.#pages == null) {
      const pages: PageMetaDatum[] = [];

      pages.push(...(PagesManager.#config.pages ?? []).map((item) => ({
        ...item,
        path: `/${item.path}`
      })));

      for (const item of (PagesManager.#config.subPackages ?? [])) {
        pages.push(...item.pages.map((it) => ({
          ...it,
          path: `/${item.root}/${it.path}`
        })));
      }

      PagesManager.#pages = pages;
    }

    return PagesManager.#pages;
  }

  /**
   * 获取tabbar页面列表
   */
  public static tabbarPages(): TabBarItem[] {
    if (PagesManager.#tabbarPages == null) {
      const pages: TabBarItem[] = [];

      pages.push(...(PagesManager.#config.tabBar?.list ?? []).map((item) => ({
        ...item,
        pagePath: `/${item!.pagePath}`
      })));

      PagesManager.#tabbarPages = pages;
    }

    return PagesManager.#tabbarPages;
  }

  /**
   * 判断是否为tabbar页面
   *
   * @param path 页面地址(以`/`开头的绝对路径)
   */
  public static isTabbarPage(path: NullableString): boolean {
    if (path == null) {
      return false;
    }

    return PagesManager.tabbarPages().findIndex((item) => path.startsWith(item.pagePath!)) >= 0;
  }

  /**
   * 获取首页信息
   */
  public static getHomePage(): NullableValue<PageMetaDatum> {
    if (PagesManager.#homePage === undefined) {
      PagesManager.#homePage = PagesManager.pages().find((item) => item.isHomePage) ?? null;
    }

    if (PagesManager.#homePage == null) {
      console.error("未找到[isHomePage=true]的页面信息，请检查pages.config.ts配置");
    }

    return PagesManager.#homePage;
  }

  /**
   * 判断是否为首页
   *
   * @param path 页面地址(以`/`开头的绝对路径)
   */
  public static isHomePage(path: NullableString): boolean {
    if (path == null) {
      return false;
    }

    const page: NullableValue<PageMetaDatum> = PagesManager.getHomePage();

    if (page == null) {
      return false;
    }

    return path.startsWith(page.path);
  }

  /**
   * 获取登录页信息
   */
  public static getLoginPage(): NullableValue<PageMetaDatum> {
    if (PagesManager.#loginPage === undefined) {
      PagesManager.#loginPage = PagesManager.pages().find((item) => item.isLoginPage) ?? null;
    }

    if (PagesManager.#loginPage == null) {
      console.error("未找到[isLoginPage=true]的页面信息，请检查pages.config.ts配置");
    }

    return PagesManager.#loginPage;
  }

  /**
   * 判断是否为登录页
   *
   * @param path 页面地址(以`/`开头的绝对路径)
   */
  public static isLoginPage(path: NullableString): boolean {
    if (path == null) {
      return false;
    }

    const page: NullableValue<PageMetaDatum> = PagesManager.getLoginPage();

    if (page == null) {
      return false;
    }

    return path.startsWith(page.path);
  }

  /**
   * 获取栈顶页面实例
   */
  public static getStackTopPage(): NullableValue<MagicPageInstance> {
    const page: NullableValue<MagicPageInstance> = last(getCurrentPages()) ?? null;

    if (page == null) {
      return null;
    }

    if (page.$magic == null) {
      page.$magic = page.$vm?.$magic;
    }

    return page;
  }

  /**
   * 获取栈顶页面实例
   */
  public static async requireStackTopPage(): Promise<NullableValue<MagicPageInstance>> {
    const page: NullableValue<MagicPageInstance> = PagesManager.getStackTopPage();

    if (page != null) {
      return page;
    }

    await sleep(1);

    return PagesManager.getStackTopPage();
  }

}