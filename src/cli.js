#!/usr/bin/env node

var impl = require('./')

console.error('Not implemented yet :(')
console.error('Here\'s the parsed data structure though')

process.stdin.setEncoding('utf8')
var source = []

process.stdin.on('readable', function () {
  var chunk = process.stdin.read()
  if (chunk !== null) {
    source.push(chunk)
  }
})

process.stdin.on('end', function () {
  var result = JSON.stringify(impl.read(source.join('')), null, 2)
  console.log('\n' + result)
})
