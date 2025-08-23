---
title: Common adapter options
---

These are the configuration options that are common across adapters. The
adapter-specific options are discussed in the adapter's page.

These are the properties of the object when you specify adapters to the main configuration.

Example:
```javascript
// ...
main: svelte({
    catalog: './src/locales/{locale}',
}),
// ...
```

## `catalog`

**type**: `string`
**default**: `./src/locales/{locale}`

The catalog is a place where the locales are created. This option value is
taken as a template to decide the file names. `{locale}` will be substituted
for each specific locale (and by `proxy` for the proxy file).

## `loaderPath`

**type**: `string`
**default**: `[catalog option]loader[loader extension]`

This option controls the location of the loader file. As each adapter specified
in the configuration should have a different loader file, you should specify
this if you share the `catalog` option among different adapters.

## `files`
**type**: [`GlobConf`](#globconf)
**default**: (depends on adapter)

The files to extract from. Only these files will be extracted from. Other files are ignored.

### `GlobConf`

```typescript
type GlobConf = string | string[] | {
    include: string | string[]
    ignore: string | string[]
}
```

## `pluralsFunc`

**type**: `string`
**default**: `plural`

This specifies the name of the function that you define to handle [plurals](/guides/plurals).

## `heuristic`

**type**: `(txt: string, details:`[`HeuristicDetails`](#heuristicdetails)`) => boolean | null | undefined`
**default**: (depends on adapter)

This is a function that decides whether a message is to be extracted or not. It
can use the message and the details and return a boolean value.

If it returns `null` or `undefined`, the default heuristic will be used.

### `HeuristicDetails`

**type**: `object` with the following properties

#### `scope`
**type**: `"markup" | "attribute" | "script"`

What type of scope the message is in.

#### `element`
**type**: `string`

The parent element's tag name, if any.

#### `attribute`
**type**: `string`

The name of the attribute for which the message is the value.

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

## `writeFiles.compiled`
**type**: `boolean`
**default**: `false`

Whether to write the compiled catalogs to disk. By default, they are virtual
modules and not written to disk to reduce file clutter and improve performance.
But enabling this is necessary in the absence of `Vite` as `Node.js` doesn't
support virtual modules.

## `writeFiles.proxy`
**type**: `boolean`
**default**: `false`

The same intention as above but for the loader [proxy](/concepts/loadersproxies/).

## `writeFiles.transformed`
**type**: `boolean`
**default**: `false`

The same intention as above but for the transformed code.

## `writeFiles.outDir`
**type**: `string`
**default**: `{catalog dir}/.output`

Where to write the transformed code. A mirror structure is created in this
directory and the transformed code is put there.
