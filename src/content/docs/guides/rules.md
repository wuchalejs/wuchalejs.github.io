---
title: Extraction rules
---

`wuchale` doesn't force you to only use the predefined extraction rules. Those
are just defaults. What gets extracted is decided by the heuristic function
which you can customize. It is implemented by the adapters so you can configure
it on a per-adapter basis. Sensible default heuristic functions are provided
out of the box. They implement the following rules (where applicable).

## Default rules

### General rule (applies anywhere)

If the message contains no letters used in any natural language (e.g., just
numbers or symbols), it is ignored.

### In `markup` (`<p>Text</p>`)

All textual content is extracted.

Examples:

```svelte
<p>This is extracted</p>
```

### In `attribute` (`<div title="Info">`)
- If the first character is a lowercase English letter (`[a-z]`), it is ignored.
- If the element is a `<path>`, it is ignored (e.g., for SVG `d="M10 10..."` attributes).
- Otherwise, it is extracted.

Examples:

```svelte
<img alt="Profile Picture" class="not-extracted" />
```

### In `script` (`<script>` and `.js/ts`)

- If the value is inside `console.*()` call, it is ignored.
- If the first character is a lowercase English letter (`[a-z]`) or is any
    non-letter character, it is ignored.
- Otherwise, it is extracted.

Examples:

```javascript

const message = 'This is extracted'

function foo() {
    // extracted
    const extracted = 'Hello!'
    const nonExtracted = '-starts with non letter'
}
```

## Per-adapter defaults

In addition to the above rules, the adapter may have additional restrictions to
provide default rules as good as possible. You can see them in the specific
adapter's page.

## Global overrides

If you need more control, you can supply your own [heuristic
function](/reference/adapter-common#heuristic) in the configuration. Custom
heuristics can return `undefined` or `null` to fall back to the default. For
convenience, the default heuristic is exported by the package.

## Specific overrides

If you don't want to modify the global heuristic but want to ignore or include
just a few messages, you can use [comment directives](/guides/comments).

- `@wc-ignore` — skips extraction
- `@wc-include` — forces extraction  
