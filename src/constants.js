module.exports = {
  syntax: {
    indentation: {
      character: ' ',
      count: 2
    },
    delimiters: {
      openList: ':',
      closeList: ';',
      nextList: ',',
      listItem: ' ',
      string: '"'
    },
    tokens: {
      symbol: /[\w-_!?+/*%]+/,
      number: /\d+/
    }
  }
}
