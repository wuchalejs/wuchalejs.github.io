---
title: Catalogs
---

A catalog is a structured collection of the extracted texts. First, as soon as
the texts are extracted, they are put in the `.po` files. And for use within the
application after translation, they are compiled into compiled catalogs.

There is one `.po` file per locale.

## `.po` files

This is the primary catalog format of the texts. It contains some headers with
some metadata and the plural rule for the language, the untranslated texts as
message IDs and the translations. A simple example of the contents, before
translation is this:

```nginx
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

Then it is edited by the translator (or [Gemini](/guides/gemini)) to also have
the translation like this:

```nginx
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

## Compiled catalogs

Compiled catalogs are JavaScript modules that contain only the necessary
information. And depending on the configuration, they can be virtual modules
(default) or written to disk. The above example catalog, after compilation
becomes:

```js
// es.compiled.main.js
export const data = ["¡Hola Mundo!", "Bienvenido"]
export const plural = n => n == 1 ? 0 : 1
```

That's all. No keys, no unnecessary data. During development there is HMR
related code added but not for production.

Depending on the configuration, there can be one compiled catalog per `.po`
file, or more. If [`granularLoad`](/reference/adapter-common/#granularload) is
enabled, for example, the above single `.po` file will become two compiled
catalogs per the source file (`source1.svelte` and `source2.svelte`)

```js
// es.compiled.src_path_to_source1_svelte.js
export const data = ["¡Hola Mundo!"]
export const plural = n => n == 1 ? 0 : 1
```

```js
// es.compiled.src_path_to_source2_svelte.js
export const data = ["Bienvenido"]
export const plural = n => n == 1 ? 0 : 1
```

This may be desired to reduce the bundle size when each page hash a huge number
of texts.

## `loadID`

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
