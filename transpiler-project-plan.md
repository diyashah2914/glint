# MiniTS — Build Plan

A typed subset of JavaScript that transpiles to plain JS, with type checking.
Goal: working, tested, demoable v1 with a browser playground.

---

## Phase 0 — Setup & Scoping (few days)
- [x] Pick your language: TypeScript or Python (recommend TypeScript — dogfooding the ecosystem you're mimicking)
- [x] Set up repo: git init, README skeleton, folder structure (`/lexer`, `/parser`, `/checker`, `/codegen`, `/tests`)
- [x] Write down your v1 feature list on paper — the exact grammar you'll support (see Phase 2)
- [x] Decide your "before/after" demo example for the README (write it now, even if untested — keeps you focused)
- [x] Set up a test runner (Jest if TS, pytest if Python) from day one

**Exit criteria:** repo exists, empty pipeline stubbed (`source → tokens → AST → checked AST → JS string`), one dummy test passes.

---

## Phase 1 — Lexer (Tokenizer)
- [x] Define token types: identifiers, keywords (`let`, `if`, `while`, `function`, `return`), literals (number, string, boolean), operators, punctuation
- [x] Handle whitespace/comments (skip, don't tokenize)
- [x] Track line/column numbers per token (you'll need this for error messages later — don't skip it)
- [x] Write tests: tokenize simple snippets, check exact token sequences
- [x] Handle lexer errors (invalid characters) with position info

**Exit criteria:** can tokenize `let x: number = 5;` correctly, tests cover normal + error cases.

---

## Phase 2 — Parser (AST construction)
Define your grammar first, then build top-down (recursive descent is fine, simplest to reason about).

v1 grammar to support:
- Variable declarations with type annotations: `let x: number = 5;`
- Type inference when no annotation given: `let x = 5;`
- Primitive types: `number`, `string`, `boolean`
- Expressions: arithmetic, comparison, logical, string concat
- `if` / `else`
- `while` loops
- Functions with typed params + return type: `function add(a: number, b: number): number { ... }`
- Function calls
- Arrays: `number[]`, basic indexing
- Basic objects/object types (stretch goal — do after everything else works)

Tasks:
- [x] Define AST node types for each grammar rule
- [ ] Implement recursive descent parser, one construct at a time (start with expressions, then statements)
- [ ] Handle operator precedence (Pratt parsing or precedence climbing for expressions)
- [ ] Parser error recovery — report line/col, don't just crash on first bad token
- [ ] Tests: one test file per grammar construct

**Exit criteria:** every construct in your v1 grammar parses into a correct AST, with tests for each.

---

## Phase 3 — Type Checker (the "meaty" part — most CV value here)
- [ ] Build a symbol table with scope chaining (global scope, function scope, block scope)
- [ ] Implement type inference for literals and expressions
- [ ] Check variable declarations against inferred/annotated types
- [ ] Check function calls: argument count + argument types match parameter types
- [ ] Check function return type matches actual returned expression type
- [ ] Check binary operators are used on compatible types (no `"hello" - 5`)
- [ ] Design clear error format: `TypeError: Type 'string' is not assignable to type 'number' (line 4, col 9)`
- [ ] Tests: valid programs type-check cleanly; invalid programs produce the right error

**Exit criteria:** a solid set of type-error test cases all produce correct, specific error messages with line/col.

---

## Phase 4 — Code Generator
- [ ] Walk the (checked) AST and emit plain JS, stripping type annotations
- [ ] Preserve source structure reasonably (readable output, not minified garbage)
- [ ] Tests: compiled output actually runs correctly in Node for each construct
- [ ] End-to-end tests: source → compile → run → check runtime output matches expectation

**Exit criteria:** every passing v1 program compiles to JS that runs correctly in Node.

---

## Phase 5 — Polish & Developer Experience
- [ ] CLI: `minits compile file.mts` → outputs `.js`
- [ ] Good error output in the terminal (colored, pointing at the exact column with a caret `^`)
- [ ] Handle edge cases you skipped earlier (empty files, syntax you forgot, nested scopes)
- [ ] Increase test coverage — aim for every grammar rule + every error type covered

**Exit criteria:** you could hand this to a stranger and they could compile something without you explaining anything.

---

## Phase 6 — Playground (the "wow" factor)
- [ ] Small web page: code editor on left (Monaco or CodeMirror), compiled JS + errors on right, live update
- [ ] Deploy it somewhere free (Vercel/Netlify/GitHub Pages) so it's a clickable link, not just a repo
- [ ] Add 3-4 preloaded examples (including one that shows a caught type error) so visitors don't stare at a blank editor

**Exit criteria:** a shareable URL that works on a stranger's laptop, first try.

---

## Phase 7 — README & Presentation
- [ ] Problem statement: why this exists (learning framing — be honest, see earlier discussion)
- [ ] Before/after code example (plain JS bug vs. MiniTS catching it)
- [ ] GIF or screenshot of the playground
- [ ] Architecture diagram (lexer → parser → checker → codegen) — one image, keep it simple
- [ ] "What I learned" section — genuinely useful for interview prep, forces you to articulate it
- [ ] Link to playground at the very top

**Exit criteria:** someone unfamiliar with the project understands what it is and why it's impressive within 30 seconds of opening the README.

---

## Phase 8 (stretch, only if time allows)
- [ ] Object/interface types
- [ ] Union types (`number | string`)
- [ ] Basic generics
- [ ] Better inference (e.g. inferring array element types, function return types)

**Do not start this phase until Phases 0–7 are genuinely done.** A finished simple project beats an unfinished ambitious one, every time.

---

## Rough time guide (part-time, alongside coursework)
- Phase 0–1: ~1 week
- Phase 2: ~2 weeks
- Phase 3: ~2–3 weeks (hardest, most valuable phase — don't rush it)
- Phase 4: ~1 week
- Phase 5: ~1 week
- Phase 6: ~1 week
- Phase 7: ~2–3 days

Total: roughly 8–10 weeks part-time to a genuinely polished v1.
