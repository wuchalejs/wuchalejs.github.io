---
title: Internationalizing URLs
order: 2
---

Internationalizing URL paths is possible with the same conveniences of
no/minimal code changes, while respecting the fact that URLs are to be handled
carefully.

There are two parts to this:

- Translation: e.g. `/about` to `/uber-uns`
- Localization: e.g. `/about` to `/en/about`

And both are supported and you can combine them into: `/de/uber-uns`.

You first specify the patterns that should be internationalized in the config. Since wuchale
uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for the actual handling
of the patterns, you can use any syntax supported by it.

```js
export default {
    // sourceLocale is en by default
    otherLocales: ['fr', 'es', 'de'],
    adapters: {
        main: svelte({
            loader: 'sveltekit',
            url: {
                patterns: ['/about', 'items{/*rest}', '/', '/*rest'],
                localize: true, // prepend locale like /en/. You can also pass a function
            },
            patterns,
        }),
    }
    // ...
}
```

The paths that don't match these patterns are ignored, so you can choose which ones you want to internationalize.

Now, what happens next is two things.

## Pattern translation and routing

The first is that the patterns themselves are put inside the same PO files so that they are translated
by the translator. This makes it consistent that all translation can be handled by the translator.
But URLs patterns should be handled carefully. Therefore it puts them like this:

```po
#: main
#, url-pattern
msgctxt "original: /items{/*rest}"
msgid "/items{0}"
msgstr "/elementos{0}"
```

- It puts the `url-pattern` flag to make them different from the rest (also uses this internally)
- To prevent accidental translation of parameters which could cause problems when they are used, it converts them into its own placeholder notation
- But it puts the original pattern in the context above it to
    - give more context to the translator and
    - distinguish between patterns that would become the same after the params being converted into `{0}`

Then, after the translation, it generates a URL manifest file and a
corresponding file, `urls.js` in the locales directory, which exports a
function to match URLs during routing.

For example, to use the matching from the above config in SvelteKit's `hooks.ts`:

```js
// hooks.ts

import {matchUrl} from './locales/main.url.js'

/** @type {import('@sveltejs/kit').Reroute} */
export const reroute = ({url}) => {
    const {path} = matchUrl(url)
    if (path == null) {
        return url.pathname
    }
    return path
}
```

:::note
The matching is done in the same order specified in the config, wuchale doesn't
do any specificity checks. Therefore, put the catch-all patterns last.
:::

## Link translation

Next, when it gets a text fragment that is probably a URL, it translates it from the pattern translation.

Let's take the following example:

```svelte
<a href="/items/foo/{itemId}">Item</a>
```

It checks if it matches any of the patterns, in this case this matches `items{/*rest}`. It then:

- Gets the translated pattern, `/elementos{/*rest}`
- Replaces the parameter to make it like any other message, `/elementos/foo/{0}`
- Compiles and includes it in the compiled catalog
- Transform the code to use the compiled value, like any other message

All of this is done once, during build time. After after that, the URLs are
just like other strings, static or interpolated, just included in one big
array.
