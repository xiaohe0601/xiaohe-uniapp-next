export interface Props {
  /** 是否展示底部导航栏 */
  visible?: boolean;
  /** 当前选中项 */
  active?: string;
  /** 是否为 fixed 定位 */
  fixed?: boolean;
  /** 是否启用底部导航栏占位元素 */
  placeholder?: boolean;
  /** 底部导航栏内部 class */
  innerClass?: any;
  /** 是否展示上边框 */
  bordered?: boolean;
}