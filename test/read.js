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
  var out = read('a\n  b\nc')
  t.deepEqual(out, [[s('a'), [s('b')]], [s('c')]], 'a has b as a child list, c is a sibling of a')
})

test('a series of blank lines does not create empty lists', function (t) {
  t.plan(1)
  var out = read('a\n\n  \n \nb')
  t.deepEqual(out, [[s('a')], [s('b')]], 'a and b lists are siblings still')
})

test('semi-colon closes a list', function (t) {
  t.plan(1)
  var out = read('a\n  b; c')
  t.deepEqual(out, [[s('a'), [s('b')], s('c')]], 'b is inside a, but c is a sibling of the b list')
})

test('semi-colon on a new line closes the new list, but the next line stays nested', function (t) {
  t.plan(1)
  var out = read('a\n  ;b\n  c')
  t.deepEqual(out, [[s('a'), s('b'), [s('c')]]], 'b is on a new line, but still just a symbol, c is in a list')
})

test('semi-colon on a new line closes with multiple children', function (t) {
  t.plan(1)
  var out = read('a\n  ;b c d\n  e')
  t.deepEqual(out, [[s('a'), s('b'), s('c'), s('d'), [s('e')]]], '')
})

test('comma closes a list and opens a new one', function (t) {
  t.plan(1)
  var out = read('a\n  b, c')
  t.deepEqual(out, [[s('a'), [s('b')], [s('c')]]], 'a, list of b, c')
})

test('colon opens a new list until the end of the line', function (t) {
  t.plan(1)
  var out = read('a\n  b: c\n  d')
  t.deepEqual(out, [[s('a'), [s('b'), [s('c')]], [s('d')]]], 'b is inside a, it has c and d lists as children')
})

test('multiple inline lists are closed at the end of the line', function (t) {
  t.plan(1)
  var out = read('a: b: c: d\ntop?')
  t.deepEqual(out, [[s('a'), [s('b'), [s('c'), [s('d')]]]], [s('top?')]], 'all inline lists were closed by the new line')
})

test('inline lists do not interfere with other lines', function (t) {
  t.plan(1)
  var out = read('a: b\nc: d\ne: f')
  t.deepEqual(out, [[s('a'), [s('b')]], [s('c'), [s('d')]], [s('e'), [s('f')]]], 'used three inlines, all closed correctly')
})
