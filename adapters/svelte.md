---
title: Svelte
parent: Adapters
---

# 1. 🚀 Installation

Please follow the installation guide. It uses svelte as an example.

# 2. Setup in Your App

Svelte applications may or may not use SvelteKit and that makes the loading of
the compiled catalogs a bit different. `wuchale` tries to detect whether
SvelteKit is in use and write the suitable default loader. Assuming it was
correct, follow the following steps. If it was wrong, edit the loader file
first.

## For SvelteKit (SSR/SSG)

```typescript
// src/routes/+layout.js
import type { LayoutLoad } from './$types'
import { locales } from 'virtual:wuchale/locales'
import { loadCatalogs } from 'wuchale/run-client'
import { loadIDs, loadCatalog } from '../locales/loader.svelte.js'

export const prerender = true

export const load: LayoutLoad = async ({url}) => {
    const locale = url.searchParams.get('locale') ?? 'en'
    if (!(locale in locales)) {
        return
    }
    return {
        locale,
        catalogs: await loadCatalogs(locale, loadIDs, loadCatalog)
    }
}
```

## For Svelte (SPA)

```html
<!-- src/App.svelte -->
<script lang="ts">
  import { loadLocale } from 'wuchale/run-client'
  import Counter from './lib/Counter.svelte'

  let locale = $state('en')
</script>

{#await loadLocale(locale)}
    <!-- @wc-ignore -->
    Loading translations...
{:then}
    <!-- Your app content -->
{/await}
```

# 🧠 Behavior Explanation (Svelte adapter)

## What Gets Extracted?

This is decided by the heuristic function which you can customize. A sensible
default heuristic function is provided out of the box. Here's how it works:

### General rule (applies everywhere):
- If the text contains no letters used in any natural language (e.g., just numbers or symbols), it is ignored.

### In `markup` (`<p>Text</p>`):
- All textual content is extracted.

Examples:

```html
<p>This is extracted</p>
<!-- @wc-ignore -->
<p>This is not extracted</p>
```

### In `attribute` (`<div title="Info">`):
- If the first character is a lowercase English letter (`[a-z]`), it is ignored.
- If the element is a `<path>`, it is ignored (e.g., for SVG `d="M10 10..."` attributes).
- Otherwise, it is extracted.

Examples:

```html
<img alt="Profile Picture" class="not-extracted" />
```

### In `script` (`<script>` and `.svelte.js/ts`):

`script` is handled by the ES adapter of the core package with some additional restrictions.
- If it doesn't pass the base heuristic from the ES adapter, it is ignored.
- If it's not inside `$derived` or `$derived.by`, it is ignored.
- If the value is inside `$inspect()` calls, it is ignored.
- Otherwise, it is extracted.

Examples:

```javascript
// In $derived or functions
const message = $derived('This is extracted')
const lowercase = $derived('not extracted')

// Force extraction with comment
const forced = $derived(/* @wc-include */ 'force extracted')
```
```html
<p title={'Extracted'}>{/* @wc-ignore */ 'Ignore this'}</p>
```

If you need more control, you can supply your own heuristic function in the
configuration. Custom heuristics can return `undefined` or `null` to fall back
to the default. For convenience, the default heuristic is exported by the
package.

> 💡 You can override extraction with comment directives:
> - `@wc-ignore` — skips extraction
> - `@wc-include` — forces extraction  
> These always take precedence.

# 🛠️ Configuration Reference

For the main plugin configuration, look in [Usage](/usage).

```javascript

import { adapter as svelte } from "@wuchale/svelte"

const svelteAdapter = {
    // Where to store translation files. {locale} will be replaced with the respective locale.
    catalog: './src/locales/{locale}',
    
    // Files to scan for translations
    // You can technically specify non svelte js/ts files, but they would not be reactive
    files: ['src/**/*.svelte', 'src/**/*.svelte.{js,ts}'],
    
    // Custom extraction logic
    // signature should be: (text: string, details: object) => boolean | undefined
    // details has the following properties:
        // scope: "markup" | "attribute" | "script",
        // declaring?: "variable" | "function" | "expression",
        // insideFuncDef?: boolean,
        // topLevelCall?: string,
        // call?: string,
        // element?: string,
        // attribute?: string,
        // file?: string,
    heuristic: defaultHeuristic,
    
    // Whether to split the compiled catalogs into even smaller files
    granularLoad: false,

    // In some cases, avoiding async loading and directly importing the
    // catalogs by the code that uses them may be desired. This is how Paraglide
    // works. However, it is not recommended as all catalogs then get bundled with
    // the code that uses them even though only one is required by the user. This
    // can inflate the bundle side. But if this is desired anyway, it can be
    // enabled here.
    bundleLoad: false

    // When using granularLoad, generate a load ID for each file. The ID should
    // be like a keyword, only [a-zA-Z0-9_] are allowed. You can return the same
    // ID to group compiled catalogs to prevent too much splitting
    generateLoadID: defaultGenerateLoadID,

    // Write content that would be virtual to disk
    writeFiles: {
        // the compiled catalogs
        compiled: false,
        // the catalogs proxy
        proxy: false,
        // the transformed code
        transformed: false,
        // Output directory for the transformed code.
        outDir: 'src/locales/.output'
    },

    // Your plural function name
    pluralFunc: 'plural',
}
```
