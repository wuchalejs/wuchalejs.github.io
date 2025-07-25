---
title: Vanilla
parent: Adapters
---

# 🧠 Behavior Explanation

## What Gets Extracted?

This is decided by the heuristic function which you can customize. A sensible
default heuristic function is provided out of the box. Here's how it works:

- If the text contains no letters used in any natural language (e.g., just numbers or symbols), it is ignored.
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

# 🛠️ Configuration Reference

For the main plugin configuration, look in [Usage](/usage).

```javascript

import { adapter as vanillaAdapter } from "wuchale/adapter-vanilla"

const vanillaAdapterConf = vanillaAdapter({
    // Where to store translation files. {locale} will be replaced with the respective locale.
    catalog: './src/locales/{locale}',
    
    // Files to scan for translations and transform
    files: ['src/**/*.{js,ts}'],
    
    // Custom extraction logic
    // signature should be: (text: string, details: object) => boolean | undefined
    // details has the following properties:
        // scope: "markup" | "attribute" | "script",
        // topLevel?: "variable" | "function" | "expression",
        // topLevelCall?: string,
        // call?: string,
        // element?: string,
        // attribute?: string,
        // file?: string,
    heuristic: defaultHeuristic,
    
    // Your plural function name
    pluralFunc: 'plural',
})
```
