---
title: Configuration Reference
---

## Main configuration

`wuchale` can be configured using `wuchale.config.js` at the root of your
project. TypeScript or other formats for configuration are not supported. An
example configuration looks like:

```javascript
// wuchale.config.js
// @ts-check
import { defineConfig } from "wuchale"
import { adapter as svelte } from "@wuchale/svelte"

export default defineConfig({
    locales: {
        // English included by default
        es: { name: 'Spanish' },
        fr: { name: 'French' }
    },
    adapters: {
        main: svelte({
            catalog: './src/locales/{locale}',
        }),
    }
})
```

The above configuration shows how to configure `wuchale` with the Svelte
adapter. The adapter accepts a configuration object as an argument. The
configuration for each adapter is discussed in the adapter's documentation. The
main configuration is discussed here.

### `locales`

**type**: `{[locale: string]:`[`LocaleConf`](#localeconf)`}`

This must be a mapping from a locale key to a configuration object (see below).
The key must be a valid keyword. Therefore it can only contain alphanumeric
characters and `_`. For example, `en`, `en_US`, `eng` are valid, but `en-US` is
invalid.

#### `LocaleConf`

Properties:

- **`name`** (`string`, required): The name of the language. It can be written
    in the language itself, like `Español`. This is useful if you don't want to
    repeat yourself and would like to display the name in the UI by importing it,
    for language selectors for example.

- **`nPlurals`** (`number`): The number of plurals in the language. Most
    languages have only two (one and many) but some have more.

- **`plural`** (`string`): The plural rule of the language, represented as an
    expression with the variable `n` that selects the suitable message from the
    available candidates in an array by returning its zero-based index. The
    candidates will come from the translation catalogs as an array. For most
    languages, the default rule: `n == 1 ? 0 : 1` is used. But for languages that
    need it, a different more complex expression can be defined. **Note** that this
    has to be a string expression with `n` as the variable. It will later be the
    body of an arrow function.

Example:

```javascript
{
    name: 'English',
    nPlurals: 2,
    plural: 'n == 1 ? 0 : 1',
}
```

### `sourceLocale`

**type**: `string`
**default**: `en`

The key of the source languages from the `locales` config. This is the language
you use in the source code and will not need to be translated. In most cases
this will be English.

### `adapters`

**type**: `{[key: string]: Adapter}`
**default**: `{}`

Adapters are what handle the project specific operations like extracting the
messages from the code and transforming it. They have to be provided with their
own keys. The keys are how you can separate different parts of the project into
smaller pieces and refer to them. The key also has to be a valid keyword like
locale keys.

### `hmr`

**type**: `boolean`
**default**: `true`

Enable HMR updates during development. You can disable this to avoid the small
overhead of live translation updates and work solely with the source language.
HMR is highly optimized: it updates only the affected components, preserving
application state and avoiding full reloads.

### `geminiAPIKey`

**type**: `string`
**default**: `env`

If you want to use Gemini live translation, you can provide your API key here
directly, or use the special value `env` to use the GEMINI_API_KEY environment
variable. If the environment variable is not set, Gemini will not be used, as
if it was disabled. It can also be always disabled by setting this to `null`,
in which case the environment variable will not be used even if it is set.

### `messages`

**type**: `string`
**default**: `true`

If you find `wuchale` to be too chatty, you can silence it by setting this to `false`.
