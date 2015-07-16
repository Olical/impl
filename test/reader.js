var read = require('..').read
require('should')

describe('read', function () {
  describe('bare bones', function () {
    it('reads a number into a list', function () {
      read('101').toJS().should.eql([101])
    })

    it('reads a string into a list', function () {
      read('"hi"').toJS().should.eql(['hi'])
    })

    it('reads an addition call', function () {
      read('+ 5 10').toJS().should.eql([Symbol('+'), 5, 10])
    })
  })
})
