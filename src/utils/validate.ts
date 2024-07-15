export function validate(pattern: RegExp, value?: NullableString): boolean {
  if (value == null) {
    return false;
  }

  return pattern.test(value);
}

export function isNumber(value?: NullableString): boolean {
  return validate(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+|\d\.\d+e\+\d+)$/, value);
}

export function isLetters(value?: NullableString): boolean {
  return validate(/^[a-z]*$/i, value);
}

export function isNumberOrLetters(value?: NullableString): boolean {
  return validate(/^[0-9a-z]*$/gi, value);
}

export function isMoney(value?: NullableString): boolean {
  return validate(/^[1-9]\d*(?:,\d{3})*(?:\.\d{1,2})?$|^0\.\d{1,2}$/, value);
}

export function isChinese(value?: NullableString): boolean {
  return validate(/^[\u4E00-\u9FA5]+$/g, value);
}

export function isMobile(value?: NullableString): boolean {
  return validate(/^1(?:[3589]\d|4[5-9]|6[12,4-7]|7[0-8])\d{8}$/, value);
}

export function isLandline(value?: NullableString): boolean {
  return validate(/^\d{3,4}-\d{7,8}(?:-\d{3,4})?$/, value);
}

export function isEmail(value?: NullableString): boolean {
  return validate(/^\w+(?:-\w+|\.\w+)*@[A-Z0-9]+(?:[.\-][A-Z0-9]+)*\.[A-Z0-9]+$/i, value);
}

export function isIdCard(value?: NullableString): boolean {
  return validate(/^[1-9]\d{5}[1-9]\d{3}(?:0\d|1[0-2])(?:[0|12]\d|3[01])\d{3}[0-9X]$/, value);
}

export function isUrl(value?: NullableString): boolean {
  return validate(/^(?:https?|wss?|udp|tcp|rtsp):\/\//, value);
}