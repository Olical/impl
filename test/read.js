var impl = require('..')
var test = require('tape')

test('reading symbols and numbers', function (t) {
  t.plan(1)
  var out = impl.read('+ 10 20').toJS()
  t.deepEqual(out, [new impl.Symbol('+'), 10, 20], 'a + symbol with two numbers')
})
