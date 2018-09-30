module.exports.capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.getCWEId = function(cweString) {
  return cweString.replace('CWE-','');
}
