var Immutable = require('immutable')
var Symbol = require('./Symbol')

/**
 * A set of regular expressions to delimit or signify different things.
 *
 * @type {Object}
 */
var matchers = {
  escape: /\\/,
  itemDelimiter: /[,;:\s\n#]/,
  string: /"/,
  closeList: /;/,
  openList: /\n/,
  indentation: / /,
  openInlineList: /:/,
  nextList: /,/,
  number: /^[+-]?\.?\d+\.?\d*$/,
  blankLine: /^\s*$/,
  comment: /#/
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
    inLineDepth: 0,
    path: [0]
  })

  while ((source = state.get('source')) && !source.isEmpty()) {
    head = source.first()

    if (head.match(matchers.string)) {
      state = shift(readUntil(shift(state), matchers.string))
    } else if (head.match(matchers.openList)) {
      executeDelta(0, state.get('inLineDepth'), function () {
        state = popPathSegement(state)
      })
      state = state.set('inLineDepth', 0)
      state = updatePathUsingIndentation(shift(state))
    } else if (head.match(matchers.closeList)) {
      state = popPathSegement(shift(state))
      state = state.set('indentationDepth', state.get('indentationDepth') - 1)
    } else if (head.match(matchers.nextList)) {
      state = incrementFinalPathItem(shift(state))
    } else if (head.match(matchers.openInlineList)) {
      state = pushInLineList(shift(state))
    } else if (head.match(matchers.comment)) {
      state = ignoreRestOfLine(state)
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
  state = readIndentation(state)
  var nextDepth = state.get('indentationDepth')

  state = state.set('indentationDepth', nextDepth)

  if (previousDepth === nextDepth) {
    state = incrementFinalPathItem(state)
  } else if (previousDepth < nextDepth) {
    executeDelta(previousDepth, nextDepth, function () {
      state = insertChildPathSegement(state)
    })
  } else if (previousDepth > nextDepth) {
    executeDelta(previousDepth, nextDepth, function () {
      state = incrementFinalPathItem(popPathSegement(state))
    })
  }

  return state
}

/**
 * Pushes a new in line list onto the path. Increments the in line counter so
 * they can all be closed at the next new line.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function pushInLineList (state) {
  var inLineDepth = state.get('inLineDepth') + 1
  return insertChildPathSegement(state).set('inLineDepth', inLineDepth)
}

/**
 * Ignores the rest of the line, used for comments.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function ignoreRestOfLine (state) {
  var dropped = state.get('source').skipUntil(function (char) {
    return char.match(matchers.openList)
  })

  return state.set('source', dropped)
}

/**
 * Executes the given function n times where n is the delta between a and b.
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Function} fn
 */
function executeDelta (a, b, fn) {
  var delta = Math.abs(a - b)

  while (delta--) {
    fn()
  }
}

/**
 * Reads the current levels of indentation at the start of the source and
 * places the result in indentationDepth.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function readIndentation (state) {
  var indentationCount = 2
  var isIndentation = function (char) {
    return char.match(matchers.indentation) !== null
  }
  var indentation = state.get('source').takeWhile(isIndentation)
  var depth = Math.floor(indentation.size / indentationCount)
  return state
    .set('source', state.get('source').skipWhile(isIndentation))
    .set('indentationDepth', depth)
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
 * Inserts a new path segment as a child.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function insertChildPathSegement (state) {
  var path = state.get('path')
  var nextSegment = state.getIn(path.unshift('result')).size
  return state.set('path', state.get('path').push(nextSegment))
}

/**
 * Pops the final path segment off and increments the last segment. This
 * produces a sibling of the original parent.
 *
 * @param {Immutable.Map} state
 * @return {Immutable.Map}
 */
function popPathSegement (state) {
  return state.set('path', state.get('path').pop())
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

  state = ensurePath(state, path)
  var currentList = state.getIn(path)
  return state.setIn(path, currentList.push(result))
}

/**
 * Fills in gaps in the given path to allow deep creation of lists.
 *
 * @param {Immutable.Map} state
 * @param {Immutable.List}
 * @return {Immutable.Map}
 */
function ensurePath (state, path) {
  var subset

  for (var i = 0; i < path.size; i++) {
    subset = path.take(i + 1)

    if (!state.hasIn(subset)) {
      state = state.setIn(subset, Immutable.List())
    }
  }

  return state
}

module.exports = read
