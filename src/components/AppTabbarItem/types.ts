export interface Props {
  /**
   * 页面路径
   */
  path: string;
  /**
   * 文字
   */
  text?: string;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 选中状态图标
   */
  selectedIcon?: string;
  /**
   * 图标大小
   */
  iconSize?: number | string;
  /**
   * 图标宽度
   */
  iconWidth?: number | string;
  /**
   * 图标高度
   */
  iconHeight?: number | string;
  /**
   * 图标字体class
   */
  iconFontClass?: string;
  /**
   * 图标字体class前缀
   */
  iconFontPrefix?: string;
  /**
   * 徽标
   */
  badge?: boolean | number | string;
}

export interface Emits {
  /**
   * 点击
   */
  (e: "click", key?: string): void;
}

export {};