# [creo][]

 * Simple (seriously, KISS)
 * Homoiconic
 * Lisp like (macros and data)
 * Compiles to JavaScript
 * Significant whitespace
 * ImmutableJS data structures
 * Stack based reader, top of the stack determines how things are interpreted

The data structures can come later. It just needs to be a dialect of vanilla JavaScript for now, so you can `let` something and bind it to a `require` call. It will just be syntax at first, but then I can add stuff like square brace syntax that calls out to `Immutable.List`. Macros should be there from the beginning, that's how if statements and things will work. Just like [clojs][], but a better syntax.

## The syntax

Every token is a new item in a list. A new line and a new level of indentation signifies a nested list. The base level of indentation counts as a list, so every new line is a new list item.

### Fibonacci

Just new lines and indent to signify children.

```
fn fib
  n
  if
    < n 2
      1
      +
        fib
          - n 2
        fib
          - n 1
```

Using special characters in place of new lines and indentation where appropriate. A colon starts a new list until the end of the line. A comma starts another sibling list, like closing the current one and opening a new one. A semi-colon breaks out of a sub-list.

The root list (indentation zero) should actually be a macro which expands all of these functions into a let. Or maybe I need a `def` and `defn` system that operates at a namespace level.

```
fn fib: n
  if: < n 2
    1
    +: fib - n 2, fib - n 1
```

I'm using the number 1 at the start of a new list, so it should really try to execute it. I think I'll make this less lisp like and conditionally execute. If it's a function, execute. If it is not, return it.

And as an actual lisp.

```
(defn fib [n]
  (if (< n 2)
    1
    (+ (fib (- n 2)) (fib (- n 1)))))
```

### Mapping and filtering

Map a list of people into a list of names and filter out those longer than 10 characters.

```
fn short-names: people
  filter
    map people
      fn: person, get person "name"
    fn: name
      <: len name, 10
```

## Old ideas (way too ambitious / complex)

 * Lisp like
 * Homoiconic
 * Immutable
 * Significant whitespace (ideally, unless impractical)
 * Kind of Pythonic, but code is data
 * Typed
 * Compiles to LLVM?
 * JIT?

[creo]: https://github.com/Olical/creo
[clojs]: https://github.com/Olical/clojs
