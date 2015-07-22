var _ = require('lodash')
var Immutable = require('immutable')
// var Symbol = require('./Symbol')

var config = {
  escapeChar: '\\',
  itemDelimiterChar: ' ',
  stringChar: '"'
}

/**
 * Reads a Impl source string into it's equivalent data structures.
 *
 * @param {String} source
 * @return {Immutable.List}
 */
function read (source) {
  var cursor = 0
  var sourceLength = source.length
  var result = Immutable.List()
  var readerResult

  while (cursor < sourceLength) {
    readerResult = selectReader(source[cursor])(source, cursor)
    cursor = readerResult.cursor

    if (readerResult.value !== null) {
      result = result.push(readerResult.value)
    }
  }

  return result
}

/**
 * Fetches a reader function for the given character. The reader function
 * requires the source and cursor position, it returns an object containing the
 * read value and the new cursor position.
 *
 * @param {String} char
 * @return {Function}
 */
function selectReader (char) {
  if (char === config.escapeChar) {
    return readers.skip(2)
  } else if (char === config.itemDelimiterChar) {
    return readers.skip(1)
  } else if (char === config.stringChar) {
    return readers.string()
  } else {
    throw new Error(['Unknown character found when attempting to select a reader: "', char, '".'].join(''))
  }
}

var readers = {
  skip: function (n) {
    return function (source, cursor) {
      return {
        value: null,
        cursor: cursor + n
      }
    }
  },
  string: function () {
    return function (source, cursor) {
      source = _.drop(source, cursor + 1)
      var prev
      var shouldTake

      var str = _.takeWhile(source, function (char) {
        shouldTake = char !== config.stringChar || prev === config.escapeChar
        prev = char
        return shouldTake
      })

      var offset = str.length + 2

      str = _.reject(str, function (char) {
        return char === '\\'
      })

      return {
        value: str.join(''),
        cursor: cursor + offset
      }
    }
  }
}

module.exports = read
