---
title: Vanilla
---

Import | `import { adapter } from "wuchale/adapter-vanilla"`
-|-
Loader extensions | `.js`, `.ts`
Default `files` | `src/**/*.{js,ts}`

## Default extraction rules

In addition to the [default rules](/guides/rules), this adapter implements
additional restrictions.

If the message is not in a function definition, it is ignored.

Examples:

```javascript

const message = 'This is not extracted'
const lowercase = 'not extracted'

function foo() {
    const extracted = 'Hello!'
}
```

## Configuration Reference

For the main configuration, look in the [configuration reference](/reference/config).

For the common adapter configuration, look in the [common adapter options](/reference/adapter-common/).

This adapter doesn't have additional configuration options.
