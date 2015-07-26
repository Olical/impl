var impl = require('..')
var test = require('tape')
var fs = require('fs')

function read (path) {
  path = ['./samples/', path, '.sugar.impl'].join('')
  return impl.read(fs.readFileSync(path, 'utf-8')).toJS()
}

function s (value) {
  return new impl.Symbol(value)
}

test('(with sugar) if statement', function (t) {
  t.plan(1)
  var out = read('if')
  t.deepEqual(out, [
    [s('if'),
      [s('some-fn'), 'arg for some-fn'],
      [s('val'), 10],
      [s('+'),
        [s('fn-a')],
        [s('fn-b')]
      ]
    ]
  ], 'if statement with some function calls')
})

test('(with sugar) fib function', function (t) {
  t.plan(1)
  var out = read('fib')
  t.deepEqual(out, [
    [s('fn'), s('fib'),
      [s('n')],
      [s('if'),
        [s('<'), s('n'), 2],
        [s('val'), 1],
        [s('+'),
          [s('fib'),
            [s('-'), s('n'), 2]
          ],
          [s('fib'),
            [s('-'), s('n'), 1]
          ]
        ]
      ]
    ]
  ], 'a fib function')
})

test('(with sugar) short-names function', function (t) {
  t.plan(1)
  var out = read('short-names')
  t.deepEqual(out, [
    [s('fn'), s('short-names'),
      [s('people')],
      [s('filter'),
        [s('map'), s('people'),
          [s('fn'),
            [s('person')],
            [s('get'), s('person'), 'name']
          ]
        ],
        [s('fn'),
          [s('name')],
          [s('<'),
            [s('len'), s('name')],
            [s('val'), 10]
          ]
        ]
      ]
    ]
  ], 'a filter function called short-names')
})
