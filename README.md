# impl [![Build Status](https://travis-ci.org/Olical/impl.svg?branch=master)](https://travis-ci.org/Olical/impl) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Olical/impl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

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

Ever since I started playing with Lisps I have grown to love minimal syntax where I can define the language in terms of macros. I've tried to keep syntax as light as possible whilst creating all lists implicitly. Lists are determined by line breaks and indentation with a few little helpers to make some situations slightly more concise.

A child list is created when you increase the level of indentation. Right now two spaces is the expected indentation but indentation detection would be easy enough to add if required. A sibling list is created for every new line at the same indentation. A simple if statement can be represented as follows.

```
if some-bool
  ;10
  ;20
```

If `some-bool` is true, it will return 10, otherwise 20. This is as you'd expect from any Lisp, just without the parenthesis. The `;` (pops you out of the current list) is required because each line is implicitly wrapped in a List, this allows you to do things like this.

```
if some-bool
  + 10 20
  - 10 20
```

I think the trade off is worth it. It makes calling things easy and returning non-functions only a single character away. If you need to pass a list of functions around without executing the first one you can use the `list` function.

It's worth noting that using `;` to pop out of an empty list will discard the list entirely. Obviously if you wanted to execute a function in this if statement as the predicate it'd be a little cumbersome, for example.

```
if
  some-func
  ;"yep"
  ;"nope"
```

That's why you can use `:` to create a sub-list up until the end of the line. You can also use `;` to close a list and `,` to close and then re-open a new list. Essentially creating a sibling.

```
if: some-func; "yep" "nope"
```

This allows you to do everything you would usually do with line breaks and indentation, but all on one line explicitly. I only used the `;` for demonstration, you could have just left the return values on their new lines. You may notice that you don't need to escape the strings in this case too, that's because they're not on new lines.

That's pretty much all of the syntax (so far). There's going to be a bunch of macros and functions as well as JavaScript interop that make up the rest of the language, but this gives you a rough idea of what I'm aiming for.

## Author

[Oliver Caldwell][author-site] ([@OliverCaldwell][author-twitter])

## Why Impl?

*Warning: Dubious reasons for this name will follow. My project just needed a name which sounded quite nice and was fairly unique.*

 * There's *imp*lied *l*ists everywhere
 * It's (s)impl(e)
 * I wanted it to be similar to Lisp (*Lis*t *P*rocessing)

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
