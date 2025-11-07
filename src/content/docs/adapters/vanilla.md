---
title: Vanilla
description: Integrate wuchale with plain JavaScript/TypeScript - extract translations from function-based messages, manage locale catalogs, and implement efficient loading strategies without Vite.
---

Import | `import { adapter } from "wuchale/adapter-vanilla"`
-|-
Loader extensions | `.js`, `.ts`
Default `files` | `src/**/*.{js,ts}`
Available loaders | `vite`, `server`

The Vanilla adapter adds support for plain JavaScript/TypeScript projects. And
how you use it is different based on whether you use Vite or not. If you are
not using Vite, then it is impossible to use virtual modules. Therefore you
have to write every file that your application needs, including compiled
catalogs and proxies.

To support with that, `wuchale` provides the options to [write those
files](/reference/adapter-common/#writefilescompiled) to disk and will adjust
the importing to use relative paths when it writes the output files.

## Setup in Your App

This is assuming that you did not modify the default loader.

### With Vite

```js
import { loadLocale } from 'wuchale/load-utils'
await loadLocale(locale)
```

And you use it like normal, putting strings inside function definitions.

```javascript
const showMsg = (element) => {
    element.innerHTML = 'Hello world'
}
```

### Without Vite

For example, for use with a server,

```js
import { runWithLocale } from 'wuchale/load-utils/server'
//...
app.get('/:locale', (req, res) => {
    runWithLocale(req.params.locale, () => res.send('Hello world'))
})
```

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
