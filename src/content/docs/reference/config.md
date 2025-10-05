---
title: Configuration Reference
description: Configure wuchale with wuchale.config.js - set source and target locales, choose adapters, enable HMR, and integrate Gemini live translation for efficient i18n workflows.
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
    sourceLocale: 'en', // default
    otherLocales: ['es', 'fr'],
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

### `sourceLocale`

**type**: `string`
**default**: `en`

The key of the source languages from the `locales` config. This is the language
you use in the source code and will not need to be translated. In most cases
this will be English.

### `otherLocales`

**type**: `string[]`

The locales to translate to. They must be valid [BCP 47
tags](https://en.wikipedia.org/wiki/IETF_language_tag). For example, `en`,
`en-US`, `eng`, `zh-Hans` are valid, but `en_US`, `cn-simplified` are invalid.
The validation is done using
[`Intl.DisplayNames`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames#language_display_names).

### `adapters`

**type**: `Record<string, Adapter>`
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

### `ai`
**type**: `AI`
**default**: `gemini()`

```ts
type AI = {
    name: string
    batchSize: number
    translate: (messages: string, instruction: string) => Promise<string>
    parallel: number
}
```

Here you can give your own AI interface for live translation. The `batchSize`
decides the maximum messages to translate in a single request, over which
another request will be used. And `parallel` decides the number of requests to
make in parallel.

The `translate` function receives the messages in a stringified PO format with
empty places for the translated messages, along with the instruction that
explains what to do like from which language to which language, the expected
format, etc. And the expected format is the same PO format, but with filled
translations, just like a human translator.

The default is `gemini()` which you can import and provide options to customize
like `ai: gemini({...})`. The options should conform to the following type:

```ts
type GeminiOpts = {
    apiKey?: string
    batchSize?: number
    think?: boolean
    parallel?: number
}
```

You can provide your API key here in `apiKey` directly, or use the special
value `env` (default) to use the `GEMINI_API_KEY` environment variable. If the
environment variable is not set, Gemini will not be used, as if it was
disabled. It can also be always disabled by setting this to `null`, in which
case the environment variable will not be used even if it is set.

### `logLevel`

**type**: `'error' | 'warn' | 'info' | 'verbose'`
**default**: `info`

You can set the log level above which messages will be shown in the console. If
you set it to `verbose`, all messages will be shown. `verbose` enables showing
all extracted messages.
