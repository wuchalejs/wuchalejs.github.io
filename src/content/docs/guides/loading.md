---
title: Loading catalogs
description: Master catalog loading in wuchale - configure loaders, utilize proxies, and implement client/server utilities for efficient internationalization in your app.
---

When it comes to loading catalogs, `wuchale` doesn't restrict you to only use
certain loading strategies. Instead, it provides building blocks to implement
any strategy, and uses them in a sane default way to reduce the initial setup.
But if you need to change the default or want to learn about all available
tools, it is explained here.

## Basics

You can specify one or more adapter configurations in your `wuchale.config.js`.
Each adapter is responsible for the files specified for it. And each adapter
can have one or two loader files ([generated or manually
written](/reference/adapter-common/#loader)):

- `client`: Used for when the code is in the browser
- `server`: Used when server side rendering or for server messages

:::tip
You can see where exactly these files are using the command `npx wuchale status`.
:::

Each loader file has one job: loading the [compiled
catalogs](/concepts/catalogs#compiled-catalogs), creating runtime objects from
them, and providing them to the transformed modules.

The loader file has to export two functions:

```ts
getRuntime(loadID: string): import('wuchale/runtime').Runtime | null | undefined
getRuntimeRx(loadID: string): import('wuchale/runtime').Runtime | null | undefined
```

They should be two because some libraries (specifically React) restrict using
reactive functions to only some places. Because of that, one function should be
reactive (`getRuntimeRx`) and the other one should a non-reactive (`getRuntime`).
Apart from this, their job is the same. Where they are used is
[configurable](/reference/adapter-common/#runtimeusereactive).

The transformed modules then import them, call them with their
[`loadID`](/concepts/catalogs/#loadid)s and expect a `Runtime` object. To
be specific, the transformed modules will have something like this (depending
on the adapter):

```js
import {getRuntime as _w_load_, getRuntimeRx as _w_load_rx_} from "../path/to/loader.js"
const _w_runtime_ = _w_load_('key') // plain
const _w_runtime_ = _w_load_rx_('key') // reactive
```

This is done synchronously. That means, the loader has to have the catalogs
loaded beforehand or have a reactive mechanism to update them after they are
returned. And for that, the loader has to know beforehand the `loadID`s that will be
requested to prepare the catalogs.

If the loader returns `null` | `undefined` then the catalog is assumed not
ready and [placeholders](/guides/placeholders) are shown instead of the
messages.

To give you an idea, this is what the loader file has to do.

```js

import toRuntime from 'wuchale/runtime'

// prepare/load the catalog
const catalogModule = {c: ['Hello'], p: n => n == 1 ? 0 : 1}
const rt = toRuntime(catalogModule, 'en')

export const getRuntime = loadID => {
    return rt
}

export const getRuntimeRx = loadID => {
    // do something different if needed for reactivity
    return rt
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
locales as keys and runtime objects as values, and you just have to do the
simple selection and return in your loader file.

```js
// any state store for the locale
let locale = 'en'

export const getRuntime = (runtimes) => runtimes[locale]
export const getRuntimeRx = getRuntime
```

That's all. Because the importing files will just directly import the runtime
before calling the loader function. They just need to know which one to use.
While this makes the whole setup simple, it inflates the bundle size as it
imports the catalogs for *all locales* even though only one is needed by the
user.

## What loaders have access to

### Compiled catalogs

Of course, the main thing the loaders need is the catalog modules. They are
provided as files, written under the directory of the configured
[`localesDir`](/reference/adapter-common/#localesDir). The format is:

```
{localesDir}/.wuchale/{adapterKey}.{loadID}.{locale}.compiled{ext}
```

Where `ext` is the extension of the loader file (e.g. `.js` or `.svelte.js`)

They can be imported (loaded) in one of two ways:

- **Directly** (synchronously):

    ```js
    import * as enCatalog from '../locales/.wuchale/main.main.en.compiled.js'
    import * as esCatalog from '../locales/.wuchale/main.main.es.compiled.js'

    const catalogs = {
        en: enCatalog,
        es: esCatalog,
    }
    ```

- **Lazily** (asynchronously):

    ```js
    const catalogs = {
        en: () => import('../locales/.wuchale/main.main.en.compiled.js'),
        es: () => import('../locales/.wuchale/main.main.es.compiled.js'),
    }
    ```

And now using these, you can return suitable catalog modules. Assuming one
`loadID`, `main`:

```js
// src/locales/main.loader.js

import toRuntime from 'wuchale/runtime'
import * as enMain from './.wuchale/main.main.en.compiled.js'
import * as esMain from './.wuchale/main.main.es.compiled.js'

let locale = 'en' // maybe controlled by state

const catalogs = {
    main: {
        en: enMain,
        es: enMain,
    },
}

export const getRuntimeRx = loadID => toRuntime(catalogs[loadID]?.[locale], locale)
export const getRuntime = getRuntimeRx
```

### Proxies

Manually importing all of the available catalogs, building the `catalogs`
object and keeping track of the `loadID`s is repetitive error prone, especially
when using [`granularLoad`](/reference/adapter-common/#granularload). For that
reason, proxies are provided.

Proxies are convenience modules that import the catalogs, build the object, and
provide the `loadID`s and a function to load the catalogs.
For each adapter, two proxies are provided:

- Asynchronous:
    ```
    {localesDir}/.wuchale/{adapterKey}.proxy.{ext}
    ```
- Synchronous
    ```
    {localesDir}/.wuchale/{adapterKey}.proxy.sync.{ext}
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

Now, the above loader can be simplified, and generalized, to:

```js
// src/locales/main.loader.js

import toRuntime from 'wuchale/runtime'
import { loadCatalog, loadIDs } from './.wuchale/main.proxy.sync.js'

let locale = 'en' // maybe controlled by state
const locales = ['en', 'es']
const runtimes = {}

for (const loadID of loadIDs) {
    runtimes[loadID] = runtimes[loadID] ?? {}
    for (const locale of locales) {
        runtimes[loadID][locale] = toRuntime(loadCatalog(loadID, locale), locale)
    }
}

export const getRuntimeRx = loadID => runtimes[loadID]?.[locale]
export const getRuntime = getRuntime
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
loader. Continuing with the above example loader, and now intending to load the
catalogs asynchronously, it now becomes very simple.

```js
// src/locales/main.loader.js
import { loadCatalog, loadIDs, key } from './.wuchale/main.proxy.js'
import { registerLoaders } from 'wuchale/load-utils'

export const getRuntimeRx = registerLoaders(key, loadCatalog, loadIDs)
export const getRuntime = getRuntimeRx
```

`registerLoaders` returns a function already prepared for use by the importing
transformed modules so it can be directly exported. It also registers the
loaders in a global store, and later we can call `loadLocale` (see below)

`registerLoaders` takes an optional fourth argument, a `CatalogCollection` object:

```ts
type CatalogCollection = {
    get: (loadID: string) => CatalogModule
    set: (loadID: string, catalog: CatalogModule) => void
}
```

Every time a new catalog is loaded, the `set` function will be called and it's
up to the collection object how it is stored. And every time a catalog is
requested, the `get` method will be used, so the collection can return the
catalog from where it stored it. This is created to allow integrating the
locale changes with the reactivity of the framework.

Additionally, if the framework supports reactive objects like proxies (e.g.
Svelte), there is a function provided from `load-utils` called
`defaultCollection` that can produce a collection object from a state object.
You can use it like this (example in Svelte):

```js
import { loadCatalog, loadIDs } from './.wuchale/main.proxy.js'
import { registerLoaders, defaultCollection } from 'wuchale/load-utils'

const key = 'main'

const catalogs = $state({})

export const getRuntimeRx = registerLoaders(key, loadCatalog, loadIDs, defaultCollection(catalogs))
export const getRuntime = getRuntimeRx
```

:::tip
And this is the content of the default Svelte loader.
:::

Now the final step is to set the locale. It can be done anywhere you want. But
you have to import the loader so that the loader function is registered.

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
// src/locales/main.loader.js

import { loadCatalog, loadIDs } from './main.proxy.sync.js'
import { loadLocales } from 'wuchale/load-utils/server'
import { locales } from './data.js'

const key = 'main'

export const getRuntimeRx = await loadLocales(key, loadIDs, loadCatalog, locales)
export const getRuntime = getRuntime
```

:::tip
This is the content of the Vanilla adapter's `server` loader.
:::

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
            localesDir: 'src/product/locales',
        }),
        services: svelte({
            files: ['src/services/**/*.svelte'],
            localesDir: 'src/services/locales',
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
