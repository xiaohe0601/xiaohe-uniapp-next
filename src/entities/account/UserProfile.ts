import type { Gender } from "@/enums/account/Gender.ts";

/**
 * 用户信息
 */
export interface UserProfile {
  /**
   * 用户ID
   */
  id: string;
  /**
   * 姓名
   */
  name: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 性别
   */
  gender: Gender;
  /**
   * 手机号码
   */
  phone: string;
  /**
   * 邮箱
   */
  email: NullableString;
}

export {};