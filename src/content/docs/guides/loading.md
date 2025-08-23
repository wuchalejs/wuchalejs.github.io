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
(loadID: string) => import('wuchale/runtime').CatalogModule | null | undefined
```

The transformed modules then import that, call it with their
[`loadID`](/concepts/catalogs/#loadid) and expect a `CatalogModule` object. To
be specific, the top of the transformed modules will be like this:

```js
import _w_to_rt_ from 'wuchale/runtime'
import _w_load_ from "../path/to/loader.js"
const _w_runtime_ = _w_to_rt_(_w_load_('key'))
```

This is done synchronously. That means, the loader has to have the catalogs
loaded beforehand or have a reactive mechanism to update them after they are
returned. Also, the loader has to know beforehand the `loadID`s that will be
requested to prepare the catalogs.

If the loader returns `null` | `undefined` then the catalog is assumed not
ready and [placeholders](/guides/placeholders) are shown instead of the
messages.

To give you an idea, this is what the loader file has to do.

```js
// prepare/load the catalog
const catalogModule = {c: ['Hello'], p: n => n == 1 ? 0 : 1}

export default loadID => {
    return catalogModule
}
```

Now the loaders are in control of what to provide to the transformed modules.
This makes the loader files in charge of what the transformed modules receive.
Moreover, the transformed modules only need the data, nothing else.

How the loaders load the actual catalog modules is then completely in your
control. But infrastructure is provided to help you with that.

## `bundleLoad` config

It is important to mention that if you use
[`bundleLoad`](/reference/adapter-common/#bundleload), then you don't have to
deal with anything below.

Instead of the `loadID`, the loader function will receive an object with the
locales as keys and catalog modules as objects, and you just have to do the
simple selection and return in your loader file.

```js
// any state store for the locale
let locale = 'en'

export default (catalogs) => catalogs[locale]
```

That's all. Because the importing files will just directly import the catalog
modules and prepare the object before calling the loader function. They just
need to know which one to use. While this makes the whole setup simple, it
inflates the bundle size as it imports the catalogs for *all locales* even
though only one is needed by the user.

## What loaders have access to

### Compiled catalogs

Of course, the main thing the loaders need is the catalog modules. They are
provided in two forms:

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

And now using these, you can return suitable catalog modules. Assuming two
`loadID`s (`main` and `other`):

```js
// src/locales/loader.js
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

export default loadID => catalogs[loadID]?.[locale]
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
        virtual:wuchale/proxy
        ```
    - Synchronous
        ```
        virtual:wuchale/proxy/sync
        ```
- **When `writeFiles.compiled` is enabled**: only synchronous:
    ```
    {catalogDir}/proxy.{ext}
    ```

What they provide is the same (only different in being asynchronous).

- A function to load a catalog module, given the `loadID` and the locale:
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
- The adapter's key from the config:
    ```ts
    export const key: string
    ```

:::note
What the proxies provide is dependent on which loader is importing
them. They export different arrays and functions to different loaders.
Therefore, you can only import from them inside the loaders only. If you need
to something from them elsewhere, re-export them from the loaders.
:::

Now, the above loader can be simplified, and generalized, to:

```js
// src/locales/loader.js
import { loadCatalog, loadIDs } from 'virtual:wuchale/proxy/sync'

let locale = 'en' // maybe controlled by state
const locales = ['en', 'es']
const catalogs = {}

for (const loadID of loadIDs) {
    catalogs[loadID] = catalogs[loadID] ?? {}
    for (const locale of locales) {
        catalogs[loadID][locale] = loadCatalog(loadID, locale)
    }
}

export default loadID => catalogs[loadID]?.[locale]
```

Now this can work for any number of `loadID`s and you don't have to keep track
of them even if you use `granularLoad`.

## Loading utilities

There is one more abstraction layer provided: collectively loading catalogs
when locales change. But this requires different methods on the client and on
the server.

### On the client

Here there is only one user, so using a single global state to load the
catalogs to is appropriate. The module used for this is `wuchale/load-utils`.

The setup is done in two steps. The first step is registering the load
functions with the `loadID`s at the central registry. This is done in the
loader. Continuing with the above example loader, it now becomes very simple.

```js
// src/locales/loader.js
import { loadCatalog, loadIDs, key } from 'virtual:wuchale/proxy/sync'
import { registerLoaders } from 'wuchale/load-utils'

export default registerLoaders(key, loadCatalog, loadIDs)
```

`registerLoaders` returns a function already prepared for use by the importing
transformed modules so it can be directly exported as `default`.

:::tip
This is actually the default loader content for the vanilla adapter.
:::

The next step is to set the locale. It can be done anywhere you want. But you
have to import the loader so that the loader function is registered.

```js
import { loadLocale } from 'wuchale/load-utils'
import '../path/to/loader.js' // make sure it's registered

// ...
await loadLocale(locale)
// ...
```

:::tip
There is also `loadLocaleSync` from `wuchale/load-utils` if you use synchronous loaders.
:::

### On the server

There can be multiple different requests at the same time on the server and
this necessitates the use of a per-request isolation mechanism for the loaded
catalogs because we don't want one user to see a language they didn't choose
because of another user.

For this we use the exports from `wuchale/load-utils/server`. And the isolation is
done using the
[`AsyncLocalStorage`](https://nodejs.org/api/async_context.html). Again, the
setup is done in two steps. First, inside the loader file, we instruct the
catalogs to be loaded and be ready.

```js
// src/locales/loader.js

import { loadCatalog, loadIDs, key } from './proxy.js'
import { loadLocales } from 'wuchale/load-utils/server'

export default await loadLocales(key, loadIDs, loadCatalog, ['en', 'es'])
```

Then when processing a request, wrap the request processing with a locale
setup:

```js
import { runWithLocale } from 'wuchale/load-utils/server'

app.get('/:locale', (req, res) => {
    runWithLocale(req.params.locale, () => respond(res))
})
```

### Side-effect-free loading

One last loading convenience provided is this. You already know the locale, you
have the `loadID`s and the load function from the proxy, you just want a
direct, no side effect way to load the catalogs. For that, the
`wuchale/load-utils/pure` provides another function, which can be used like this:

```js
import { loadCatalogs } from 'wuchale/load-utils/pure'
import { loadIDs, loadCatalog } from '../locales/loader.js'

let locale = 'en'

const catalogs = await loadCatalogs(locale, loadIDs, loadCatalog)
```

Then `catalogs` becomes an object with the `loadID`s as the keys and loaded
`CatalogModule` objects as values. This is how the `sveltekit` example works.

## Recommendations

Given that `wuchale` multiple loading strategies, you may be wondering which to
use when. That depends on some factors.

### Client

For an application that contains a relatively small number of messages as a
whole, a single adapter without `granularLoad` (i.e. the default config) is
sufficient. For a large application, there are multiple methods to manage it:

#### Multiple adapter configurations

```js
// wuchale.config.js
export default defineConfig({
    // sourceLocale is en by default
    otherLocales: ['es'],
    adapters: {
        product: svelte({
            files: ['src/product/**/*.svelte'],
            catalog: 'src/product/locales/{locale}',
        }),
        services: svelte({
            files: ['src/services/**/*.svelte'],
            catalog: 'src/services/locales/{locale}',
        }),
        // ...
    }
})
```

This uses two catalogs per locale for the `products` and `services` parts of
the application. The number of catalogs does not depend on the number of files.

This is useful when the number of messages per file is not big but the number of
the files themselves is big. The files can share the same catalogs within their
adapter configuration.

#### Single adapter with `granularLoad`

```js
// wuchale.config.js
export default defineConfig({
    // sourceLocale is en by default
    otherLocales: ['es'],
    adapters: {
        main: svelte({
            granularLoad: true,
            // generateLoadID can be used optionally
        }),
    }
})
```

This uses a single adapter but the catalog modules are broken into small
parts on a per-file basis by default (unless a custom
[`generateLoadID`](/reference/adapter-common#generateloadid) is given which may
selectively decide to make multiple files share the same catalog).

This is useful when there are large numbers of messages in individual files. It
would not make sense making them share the same catalogs because the resulting
catalog would be huge.

#### Any combination

If your needs are more complicated, you can combine the above methods into any other method.

### Server

On the server, everything is already there and bundle size becomes irrelevant.
Therefore, for the server, synchronous loading (direct import) is recommended
and provides faster app startup and performance as everything is already loaded
during runtime.
