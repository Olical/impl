/**
 * A symbol is used to look up variables and functions among other things. The
 * reader defines all strings of characters (that aren't numbers or strings
 * etc) as symbols.
 *
 * @class
 * @param {String} value
 */
function Symbol (value) {
  this.value = value
}

module.exports = Symbol
