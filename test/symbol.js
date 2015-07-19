var impl = require('..')
var test = require('tape')

test('simple symbol', function (t) {
  t.plan(1)
  var a = new impl.Symbol('foo')
  t.equal(a.value, 'foo', 'symbols contain a value')
})

test('deep equal on symbols', function (t) {
  t.plan(2)
  var a = new impl.Symbol('foo')
  var b = new impl.Symbol('foo')
  var c = new impl.Symbol('bar')
  t.deepEqual(a, b, 'symbols with the same value should be equal')
  t.notDeepEqual(b, c, 'symbols with different values should not be equal')
})
