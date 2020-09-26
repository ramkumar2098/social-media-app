export function capitalize(str) {
  return str.charAt(0).toUpperCase().concat(str.slice(1).toLowerCase())
}

export function containsNumbers(str) {
  const regExp = /\d/

  return regExp.test(str)
}

export function containsSpecialCharacters(str) {
  const regExp = /[`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

  return regExp.test(str)
}

export function isHex(str) {
  const regexp = /^[0-9a-fA-F]+$/

  return regexp.test(str)
}
