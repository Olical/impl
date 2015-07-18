# Impl [![Build Status](https://travis-ci.org/Olical/impl.svg?branch=master)](https://travis-ci.org/Olical/impl) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Olical/impl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Homoiconic language with minimal syntax compiling to JavaScript.

This is essentially a toy language right now that's supposed to be an exercise in language and basic compiler design. It's inspired by Clojure among other Lisps. The immutable persistent data structures are provided by [ImmutableJS][].

## Bootstrap

```bash
# Fetch the dependencies.
npm install

# Run the tests.
npm test
```

## Syntax

The syntax is essentially a Lisp with implied parenthesis based on new lines and indentation levels. Each line is a new list which is a child of the list at the previous level of indentation. Reducing the indentation level closes the lists. You can create a tree of lists by continually creating new lines and further levels of indentation (currently defined as two spaces).

There are three special characters that allow you to combine lines where it makes sense so you don't have to rely on new lines and indentation in every situation.

 * `:` - Start a child list until the end of the line.
 * `;` - Break out of the current list.
 * `,` - Equivalent to `;:`, break out and create a new sibling list until the end of the line.

When writing an `if` that makes a call to a function, for example, you can use these special characters to make it a little more concise.

```impl
if: some-fn "arg for some-fn"
  val 10
  +: fn-a, fn-b
```

`val` is used to create a function which returns it's first argument. This allows you to return actual values as leaf nodes of the list tree. Here's a Fibonacci function as another example.

```impl
fn fib: n
  if: < n 2
    val 1
    +
      fib: - n 2
      fib: - n 1
```

You could join the `fib` calls onto one line with `+ fib: - n 2;, fib: - n 1`, but keeping them on separate lines is far clearer. Here's one more example, this one takes a list of people, extracts their names and then filters out those longer than 10 characters.

```impl
fn short-names: people
  filter
    map people
      fn: person, get person "name"
    fn: name
      <: len name, 10
```

All lists are executed as in Lisp, the first item is presumed to be a function. You must use `val` to return single values and `list` to return a list without executing it.

## Author

[Oliver Caldwell][author-site] ([@OliverCaldwell][author-twitter])

## Why Impl?

*Warning: Dubious reasons for this name will follow. My project just needed a name which sounded quite nice and was fairly unique.*

 * There's **imp**lied **l**ists everywhere
 * It's (s)impl(e)
 * I wanted it to be similar to Lisp (**Lis**t **P**rocessing)

## Unlicenced

Find the full [unlicense][] in the `UNLICENSE` file, but here's a snippet.

>This is free and unencumbered software released into the public domain.
>
>Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

Do what you want. Learn as much as you can. Unlicense more software.

[unlicense]: http://unlicense.org/
[author-site]: http://oli.me.uk/
[author-twitter]: https://twitter.com/OliverCaldwell
[immutablejs]: https://github.com/facebook/immutable-js
