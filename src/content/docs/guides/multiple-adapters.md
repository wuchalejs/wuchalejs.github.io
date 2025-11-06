---
title: Multiple adapters
description: Learn how to configure multiple adapters in wuchale to manage large applications, partition catalogs, and handle different parts of your codebase with specific adapters.
---

Sometimes one adapter is not enough for either or both of the following
reasons:

- The application is too big which makes the catalogs too big and breaking them into smaller parts is desired
- Need to use different types of adapters (e.g. Svelte and Vanilla) for different parts of the codebase

`wuchale` supports this natively, you just specify the adapters you want with
different keys (any identifier you want, it doesn't have to be `main`) in the
config and you can use the same type of adapter multiple times.

```js
// wuchale.config.js
// @ts-check
import { adapter as jsx } from "@wuchale/jsx"
import { adapter as vanilla } from "wuchale/adapter-vanilla"
import { defineConfig } from "wuchale"

export default defineConfig({
    // sourceLocale is en by default
    otherLocales: ['es'],
    adapters: {
        server: vanilla(),
        client: jsx(),
    }
})
```

Each adapter takes a [configuration options](/reference/adapter-common/) object
as an argument. This is necessary to specify different options on a per-adapter
basis. The most important options are discussed below.

## Important configuration values

### `files`

Each adapter operates over and is responsible for specific files. This option
allows specifying which files by using glob patterns. You have to make sure
that no two adapters have overlapping `files` patterns. Each file should be
accounted for by a single adapter. You can check the default option for this in
the adapter page and override it if it can clash with other adapters.

### `catalog`

This option controls where the catalogs (PO files, and compiled catalogs if
`writeFiles.compiled` is enabled) are written, and also is used to compute the
default loader location for the adapter. The default is common to all adapters.

Adapters can share the same catalog as long as they use different loaders.

- If you want to keep their catalogs separate, specify different `catalog` options for them.
- If you want them to share the same catalog, which means they will write to the same PO files, you can specify the same `catalog` option for them. They will be coordinated to prevent race conditions by using shared states.

### `loaderPath`

Each adapter, regardless of whether it shares the catalog or not, should have its own unique loader file. Therefore,

- If you specify different `catalog` options for the adapters, since the default `loaderPath` is computed from that, the loaders will be separate, no need to provide `loaderPath`.
- If you use the same `catalog` options, you have to specify different `loaderPath` options unless the computed default loader path is different (e.g. `loader.js` for Vanilla vs `loader.svelte.js` for Svelte).

## Example

Let's say you have a complicated SvelteKit application and want to have four adapters:

1. `single`: for the home route *and* a sub route where there will be a form
1. `granularLoad`: for a sub route where you have lots of text per file and you want to avoid having to download the whole catalog for the sub route and instead only for the page, dividing the compiled catalogs, and loading them in an async way you set up, but also have some of the files share a compiled catalog
1. `granularLoadBundle`: For a sub route where you want to divide the compiled catalogs per file but just bundle all catalogs for each file with the file to avoid separate network calls
1. `server`: For the backend code which will run outside of Vite and so will not have access to virtual modules, and has to import from the file system, so the compiled catalogs and proxy should be written to disk.

And as an additional requirement, you want to make the `single` and `server`
adapters share the same catalogs.

Then the configuration will look like this:

```js
// wuchale.config.js
// @ts-check
import { defineConfig, defaultGenerateLoadID } from "wuchale"
import { adapter as svelte } from '@wuchale/svelte'
import { adapter as vanilla } from "wuchale/adapter-vanilla"

export default defineConfig({
    otherLocales: ['es'],
    adapters: {
        // Applies over the components inside the single route as well as the top level route.
        // Uses a single compiled catalog per locale, downloaded once.
        single: svelte({
            files: [
                './src/routes/[locale]/{single,server}/**/*.svelte',
                './src/routes/[locale]/single/**/*.svelte.{js,ts}',
                './src/routes/[locale]/*.svelte',
                './src/routes/[locale]/*.svelte.{js,ts}'
            ],
        }),
        // Applies over the granular route.
        // Uses one compiled catalog per locale per each file/component
        //   unless they contain /group/ in which case they will share one compiled catalog.
        // Which one to download is decided at runtime
        granularLoad: svelte({
            files: './src/routes/[locale]/granular/**/*',
            localesDir: './src/locales/granular',
            granularLoad: true,
            generateLoadID: filename => {
                if (filename.includes('grouped')) {
                    return 'grouped'
                }
                return defaultGenerateLoadID(filename)
            },
        }),
        // Applies over the granular-bundle route.
        // Each file directly imports all locale variants of its own catalog,
        //   even though only one will be selected at runtime.
        // It only takes the locale identifier string from the loader at runtime.
        // This mimicks how ParaglideJS downloads catalogs but is not recommended.
        granularLoadBundle: svelte({
            files: './src/routes/[locale]/granular-bundle/**/*',
            localesDir: './src/locales/granular-bundle',
            granularLoad: true,
            bundleLoad: true,
        }),
        // Used for messages that are sent from the server instead of being rendered client-side.
        // Uses one compiled catalog because bundle size optimizations are irrelevant on the server.
        // It is necessary to write the loader proxy and the compiled catalogs to disk
        //   because node.js doesn't support virtual modules.
        // Also since node.js is not a reactive environment, we have to initialize the runtime inside functions.
        server: vanilla({
            files: './src/**/*.server.{js,ts}',
        }),
    },
})
```

:::tip
This is the exact configuration for the [`sveltekit-advanced`](https://github.com/wuchalejs/examples/tree/main/sveltekit-advanced) example.
:::

:::tip
The transformed modules will use the keys and `loadID`s to get the compiled
catalogs from the loader files. That means either the adapter key or the
`loadID` will be in each file. If you want to squeeze the bundle size to the
minimum, you can use one or two letter keys and `loadID`s for them (instead of
`main`, `granularLoad` or `granularLoadBundle` you could use `a`, `b`, `c`) if
readability is not really a concern.
:::
