export interface Props {
  /**
   * 数值
   */
  value?: boolean | number | string;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 是否为气泡形状
   */
  bubble?: boolean;
  /**
   * 上下偏移量
   */
  top?: number | string;
  /**
   * 左右偏移量
   */
  right?: number | string;
  /**
   * 颜色
   */
  color?: string;
}

export interface Slots {
  /**
   * 内容
   */
  default: (props: Record<string, never>) => any;
}

export interface BadgeObject {
  /**
   * 数值
   */
  value: string | number;
  /**
   * 是否为小点
   */
  dot: boolean;
}

export {};