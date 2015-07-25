var Immutable = require('immutable')
var Symbol = require('./Symbol')

/**
 * A set of regular expressions to delimit or signify different things.
 *
 * @type {Object}
 */
var matchers = {
  escape: /\\/,
  itemDelimiter: /[\s\n]/,
  string: /"/,
  closeList: /;/,
  openList: /\n/,
  indentation: /\s/,
  openInlineList: /:/,
  nextList: /,/,
  number: /[+-]?\.?\d+\.?\d*/,
  blankLine: /^\s*$/
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
    indentationDepth: 0,
    path: [0]
  })

  while ((source = state.get('source')) && !source.isEmpty()) {
    head = source.first()

    if (head.match(matchers.string)) {
      state = shift(readUntil(shift(state), matchers.string))
    } else if (head.match(matchers.openList)) {
      state = updatePathUsingIndentation(shift(state))
    } else if (head.match(matchers.itemDelimiter)) {
      state = shift(state)
    } else {
      state = readUntil(state, matchers.itemDelimiter, function (value) {
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
 * Determines what the new path should be using the current leading
 * indentation. If it's the same as the path then we just increment it. If it's
 * deeper than the path we add another level. If it's less than the path we go
 * up a level and increment it.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function updatePathUsingIndentation (state) {
  if (isBlankLine(state)) {
    return state
  }

  var previousDepth = state.get('indentationDepth')
  var nextDepth = state.get('source').takeWhile(function (char) {
    return char.match(matchers.indentation) !== null
  }).size

  state = state.set('indentationDepth', nextDepth)

  if (previousDepth === nextDepth) {
    return incrementFinalPathItem(state)
  } else if (previousDepth < nextDepth) {
    return state.set('path', state.get('path').push(1))
  } else if (previousDepth > nextDepth) {
    var popped = state.set('path', state.get('path').pop())
    return incrementFinalPathItem(popped)
  }
}

/**
 * Checks if we're currently on a blank line. Good for bailing early.
 *
 * @param {Immutable.Map} state
 * @return {Boolean}
 */
function isBlankLine (state) {
  return state.get('source').takeUntil(function (char) {
    return char === '\n'
  }).join('').match(matchers.blankLine) !== null
}

/**
 * Used to create a sibling list.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function incrementFinalPathItem (state) {
  var lastItem = Immutable.List(['path', -1])
  var index = state.getIn(lastItem) + 1
  return state.setIn(lastItem, index)
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
  var path = state.get('path').unshift('result')

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

  state = state.set('source', source)

  var currentList = state.getIn(path) || Immutable.List()
  return state.setIn(path, currentList.push(result))
}

module.exports = read
