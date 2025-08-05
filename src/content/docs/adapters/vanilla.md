---
title: Vanilla
---

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

### `initInsideFunc`
**type**: `boolean`
**default**: `false`

By default, the runtime instance variable is initialized on the top
level. But this may make the new content not available on reload unless the
server is restarted. Use this to avoid that problem by initializing the
runtime variable inside each function definition.
