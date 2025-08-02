---
title: Loading catalogs
description: Tutorial about loading catalogs
---

When it comes to loading catalogs, `wuchale` doesn't restrict you to only use
certain loading strategies. Instead, it provides building blocks to implement
any strategy, and uses them in a sane default way to reduce the initial setup.
But if you need to change the default or want to learn about all available
tools, it is explained here.

## Basics

You can specify one or more adapter configurations in your `wuchale.config.js`.
Each adapter is responsible for the files specified for it. And each adapter
has a loader file. The loader file has one job: loading the [compiled
catalogs](/concepts/catalogs#compiled-catalogs) and providing it to the
transformed modules.

The loader file has to export a function as `default`. The function signature has to be this:

```ts
(loadID: string) => import('wuchale/runtime').Runtime
```

The transformed modules then import that, call it with their
[`loadID`](/concepts/catalogs/#loadid) and expect a `Runtime` object. To be
specific, the top of the transformed modules will be like this:

```js
import _w_load_ from "../path/to/loader.js"
const _w_runtime_ = _w_load_('load_id')
```

This is done synchronously. That means, the loader has to have the catalogs
loaded beforehand or have a reactive mechanism to update them after they are
returned (for example, the svelte loader does this). Also, the loader has to
know beforehand the `loadID`s that will be requested to prepare the catalogs.

The `Runtime` is a tiny wrapper class (whole implementation in just [66
lines](https://github.com/wuchalejs/wuchale/blob/main/packages/wuchale/src/runtime.ts))
for the compiled catalogs that makes it ready to access by the transformed
modules. It accepts a [compiled catalog](/concepts/catalogs#compiled-catalogs)
or `undefined` if none is available.

```js
import { Runtime } from 'wuchale/runtime'

const rt = new Runtime({data: ['Hello'], plural: n => n == 1 ? 0 : 1})
// get the one at index 0
rt.t(0) // -> returns 'Hello'

// or when there is no compiled catalog
const rt = new Runtime()
```

When it has no data, it returns something like `[i18n-404:0]` to indicate that
there is nothing at that index.

Now the loaders are in control of what to provide to the transformed modules.
This makes the loader files in charge of what the transformed modules receive.
Moreover, the transformed modules only need the data, nothing else.

How the loaders load the actual compiled catalogs is then completely in your
control.

## What loaders have access to

### Compiled catalogs

Of course, the main thing the loaders need is the compiled catalogs. The compiled catalogs are provided in two forms:

- **When using Vite**:

    They are provided as virtual modules. The format is:
    ```
    virtual:wuchale/catalog/{adapterKey}/{loadID}/{locale}
    ```

- **When [`writeFiles.compiled`](/reference/adapter-common/#writefilescompiled) is enabled**:

    They are provided as files, written in the directory of the configured
    [`catalog`](/reference/adapter-common/#catalog). The format is:
    ```
    {catalogDir}/{locale}.compiled.{loadID}{ext}
    ```
    Where `ext` is the extension of the loader file (e.g. `.js` or `.svelte.js`)

Now you can import (load) them in two ways:

- **Directly** (synchronously):

    ```js
    import * as enCatalog from 'virtual:wuchale/catalog/main/main/en'
    import * as esCatalog from 'virtual:wuchale/catalog/main/main/es'

    const catalogs = {
        en: enCatalog,
        es: esCatalog,
    }
    ```

- **Lazily** (asynchronously):

    ```js
    const catalogs = {
        en: () => import('virtual:wuchale/catalog/main/main/en'),
        es: () => import('virtual:wuchale/catalog/main/main/es'),
    }
    ```

And now using these, you can return suitable `Runtime` objects. Assuming two
`loadID`s (`main` and `other`):

```js
// src/locales/loader.js
import { Runtime } from 'wuchale/runtime'
import * as enMain from 'virtual:wuchale/catalog/main/main/en'
import * as esMain from 'virtual:wuchale/catalog/main/main/es'
import * as enOther from 'virtual:wuchale/catalog/main/other/en'
import * as esOther from 'virtual:wuchale/catalog/main/other/es'

let locale = 'en' // maybe controlled by state

const catalogs = {
    main: {
        en: enMain,
        es: enMain,
    },
    other: {
        en: enOther,
        es: esOther,
    },
}

export default loadID => new Runtime(catalogs[loadID]?.[locale])
```

### Proxies

Manually importing all of the available catalogs, building the `catalogs`
object and keeping track of the `loadID`s is repetitive error prone, especially
when using [`granularLoad`](/reference/adapter-common/#granularload). For that
reason, proxies are provided.

Proxies are convenience modules that import the catalogs, build the object, and
provide the `loadID`s and a function to load the catalogs. For each loader,

- **When using vite**: two proxies are provided.
    - Asynchronous:
        ```
        virtual:wuchale/loader
        ```
    - Synchronous
        ```
        virtual:wuchale/loader/sync
        ```
- **When `writeFiles.compiled` is enabled**: only synchronous:
    ```
    {catalogDir}/proxy.{ext}
    ```

What they provide is the same (only different in being asynchronous).

- A function to load a compiled catalog already in `Runtime`, given the `loadID` and the locale:
    - Synchronous
        ```ts
        export function loadCatalog(loadID: string, locale: string): import('wuchale/runtime').CatalogModule
        ```
    - Asynchronous
        ```ts
        export function loadCatalog(loadID: string, locale: string): Promise<import('wuchale/runtime').CatalogModule>
        ```
- An array of `loadID`s that will be requested:
    ```ts
    export const loadIDs: string[]
    ```

**Note**: What the proxies provide is dependent on which loader is importing
them. They export different arrays and functions to different loaders.
Therefore, you can only import from them inside the loaders only. If you need
to something from them elsewhere, re-export them from the loaders.

Now, the above loader can be simplified, and generalized, to:

```js
// src/locales/loader.js
import { Runtime } from 'wuchale/runtime'
import { loadCatalog, loadIDs } from 'virtual:wuchale/loader/sync'

let locale = 'en' // maybe controlled by state
const locales = ['en', 'es']
const catalogs = {}

for (const loadID of loadIDs) {
    catalogs[loadID] = catalogs[loadID] ?? {}
    for (const locale of locales) {
        catalogs[loadID][locale] = loadCatalog(loadID, locale) // already in Runtime
    }
}

export default loadID => catalogs[loadID]?.[locale] ?? new Runtime()
```

Now this can work for any number of `loadID`s and you don't have to keep track
of them even if you use `granularload`.

## Loading utilities

There is one more abstraction layer provided: collectively loading catalogs
when locales change. But this requires different methods on the client and on
the server.

### On the client

Here there is only one user, so using a single global state to load the
catalogs to is appropriate. The module used for this is `wuchale/run-client`.

The setup is done in two steps. The first step is registering the load
functions with the `loadID`s at the central registry. This is done in the
loader. Continuing with the above example loader, it now becomes very simple.

```js
// src/locales/loader.js
import { loadCatalog, loadIDs } from 'virtual:wuchale/loader/sync'
import { registerLoaders } from 'wuchale/run-client'

export default registerLoaders('main', loadCatalog, loadIDs)
```

`registerLoaders` returns a function already prepared for use by the importing
transformed modules so it can be directly exported as `default`.

**Note**: This is actually the default loader content for the vanilla adapter.

The next step is to set the locale. It can be done anywhere you want.

```js
import { loadLocale } from 'wuchale/run-client'

// ...
await loadLocale(locale)
// ...
```

It uses `await` although it is synchronous. This is to make it usable in both
cases.

### On the server

There can be multiple different requests at the same time on the server and
this necessitates the use of a per-request isolation mechanism for the loaded
catalogs because we don't want one user to see a language they didn't choose
because of another user.

For this we use the exports from `wuchale/run-server`. And the isolation is
done using the
[`AsyncLocalStorage`](https://nodejs.org/api/async_context.html). Again, the
setup is done in two steps. First, inside the loader file, we instruct the
catalogs to be loaded and be ready.

```js
// src/locales/loader.js

import { loadCatalog, loadIDs } from './proxy.js' // or loader/sync
import { loadLocales } from 'wuchale/run-server'

export default await loadLocales('main', loadIDs, loadCatalog, ['en', 'es'])
```

Then when we want to process a request, we wrap the request processing with a
locale setup:

```js
import { runWithLocale } from 'wuchale/run-server'

app.get('/:locale', (req, res) => {
    runWithLocale(req.params.locale, () => respond(res))
})
```

### Side-effect-free loading

One last loading convenience provided is this. You already know the locale, you
have the `loadID`s and the load function from the proxy, you just want a
direct, no side effect way to load the catalogs. For that, the
`wuchale/run-client` provides another function, which can be used like this:

```js
import { loadCatalogs } from 'wuchale/run-client'
import { loadIDs, loadCatalog } from '../locales/loader.js'

let locale = 'en'

const catalogs = await loadCatalogs(locale, loadIDs, loadCatalog)
```

Then `catalogs` becomes an object with the `loadID`s as the keys and loaded
`Runtime` objects as values. This is how the `sveltekit` example works.
