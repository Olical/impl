# Impl [![Build Status](https://travis-ci.org/Olical/impl.svg?branch=master)](https://travis-ci.org/Olical/impl) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Olical/impl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Homoiconic language with minimal syntax compiling to JavaScript.

This is essentially a toy language that's supposed to be an exercise in language design. It's inspired by [Clojure][] among other Lisps. The immutable persistent data structures are provided by the excellent [ImmutableJS][].

Some day I hope to make this language self hosting with a compiler written in Impl. I'd also like to create a [React][] wrapper and attempt some web development with it.

## Getting started

```bash
# Install the package globally.
npm install -g impl

# Pipe an Impl file through the compiler.
impl < fib.impl > fib.js

# Execute the compiled JavaScript!
node fib.js

# Or even compile and execute in one command.
impl < fib.impl | node
```

### If you're working on Impl

```bash
# Fetch the dependencies. (or npm install)
make bootstrap

# Run the tests. (runs standard linting and tape)
make test

# Or run the tests continually.
make test-watch
```

## Syntax

The syntax is essentially a Lisp with implied parenthesis based on new lines and indentation levels. Each line is a new list which is a child of the list at the previous level of indentation. Reducing the indentation level closes the lists. You can create a tree of lists by continually creating new lines and further levels of indentation (indentation is defined as two spaces).

There are four special characters that allow you override the implicit lists where it makes sense so you don't have to rely on new lines and indentation in every situation.

 * `:` - Start a child list until the end of the line.
 * `;` - Break out of the current list.
 * `,` - Equivalent to `;:`, break out and create a new sibling list until the end of the line.
 * `\` - Escape the next character, even if it's a new line or one of the previous special characters. This causes the reader to skip the next character no matter what.

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

You could join the `fib` calls onto one line with `+: fib: - n 2;, fib: - n 1`, but keeping them on separate lines is far clearer. Here's one more example, this one takes a list of people, extracts their names and then filters out those longer than 10 characters.

```impl
fn short-names: people
  filter
    map people
      fn: person, get person "name"
    fn: name
      <: len name, val 10
```

All lists are executed like Lisp, the first item is presumed to be a function. You must use `val` to return single values and `list` to return a list without executing it.

## Integration

I've created [vim-impl][] to provide some default buffer local settings and syntax detection / highlighting.

## Author

[Oliver Caldwell][author-site] ([@OliverCaldwell][author-twitter])

## Why the name Impl?

*Warning: Dubious reasons for this name will follow. My project just needed a name which sounded quite nice and was fairly unique.*

 * There's **imp**lied **l**ists everywhere
 * It's s**impl**e
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
[vim-impl]: https://github.com/Olical/vim-impl
[clojure]: http://clojure.org/
[react]: http://facebook.github.io/react/
