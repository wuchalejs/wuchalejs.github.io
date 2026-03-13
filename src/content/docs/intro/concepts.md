---
title: Concepts
description: Understand wuchale concepts - Adapters, Catalogs, Loaders and Proxies
---

## Adapters

`wuchale` is designed to work in different codebases which may use different
syntax. For example, a project that uses plain JavaScript/TypeScript is
different from one that uses Svelte. For this reason, the tasks that are
specific to the project type are offloaded to adapters and the core acts as the
orchestrator and handles the CLI.

Specifying multiple adapters is possible to support these use cases:

- To partition the catalog into smaller catalogs. Particularly useful in big
  applications which may have a *lot* of messages.
- To use different rules for different parts of the project. For example, to
  ignore certain message patterns in half of the application using a different
  heuristic pattern.
- To use different adapters for different parts of the project. This is
  especially necessary for fullstack projects where JavaScript/TypeScript are
  used for the backend and a frontend library is used for the interface. These
  need different adapters.

The main things adapters have to handle is the following:

- How to transform the code to use the runtime
- The heuristic function
- Files to extract from
- The location of the extracted catalogs
- Whether to write to disk and where

## Loaders and Proxies

When you run `npx wuchale` or initialize Vite with the plugin configured, a
loader file is created along with the initial catalogs. Loader files are where
you can specify how you integrate the catalogs into your app. They are created
and maintained automatically, and if you want to "take the wheel" instead and
edit them with your own logic, you can set the
[`loader`](/reference/adapter-common#loader) option to `custom` and they will
not be overwritten.

The loader file is where all the transformed code (under the adapter) will
import the current catalog from. As such it controls all of those files. It
also has access to the catalog proxies that can provide the extracted catalogs
for that adapter, as well as the IDs of the catalogs that will be requested by
the transformed code.

The proxies are small modules that export functions that take locale
identifiers and return compiled catalogs. They are two per adapter (one for
sync, another for async). The loader can choose which proxy to import from and
use the function to do the actual loading or export it to pass it to
application code.

After the initial default creation, it is under your control and you can load
the catalogs however you please. All the loader has to do is export a default
function that takes a load ID and returns the catalog for that ID.

As for the actual loading, the application code somewhere you decide has to
initiate the loading and this depends on the codebase. For SvelteKit for
example, if we want SSR, it has to be in the load function of the layout (or
the page.) For normal Svelte, it has to be at the main component using
something like an await block or an `$effect`. All of this should be decided by
you.

## Catalogs

A catalog is a structured collection of the extracted messages. First, as soon
as the messages are extracted, they are put in the configured
[storage](/reference/adapter-common#storage) (by default `.po` files). And for
use within the application after translation, they are compiled into compiled
catalogs.

### `.po` files

This is the default catalog storage format of the messages. It contains some
headers with some metadata and the plural rule for the language, the
untranslated messages as message IDs and the translations. There is one catalog
storage file per locale. A simple example of the contents, before translation
is this:

```po
# es.po
# ...other headers
"Plural-Forms: nplurals=2; plural=n == 1 ? 0 : 1;\n"

#: src/path/to/source1.svelte
msgid "Hello world!"
msgstr ""

#: src/path/to/source2.svelte
msgid "Welcome"
msgstr ""
```

Then it is edited by the translator (or [AI](/guides/ai)) to also have
the translation like this:

```po
# es.po
# ...other headers
"Plural-Forms: nplurals=2; plural=n == 1 ? 0 : 1;\n"

#: src/path/to/source1.svelte
msgid "Hello world!"
msgstr "¡Hola Mundo!"

#: src/path/to/source2.svelte
msgid "Welcome"
msgstr "Bienvenido"
```

But this is not what is loaded by the application, it is only for storage and
exchange with translators. To be used in the application, it gets compiled into:

### Compiled catalogs

Compiled catalogs are JavaScript modules that contain only the necessary
information, written to the `{localesDir}/.wuchale/` directory. The above
example catalog, after compilation becomes:

```js
// es.compiled.main.js
export const c = ["¡Hola Mundo!", "Bienvenido"]
export const p = n => n == 1 ? 0 : 1
```

That's all. No keys, no unnecessary data. During development there is HMR
related code added but not for production.

Depending on the configuration, there can be one compiled catalog per locale,
or more. If [`granularLoad`](/reference/adapter-common/#granularload) is
enabled, for example, the above single catalog will become two compiled
catalogs per the source file (`source1.svelte` and `source2.svelte`)

```js
// es.compiled.src_path_to_source1_svelte.js
export const c = ["¡Hola Mundo!"]
export const p = n => n == 1 ? 0 : 1
```

```js
// es.compiled.src_path_to_source2_svelte.js
export const c = ["Bienvenido"]
export const p = n => n == 1 ? 0 : 1
```

This may be desired to reduce the bundle size when each page hash a huge number
of messages.

### `loadID`

When using the default configuration, there is only one compiled catalog per
locale for one adapter. But when using `granularLoad`, then the compiled
catalog is broken into smaller parts. This necesitates a way to refer to those
different parts when loading them. This identifier is called a `loadID`.

When not using `granularLoad` there is only one `loadID` and it is the same as
the adapter key. (E.g. `main`).

But when using `granularLoad`, a `loadID` is generated from each file name,
using the [`generateLoadID`](/reference/adapter-common/#generateloadid)
function. That function can return unique identifiers to have separate compiled
catalogs per file, or it can selectively return the same identifiers for
multiple file names to make them share the same compiled catalogs.
