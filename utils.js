module.exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase().concat(str.slice(1).toLowerCase())
}

module.exports.containsNumbers = function (str) {
  const regExp = /\d/

  return regExp.test(str)
}

module.exports.containsSpecialCharacters = function (str) {
  const regExp = /[`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

  return regExp.test(str)
}

module.exports.isHex = function (str) {
  const regexp = /^[0-9a-fA-F]+$/

  return regexp.test(str)
}
