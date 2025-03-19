type ValidateStringValue = OptionalValue<NullableString>;

/**
 * 正则校验
 *
 * @param pattern 正则表达式
 * @param value 待校验值
 * @return 是否通过校验
 */
export function validateString(pattern: RegExp, value: ValidateStringValue) {
  if (value == null) {
    return false;
  }

  return pattern.test(value);
}

export function isNumberString(value: ValidateStringValue) {
  return validateString(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+|\d\.\d+e\+\d+)$/, value);
}

export function isLettersString(value: ValidateStringValue) {
  return validateString(/^[a-z]*$/i, value);
}

export function isNumberLettersString(value: ValidateStringValue) {
  return validateString(/^[0-9a-z]*$/gi, value);
}

export function isMoneyString(value: ValidateStringValue) {
  if (value === "0") {
    return true;
  }

  return validateString(/^[1-9]\d*(?:,\d{3})*(?:\.\d{1,2})?$|^0\.\d{1,2}$/, value);
}

export function isChineseString(value: ValidateStringValue) {
  return validateString(/^[\u4E00-\u9FA5]+$/g, value);
}

export function isMobileString(value: ValidateStringValue) {
  return validateString(/^1(?:[3589]\d|4[5-9]|6[12,4-7]|7[0-8])\d{8}$/, value);
}

export function isLandlineString(value: ValidateStringValue) {
  return validateString(/^\d{3,4}-\d{7,8}(?:-\d{3,4})?$/, value);
}

export function isEmailString(value: ValidateStringValue) {
  return validateString(/^\w+(?:-\w+|\.\w+)*@[A-Z0-9]+(?:[.\-][A-Z0-9]+)*\.[A-Z0-9]+$/i, value);
}

export function isIdCardString(value: ValidateStringValue) {
  return validateString(/^[1-9]\d{5}[1-9]\d{3}(?:0\d|1[0-2])(?:[0|12]\d|3[01])\d{3}[0-9X]$/, value);
}

export function isUrlString(value: ValidateStringValue) {
  return validateString(/^(?:https?|wss?|udp|tcp|rtsp):\/\//, value);
}