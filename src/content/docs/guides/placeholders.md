---
title: Placeholders
---

If you are developing for client side rendering and would like to avoid waiting
for the catalogs to load before you show the interface, and instead render the
interface right away and update it once the catalogs are ready, you can show
placeholders in place of the texts.

If you return `undefined` or `null` from the default export function in the
loader file, `wuchale` treats it as the catalog not being ready and it will
instead show placeholders. The placeholders are configurable by giving a
callback to the static method on the `Runtime` class like this:

```js
// anywhere in your code, it just needs to be at app startup
import { Runtime } from 'wuchale/runtime'

Runtime.onInvalid((index, catalogData) => `some placeholder for index ${index}`)
```

Your callback will receive the index and the array (which may be empty) and
should return a string. Now you can use this to show a friendly `...` until the
catalogs load and show a message when there is an invalid item, and warn in the
console:

```js
// anywhere in your code, it just needs to be at app startup
import { Runtime } from 'wuchale/runtime'

Runtime.onInvalid((index, catalogData) => {
    const value = catalogData[index]
    if (value == null) {
        return '...'
    }
    console.warn('Invalid catalog item at index', index, value, catalogData)
    return 'invalid'
})
```

The default callback returns:

- During development:
    - `[i18n-404:0]` when it can't find the item at `0`
    - `[i18n-400:0(value)]` when the value is invalid
- In production: `''`

:::note
If you have [nested messages](/guides/nested), the whole message is replaced
with the placeholder.
:::
