export interface Props {
  /**
   * 图标名称（字体图标名称或者图片地址）
   */
  name?: string;
  /**
   * 图标大小（使用字体图标时有效）
   */
  size?: number | string;
  /**
   * 图标宽度（使用图片地址时有效）
   */
  width?: number | string;
  /**
   * 图标高度（使用图片地址时有效）
   */
  height?: number | string;
  /**
   * 图标颜色（使用字体图标时有效）
   */
  color?: string;
  /**
   * 字体图标class
   */
  fontClass?: string;
  /**
   * 字体图标class前缀
   */
  fontPrefix?: string;
}

export {};