import type { BadgeType } from "wot-design-uni/components/wd-badge/types.ts";

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
   * 上下偏移量
   */
  top?: number | string;
  /**
   * 左右偏移量
   */
  right?: number | string;
  /**
   * 是否隐藏
   */
  hidden?: boolean;
  /**
   * 类型
   */
  type?: BadgeType;
  /**
   * 当数值为0时，是否展示徽标
   */
  showZero?: boolean;
  /**
   * 背景颜色
   */
  bgColor?: string;
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