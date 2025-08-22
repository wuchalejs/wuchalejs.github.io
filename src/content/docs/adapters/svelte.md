---
title: Svelte
---

Import | `import { adapter } from "@wuchale/svelte"`
-|-
Loader extensions | `.js`, `.ts`, `.svelte.js`, `.svelte.ts`
Default `files` | `src/**/*.svelte`, `src/**/*.svelte.{js,ts}`
Compatibility | Svelte >= 5

## Setup in Your App

Svelte applications may or may not use SvelteKit and that makes the loading of
the compiled catalogs a bit different. The Svelte adapter tries to detect
whether SvelteKit is in use and write the suitable default loader. Assuming it
was correct, follow the following steps. If it was wrong, edit the loader file
first.

### Svelte (SPA)

You can use two approaches.

#### Showing a loader until the catalog is loaded

This is when you would like to show nothing until all catalogs are loaded and
then render after that.

```svelte
<!-- src/App.svelte -->
<script>
  import { loadLocale } from 'wuchale/load-utils'
  // so that the loaders are registered first
  import './locales/loader.svelte.js'
  // you can use any state from anywhere for the locale
  let locale = $state('en')
</script>

{#await loadLocale(locale)}
    <!-- Ignored because it is rendered before the catalog is loaded -->
    <!-- @wc-ignore -->
    Loading translations...
{:then}
    <!-- Your app content -->
{/await}
```

It has the advantage that the interface has a clearly visible succession of
states. The disadvantage is that if you have lazy loaded components, they only
start loading after the catalog has finished loading, not in parallel. The
catalogs are compact so this may not be a problem in most cases.

#### Placeholder text until catalogs load

This is when you just want to render some placeholder text (or nothing at all)
in place of the messages, and once the catalog is loaded, update the texts.

```svelte
<!-- src/App.svelte -->
<script>
  import { loadLocale } from 'wuchale/load-utils'
  // so that the loaders are registered first
  import './locales/loader.svelte.js'
  // you can use any state from anywhere for the locale
  let locale = $state('en')
  $effect(() => {
      loadLocale(locale)
  })
</script>

<!-- Your app content -->
```

The advantage is that your other network calls don't have to wait until the
catalogs are loaded. And until the catalogs are loaded,
[placeholders](/guides/placeholders) are shown instead, which are replaced once
the catalog loads.

### SvelteKit (SSR/SSG)

If you use SvelteKit for just a client only app, you can use the above setup
for Svelte. This is for when you need SSR.

The SvelteKit setup has two layers (server and client) and the loader file has
to account for both. The default loader can be seen as an example.

#### SSR

When rendering on the server, the above setup for Svelte can't work because it
uses a global state and using global states on the server is a bad idea, as it
can leak information (in our case the current locale) between requests, because
requests share the global state. To deal with this, a separate utility is
provided that can isolate the locale state per request. You can set it up
inside `hooks.server.{js,ts}`.

```js
// hooks.server.js
import { loadCatalog, loadIDs, key } from './locales/loader.svelte.js'
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server'
import { locales } from 'virtual:wuchale/locales'

// load at server startup
await loadLocales(key, loadIDs, loadCatalog, locales)

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
    const locale = event.url.searchParams.get('locale') ?? 'en'
    return await runWithLocale(locale, () => resolve(event))
}
```

Now, `loadLocales` loads all catalogs at the server startup and makes them
ready. Then, for each request, `runWithLocale` makes sure that the requests are
isolated and able to access their own catalogs based on the `locale` from the
URL.

:::note
You can use any [state store](/guides/state) for your locale.
:::

#### Client

Once the page is rendered on the server with the correct locale, the client has
to load the catalogs also making sure that the messages don't change or flicker
once it takes over. The best place to load the catalogs then is the `load`
function in the top most `+layout.{js,ts}` file. But it should only run once
it's in the browser (the server is already handled).

```javascript
// src/routes/+layout.js
import { locales } from 'virtual:wuchale/locales'
import { browser } from '$app/environment'
import { loadLocale } from 'wuchale/load-utils'
// so that the loaders are registered
import '../locales/loader.svelte.js'

/** @type {import('./$types').LayoutLoad} */
export const load: LayoutLoad = async ({url}) => {
    const locale = url.searchParams.get('locale') ?? 'en'
    if (!locales.includes(locale)) {
        return
    }
    if (browser) {
        await loadLocale(locale)
    }
}
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

## `<script module>`s and `.svelte.{js,ts}` files

Unlike component code, code inside these places only runs once. If you are only
developing client only apps, this doesn't make much difference.

But if you do SSR, you have to make sure that all translatable text is inside
function definitions and adjust your usage accordingly:

```js
function foo() {
    const msg = 'Here'
}
```

Because with SSR, startup means server startup, and so if you just use
`$derived` in these places, they will be stuck with the locale of the first
request and subsequent requests with different locales may see a flicker until
the client takes over. But if you put them inside function definitions, the
function gets executed per request and will not have this problem.

## Configuration Reference

For the main configuration, look in the [configuration reference](/reference/config).

For the common adapter configuration, look in the [common adapter options](/reference/adapter-common/).

This adapter doesn't have additional configuration options.
