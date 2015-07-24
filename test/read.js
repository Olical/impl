var impl = require('..')
var test = require('tape')

function read (src) {
  return impl.read(src).toJS()
}

function readFirst (src) {
  return read(src)[0]
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
  t.deepEqual(out, [new impl.Symbol('test')], 'just the symbol test')
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
  t.deepEqual(out, [new impl.Symbol('+'), 1.0, -20, 6], '"+" symbol with various numbers')
})

test('reading symbol and string', function (t) {
  t.plan(1)
  var out = readFirst('split "Hello, World!"')
  t.deepEqual(out, [new impl.Symbol('split'), 'Hello, World!'], '"split" symbol with a string')
})
