var impl = require('..')
var test = require('tape')

test('reading a string', function (t) {
  t.plan(1)
  var out = impl.read('"Hello, World!"').toJS()
  t.deepEqual(out, ['Hello, World!'], 'just a string')
})

test('reading two strings', function (t) {
  t.plan(1)
  var out = impl.read('"Hello" "World!"').toJS()
  t.deepEqual(out, ['Hello', 'World!'], 'a couple of strings')
})

test('escaping a quote inside a string', function (t) {
  t.plan(1)
  var out = impl.read('"Hello, \\"World!\\""').toJS()
  t.deepEqual(out, ['Hello, "World!"'], 'just a string')
})

// test('reading a symbol', function (t) {
//   t.plan(1)
//   var out = impl.read('test')
// })

// test('reading symbols and numbers', function (t) {
//   t.plan(1)
//   var out = impl.read('+ 1.0 -20 6').toJS()
//   t.deepEqual(out, [new impl.Symbol('+'), 1.0, -20, 6], '"+" symbol with various numbers')
// })

// test('reading symbol and string', function (t) {
//   t.plan(1)
//   var out = impl.read('split "Hello, World!"').toJS()
//   t.deepEqual(out, [new impl.Symbol('split'), 'Hello, World!'], '"split" symbol with a string')
// })
