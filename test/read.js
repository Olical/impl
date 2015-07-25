var impl = require('..')
var test = require('tape')

function read (src) {
  return impl.read(src).toJS()
}

function readFirst (src) {
  return read(src)[0]
}

function s (value) {
  return new impl.Symbol(value)
}

test('reading a string', function (t) {
  t.plan(1)
  var out = readFirst('"Hello, World!"')
  t.deepEqual(out, ['Hello, World!'], 'just a string')
})

test('reading two strings', function (t) {
  t.plan(1)
  var out = readFirst('"Hello" "World!"')
  t.deepEqual(out, ['Hello', 'World!'], 'a couple of strings')
})

test('escaping a quote inside a string', function (t) {
  t.plan(1)
  var out = readFirst('"Hello, \\"World!\\""')
  t.deepEqual(out, ['Hello, "World!"'], 'just a string')
})

test('reading a symbol', function (t) {
  t.plan(1)
  var out = readFirst('test')
  t.deepEqual(out, [s('test')], 'just the symbol test')
})

test('reading numbers', function (t) {
  t.plan(3)
  t.deepEqual(readFirst('-2.34'), [-2.34], 'a negative floating point number')
  t.deepEqual(readFirst('.5'), [0.5], 'a floating point without a leading value')
  t.deepEqual(readFirst('0'), [0], 'just a zero')
})

test('reading symbols and numbers', function (t) {
  t.plan(1)
  var out = readFirst('+ 1.0 -20 6')
  t.deepEqual(out, [s('+'), 1.0, -20, 6], '"+" symbol with various numbers')
})

test('reading symbol and string', function (t) {
  t.plan(1)
  var out = readFirst('split "Hello, World!"')
  t.deepEqual(out, [s('split'), 'Hello, World!'], '"split" symbol with a string')
})

test('new line closes a symbol', function (t) {
  t.plan(1)
  var out = readFirst('new-line?\n')
  t.deepEqual(out, [s('new-line?')], 'symbol, no new line')
})

test('new line creates a new list', function (t) {
  t.plan(1)
  var out = read('foo 10\nbar 20')
  t.deepEqual(out, [
    [s('foo'), 10],
    [s('bar'), 20]
  ], 'two lists each with two values')
})

test('new line and indentation creates a nested list', function (t) {
  t.plan(2)
  var out = readFirst('a\n  b')
  t.deepEqual(out, [s('a'), [s('b')]], 'a list with a nested list and a value')

  out = readFirst('a 1\n  b 2')
  t.deepEqual(out, [s('a'), 1, [s('b'), 2]], 'a list with a nested list and a value')
})

test('new line and less indentation closes the list', function (t) {
  t.plan(1)
  var out = read('a\n b\nc')
  t.deepEqual(out, [[s('a'), [s('b')]], [s('c')]], 'a has b as a child list, c is a sibling of a')
})

test('a series of blank lines does not create empty lists', function (t) {
  t.plan(1)
  var out = read('a\n\n   \n \nb')
  t.deepEqual(out, [[s('a')], [s('b')]], 'a and b lists are siblings still')
})
