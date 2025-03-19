import type { GenderType } from "@/models/enums/Gender";

/**
 * 用户信息
 */
export interface UserProfile {
  id: string;
  /** 姓名 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 性别 */
  gender: GenderType;
  /** 手机号码 */
  phone: string;
  /** 邮箱 */
  email: NullableString;
}