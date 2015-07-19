var Immutable = require('immutable')
var constants = require('./constants')
var Symbol = require('./Symbol')

/**
 * Reads the source string to produce an evaluable data structure.
 *
 * @param {String} rawSource
 * @return {Immutable.List}
 */
function read (rawSource) {
  var source = Immutable.Stack(rawSource)
  var tokens = Immutable.List()
  var next

  while (!source.isEmpty()) {
    next = readNextToken(source)
    source = next.source

    if (next.token) {
      tokens = tokens.push(next.token)
    }
  }

  return tokens
}

/**
 * Reads the source up until the end of the current token and returns the tail
 * of the source as well as the read token.
 *
 * @param {Immutable.Stack} source
 * @return {Object} Containing the new source and the read token.
 */
function readNextToken (source) {
  var head = source.peek()
  var reader

  if (head.match(constants.syntax.tokens.number)) {
    reader = readers.number
  } else if (head.match(constants.syntax.tokens.symbol)) {
    reader = readers.symbol
  } else if (head === constants.syntax.delimiters.string) {
    reader = readers.string
  } else {
    throw new Error(['No reader for "', head, '" found.'].join(''))
  }

  return reader(source)
}

var readers = {
  listItem: function (source) {
    return readUntil(source, constants.syntax.delimiters.listItem)
  },
  symbol: function (source) {
    var item = readers.listItem(source)
    item.token = new Symbol(item.token)
    return item
  },
  number: function (source) {
    var item = readers.listItem(source)
    item.token = parseFloat(item.token)
    return item
  },
  string: function (source) {
    return readUntil(source.pop(), constants.syntax.delimiters.string)
  }
}

/**
 * The read meat of the reader. Walks through the source popping off characters
 * until it finds the provided end character. All of the work up until this
 * point is to cleanly decide what that final character should be and if there
 * should be any parsing of the token that's found.
 *
 * TODO Account for escaped characters.
 *
 * @param {Immutable.Stack} source
 * @param {String} finalCharacter
 */
function readUntil (source, finalCharacter) {
  var token = []
  console.log(source.toJS(), finalCharacter)

  while (!source.isEmpty() && source.peek() !== finalCharacter) {
    token.push(source.peek())
    source = source.pop()
  }

  return {
    source: source.pop(),
    token: token.join('')
  }
}

module.exports = read
