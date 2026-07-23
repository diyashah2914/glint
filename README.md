# Glint

A typed subset of JavaScript that transpiles to plain JS — a small compiler
built to learn how type systems and transpilers actually work under the hood.

## Why

In my Fundamentals of Computation module, we covered formal grammars, automata, and how languages can be defined and processed at a basic
level.I wanted to see those ideas applied in a real, working system rather than just on paper — so I built Glint, a typed subset of JavaScript that compiles to plain JS.
Writing the lexer and parser meant applying grammar and automata concepts directly, and building the type checker let me explore how a language enforces
rules beyond just syntax.

## Example

**Plain JS — bug slips through silently:**
```js
let age = "twenty";
console.log(age + 5); // "twenty5" — not what you meant
```

**Glint — caught at compile time:**
```ts
let age: number = "twenty";
// Error: Type 'string' is not assignable to type 'number' (line 1, col 16)
```

## v1 Features
- `let` with type annotations and type inference
- Primitive types: `number`, `string`, `boolean`
- Arithmetic and comparison expressions
- `if` / `else`
- `while` loops
- Typed functions (parameters + return type)
- Clear, line/column-accurate type-error reporting

## Architecture
Source → Lexer → Parser (AST) → Type Checker → Code Generator → JS


[Diagram after glint is built]

## Status
🚧 In progress — Phase [X] of build plan.

## Tech
TypeScript, Vitest
