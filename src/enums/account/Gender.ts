/**
 * 性别
 */
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2
}

export const GENDER_TEXTS: EnumDict<Gender, string> = {
  [Gender.UNKNOWN]: "未知",
  [Gender.MALE]: "男性",
  [Gender.FEMALE]: "女性"
};