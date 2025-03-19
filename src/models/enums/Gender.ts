/**
 * 性别
 */
export const Gender = {
  /** 未知 */
  UNKNOWN: 0,
  /** 男性 */
  MALE: 1,
  /** 女性 */
  FEMALE: 2
} as const;

export type GenderType = ExtractValue<typeof Gender>;