---
title: Svelte
---

## Setup in Your App

Svelte applications may or may not use SvelteKit and that makes the loading of
the compiled catalogs a bit different. The Svelte adapter tries to detect
whether SvelteKit is in use and write the suitable default loader. Assuming it
was correct, follow the following steps. If it was wrong, edit the loader file
first.

### For SvelteKit (SSR/SSG)

```javascript
// src/routes/+layout.js
import { locales } from 'virtual:wuchale/locales'
import { loadCatalogs } from 'wuchale/run-client'
import { loadIDs, loadCatalog } from '../locales/loader.svelte.js'

export const prerender = true

/** @type {import('./$types').LayoutLoad} */
export async function load({url}) {
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

### For Svelte (SPA)

```svelte
<!-- src/App.svelte -->
<script>
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

## Default extraction rules

In addition to the [default rules](/guides/rules), this adapter implements
additional restrictions.

### In `script` (`<script>` and `.svelte.js/ts`)

- If it doesn't pass the base heuristic from the Vanilla adapter, it is ignored.
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

## Configuration Reference

For the main configuration, look in the [configuration reference](/reference/config).

For the common adapter configuration, look in the [common adapter options](/reference/adapter-common/).

### `bundleLoad`
**type**: `boolean`
**default**: `false`

In some cases, avoiding async loading and directly importing the
catalogs by the code that uses them may be desired. This is how Paraglide
works. However, it is not recommended as all catalogs then get bundled with
the code that uses them even though only one is required by the user. This
can inflate the bundle side. But if this is desired anyway, it can be
enabled here.
