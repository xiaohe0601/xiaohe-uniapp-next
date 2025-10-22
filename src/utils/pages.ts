import type { PageMetaDatum, PagesConfig, SubPackages, TabBarItem } from "@uni-helper/vite-plugin-uni-pages";
import _pagesConfig from "@/pages.json";

const pagesConfig = _pagesConfig as unknown as PagesConfig;

const pages: PageMetaDatum[] = [];

export function getPages() {
  if (!isEmpty(pages)) {
    return pages;
  }

  pages.push(...defaultTo<PageMetaDatum[]>(pagesConfig.pages, []).map((item) => ({
    ...item,
    path: `/${item.path}`
  })));

  for (const item of defaultTo<SubPackages>(pagesConfig.subPackages, [])) {
    pages.push(...item.pages.map((it) => ({
      ...it,
      path: `/${item.root}/${it.path}`
    })));
  }

  return pages;
}

const tabbarPages: TabBarItem[] = [];

export function getTabbarPages() {
  if (pagesConfig.tabBar == null) {
    return [];
  }

  if (!isEmpty(tabbarPages)) {
    return tabbarPages;
  }

  tabbarPages.push(...(pagesConfig.tabBar.list as TabBarItem[]).map((item) => ({
    ...item,
    pagePath: `/${item.pagePath}`
  })));

  return tabbarPages;
}

function getPurePath(url: string) {
  const path = url.includes("?") ? url.slice(0, url.indexOf("?")) : url;

  return path.startsWith("/") ? path : `/${path}`;
}

export function isTabbarPage(url: string) {
  const path = getPurePath(url);

  return getTabbarPages().findIndex((item) => item.pagePath === path) >= 0;
}

export function getHomePage() {
  return getPages().find((item) => item.type === "home");
}

export function isHomePage(url: string) {
  const homePage = getHomePage();

  if (homePage == null) {
    return false;
  }

  return getPurePath(url) === homePage.path;
}

export function getLoginPage() {
  return getPages().find((item) => item.scene === "login");
}

export function isLoginPage(url: string) {
  const loginPage = getLoginPage();

  if (loginPage == null) {
    return false;
  }

  return getPurePath(url) === loginPage.path;
}