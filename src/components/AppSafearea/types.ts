export type Position = "top" | "right" | "bottom" | "left";
export type Addition = number | string;

export interface Props {
  /** 安全区域位置 */
  position?: Position;
  /** 额外填充大小 */
  addition?: Addition;
}

export interface Slots {
  default?: () => any;
}