---
title: Common adapter options
description: Explore wuchale's common adapter options - configure locales directory, file extraction patterns, function call patterns, heuristics, and granular loading strategies for efficient internationalization.
---

These are the configuration options that are common across adapters. The
adapter-specific options are discussed in the adapter's page.

These are the properties of the object when you specify adapters to the main configuration.

Example:
```javascript
// ...
main: svelte({
    localesDir: './src/locales',
}),
// ...
```

## `loader`

**type**: `{adapterLoaders} | "custom"`
**default**: (depends on the adapter)

This option controls sets the loader to import the runtime from (by the
transformed files).

It can be one of the supported loader names by the adapter,
in which case the corresponding loader will be generated at startup. For
example, for the Svelte adapter, the `svelte` loader can be used which exports
a reactive way to get the runtimes.

Or it can be `custom` if taking control of the loader file is desired. If using
this, the loader files will not be overwritten. When using this, you can use
the loader file naming convention (client and server):

```
{localesDir}/{adapterKey}.loader.{ext}
{localesDir}/{adapterKey}.loader.server.{ext}
```

Where
- `localesDir` is... (see below)
- `adapterKey` is the key you used for the adapter config in `wuchale.config.js`, e.g. `main`
- `ext` is one of the supported loader extensions by the adapter (see in the beginning of its page).

## `localesDir`

**type**: `string`
**default**: `./src/locales`

The `localesDir` is a place where the PO files and other runtime files like
loaders and proxies are created.

## `files`
**type**: `GlobConf`
**default**: (depends on adapter)

The files to extract from. Only these files will be extracted from. Other files are ignored.

```typescript
type GlobConf = string | string[] | {
    include: string | string[]
    ignore: string | string[]
}
```

## `patterns`

**type**: `CodePattern[]`
**default**: `[{
    name: 'plural',
    args: ['other', 'message', 'pluralFunc'],
}]`

```ts
type CodePattern = {
    name: string
    args: ('message' | 'pluralFunc' | 'other')[]
}
```

This specifies the function call patterns that you define to handle [plurals and l10n](/guides/plurals-l10n).

The `name` is the name of the function.

The `args` array specifies the function argument sequences and each element can be one of the three:
- `message`: Extractable message string. Can be:
    - A string for use with l10n libraries like IntlMessageFormat.
    - An array of strings when using it for PO plurals.
- `pluralFunc`: The function derived from the PO header used to decide the index inside the candidate strings array.
- `other`: Other arguments

The default value is to support PO style pluralization.

## `heuristic`

**type**: `(msg: Message) => boolean | null | undefined`
**default**: (depends on adapter)

This is a function that decides whether a message is to be extracted or not. It
can use the message and its details and return a boolean value to indicate its
decision.

If it returns `null` or `undefined`, the default heuristic will be used.

```ts
type Message = {
    msgStr: string[] // the text of the message, just one element for normal messages
    context?: string // the context of the message, if given
    details: {
        scope: "script" | "markup" | "attribute" // what type of scope the message comes from
        element?: string // the element where the message comes from
        attribute?: string // the name of the attribute for which the message is a value
        file: string // the relative path of the file from the root
        declaring?: "variable" | "function" | "class" | "expression" // the type of the top level declaration
        funcName?: string | null // the name of the function being defined, '' for arrow or null for global
        topLevelCall?: string // the name of the call at the top level
        call?: string // the name of the nearest call (for arguments)
    }
}
```

#### `file`
**type**: `string`

The file path where the message is located, relative to the root directory.

#### `declaring`
**type**: `"variable" | "function" | "expression"`

The type of the top level declaration (if in `script`).

#### `insideFuncDef`
**type**: `boolean`

Whether the message is inside a function definition. Can also be an arrow function.

#### `topLevelCall`
**type**: `string`

The name of the call at the top level. For example,

```js
const a = topLevel({
    bar: non.topLevel('Hello'),
})
```
The value of `topLevelCall` would be `topLevel`

#### `call`
**type**: `string`

The name of the nearest call. In the above example, this would be `non.topLevel`.

## `granularLoad`
**type**: `boolean`
**default**: `false`

Whether to split the compiled catalog into smaller parts. By default it splits
them into parts for each file, so that each file has its own compiled catalog.

## `generateLoadID`
**type**: `(filename: string) => string`
**default**: `defaultGenerateLoadID`

This applies only when `granularLoad` is enabled. It should generate IDs for
the individual parts of the compiled catalog. The IDs should be valid
keywords,they can only contain alphanumeric characters and `_`.

If the same IDs are returned for multiple files, the resulting compiled catalog
will be shared by the files. This can be used to combine and share the same
compiled catalog between files with a small number of messages to reduce the
number of requests.

The default generator converts the file paths into compatible IDs by replacing
every special character by `_`.

## `bundleLoad`
**type**: `boolean`
**default**: `false`

In some cases, avoiding async loading and directly importing the catalogs by
the code that uses them may be desired. This is how Paraglide works. However,
it is not recommended as all catalogs then get bundled with the code that uses
them even though only one for a single locale is required by the user. This can
inflate the bundle size. But if this is desired anyway, it can be enabled here.

## `outDir`
**type**: `string`
**default**: `{localesDir}/.output`

Where to write the transformed code. A mirror structure is created in this
directory and the transformed code is put there.

## `runtime.useReactive`
**type**:
```ts
type UseReactiveFunc = (details: {funcName?: string, nested: boolean, file: string, additional: object}) => {
    /** null to disable initializing */
    init: boolean | null
    use: boolean
}
```
**default**: Depends on adapter

This function can decide which function from the loader should be used in a
given context and if the runtime should be initialized there. For example, for
React, inside hooks and components, we can initialize and use the runtime from
the reactive loader function. But in other functions, we have to use the
non-reactive loader function. And we cannot initialize the runtime inside the
top level because it cannot be updated afterwards. But for SolidJS, we can
initialize the runtime once in the top level and use it anywhere. This function
makes those decisions.

## `runtime.reactive.importName`
**type**: `"default" | string`
**default**: `default`

The name of the reactive function to import from the loader file.

## `runtime.reactive.wrapInit`
**type**: `(expr: string) => string`
**default**: Depends on adapter

For the reactive runtime initialization, we can wrap the initialization
expression of the runtime to customize it to the behaviour of the library. For
example, for Svelte, the default is wrapping it inside `$derived` and for
SolidJS, making it a function, pairing it with `wrapUse` below.

## `runtime.reactive.wrapUse`
**type**: `(expr: string) => string`
**default**: Depends on adapter

For the reactive runtime initialization, we can wrap the referencing expression
of the runtime to customize it to the behaviour of the library. For example,
for Svelte, no wrapping is needed while for SolidJS, since it's a function, it
has to be called so it needs `()` before use.

## `runtime.plain.importName`
**default**: `get`

Like [`runtime.reactive.importName`](#runtimereactiveimportname) but for the non-reactive function.

## `runtime.plain.wrapInit`

Like [`runtime.reactive.wrapInit`](#runtimereactivewrapinit) but for the non-reactive runtime.

## `runtime.plain.wrapUse`

Like [`runtime.reactive.wrapUse`](#runtimereactivewrapuse) but for the non-reactive runtime.
