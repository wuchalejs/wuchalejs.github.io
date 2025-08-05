---
title: Vanilla
---

## Behavior Explanation

### What Gets Extracted?

This is decided by the heuristic function which you can customize. A sensible
default heuristic function is provided out of the box. Here's how it works:

- If the message contains no letters used in any natural language (e.g., just numbers or symbols), it is ignored.
- If it's in a top-level expression (not inside an assignment or a function definition) it is ignored.
- If the value is inside `console.*()` call, it is ignored.
- If the first character is a lowercase English letter (`[a-z]`) or is any non-letter, it is ignored.
- Otherwise, it is extracted.

Examples:

```javascript

const message = 'This is extracted'
const lowercase = 'not extracted'

// Force extraction with comment
const forced = /* @wc-include */ 'force extracted'

function foo() {
    const extracted = 'Hello!'
}
```

If you need more control, you can supply your own heuristic function in the
configuration. Custom heuristics can return `undefined` or `null` to fall back
to the default. For convenience, the default heuristic is exported by the
package.

> 💡 You can override extraction with comment directives:
> - `@wc-ignore` — skips extraction
> - `@wc-include` — forces extraction  
> These always take precedence.

## Configuration Reference

For the main configuration, look in the [configuration reference](/reference/config).

For the common adapter configuration, look in the [common adapter options](/reference/adapter-common/).

### `initInsideFunc`
**type**: `boolean`
**default**: `false`

By default, the runtime instance variable is initialized on the top
level. But this may make the new content not available on reload unless the
server is restarted. Use this to avoid that problem by initializing the
runtime variable inside each function definition.
