var Immutable = require('immutable')
var Symbol = require('./Symbol')

/**
 * A set of regular expressions to delimit or signify different things.
 *
 * @type {Object}
 */
var matchers = {
  escape: /\\/,
  space: /\s/,
  string: /"/,
  closeList: /;/,
  openList: /:/,
  nextList: /,/,
  number: /[+-]?\.?\d+\.?\d*/
}

/**
 * Reads a source string into it's equivalent data structures.
 *
 * @param {String} source
 * @return {Immutable.List}
 */
function read (source) {
  var head
  var state = Immutable.fromJS({
    result: [],
    source: source.split(''),
    path: [0]
  })

  while ((source = state.get('source')) && !source.isEmpty()) {
    head = source.first()

    if (head.match(matchers.string)) {
      state = shift(readUntil(shift(state), matchers.string))
    } else if (head.match(matchers.space)) {
      state = shift(state)
    } else {
      state = readUntil(state, matchers.space, function (value) {
        if (value.match(matchers.number)) {
          return parseFloat(value)
        } else {
          return new Symbol(value)
        }
      })
    }
  }

  return state.get('result')
}

/**
 * Drops the first item from the source within the state.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function shift (state) {
  return state.set('source', state.get('source').shift())
}

/**
 * Reads a value until the regular expression is matched. It then runs the
 * string through the optional mapping function and pushes it into the result.
 *
 * @param {Immutable.Map} state
 * @param {RegExp} matcher
 * @param {Function} mapper
 * @return {Immutable.Map}
 */
function readUntil (state, matcher, mapper) {
  var head
  var result
  var accumulator = Immutable.List()
  var source = state.get('source')
  var path = ['result'].concat(state.get('path').toJS())

  function shouldContinue () {
    head = source.first()
    return !source.isEmpty() && !head.match(matcher)
  }

  while (shouldContinue()) {
    if (head.match(matchers.escape)) {
      source = source.shift()
      head = source.first()
    }

    accumulator = accumulator.push(head)
    source = source.shift()
  }

  result = accumulator.join('')

  if (typeof mapper === 'function') {
    result = mapper(result)
  }

  return state.withMutations(function (state) {
    state.set('source', source)
    var current = state.getIn(path) || Immutable.List()
    state.setIn(path, current.push(result))
  })
}

module.exports = read
