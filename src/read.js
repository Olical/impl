// var Immutable = require('immutable')
// var constants = require('./constants')

/**
 * Reads the source string to produce an evaluable data structure.
 *
 * @param {String} source
 * @return {Immutable.List}
 */
function read (source) {
  // Need to walk through the string here storing a stack of context depending
  // on what's currently at the top of the stack and what we can switch to from
  // that. Probably some sort of regular expression based state machine.
}

module.exports = read
