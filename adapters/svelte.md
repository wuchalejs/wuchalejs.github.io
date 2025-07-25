---
title: Svelte
---

# 1. 🚀 Installation

Please follow the installation guide. It uses svelte as an example.

# 2. Setup in Your App

Svelte applications may or may not use SvelteKit and that makes the loading of the compiled catalogs a bit different.

## For SvelteKit (SSR/SSG)

```typescript
// src/routes/+layout.js
import { setCatalog } from 'wuchale/runtime.svelte.js'

export async function load({ url }) {
    const locale = url.searchParams.get('locale') ?? 'en'
    // or you can use [locale] in your dir names to get something like /en/path as params here
    setCatalog(await import(`../locales/${locale}.svelte.js`))
    return { locale }
}
```

```typescript
// src/hooks.server.js
import { initRegistry } from 'wuchale/runtime'

const runWithCatalog = await initRegistry()

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const locale = event.url.searchParams.get('locale') ?? 'en'
    const catalog = await import(`./locales/${locale}.svelte.js`)
    const response = await runWithCatalog(catalog, async () => await resolve(event))
	return response
}
```

## For Svelte (SPA)

```svelte
<!-- src/App.svelte -->
<script>
    import { setCatalog } from 'wuchale/runtime.svelte.js'
    
    let locale = $state('en')
    
    async function loadTranslations(locale) {
        setCatalog(await import(`./locales/${locale}.svelte.js`))
    }
</script>

{#await loadTranslations(locale)}
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

```svelte
<p>This is extracted</p>
<!-- @wc-ignore -->
<p>This is not extracted</p>
```

### In `attribute` (`<div title="Info">`):
- If the first character is a lowercase English letter (`[a-z]`), it is ignored.
- If the element is a `<path>`, it is ignored (e.g., for SVG `d="M10 10..."` attributes).
- Otherwise, it is extracted.

Examples:

```svelte
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
```svelte
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
        // topLevel?: "variable" | "function" | "expression",
        // topLevelCall?: string,
        // call?: string,
        // element?: string,
        // attribute?: string,
        // file?: string,
    heuristic: defaultHeuristic,
    
    // Your plural function name
    pluralFunc: 'plural',
}
```
