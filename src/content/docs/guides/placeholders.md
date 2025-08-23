---
title: Placeholders
---

If you are developing for client side rendering, and are using async loading
insiead of [`bundleLoad`](/reference/adapter-common/#bundleload), there are two
ways of showing the messages:

1. **Loading message**: Showing a loading indicator message instead of the
   components until the catalogs load, and then rendering the components. This
makes sure that the interface has a clear succession of states and doesn't
cause any flicker. The drawback is that if you use lazy-loaded components or
requests inside components, since they will not be rendered until the catalogs
load, their requests only start *after* the requests for the catalogs ends, not
in parallel. Depending on your case, this may not be desirable.

1. **Placeholder messages**: Rendering all components right away, in which case
   `wuchale`'s runtime will show configurable placeholders instead of the
messages until the catalogs are loaded and then updates them once they are.
This allows parallel execution of other requests and can make the app feel
faster. The disadvantage is that it may be undesirable to update the messages
after they are rendered.

If you choose the latter, you can customize the placeholders shown until
the catalogs are loaded.

:::note
To use this, you have to use the framework's reactivity model for the
catalogs inside the loader file. Basically, what the loaders return should be
reactive to locale changes. If you don't modify them, the default loaders are
designed to be that way.
:::

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
