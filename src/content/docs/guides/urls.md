---
title: Internationalizing URLs
description: Internationalize URL paths with minimal code changes. Translate patterns like /about to /acerca-de, localize with prefixes or custom logic, and let wuchale handle link rewriting and routing automatically at build time.
---

Internationalizing URL paths is possible with the same conveniences of
no/minimal code changes, while respecting the fact that URLs are to be handled
carefully.

There are two parts to this:

- **Translation**: e.g. `/about` to `/acerca-de`
- **Localization**: e.g. `/about` to `/en/about`

And both are supported and you can combine them into: `/es/acerca-de`.

You first specify the patterns that should be internationalized in the config. Since wuchale
uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for the actual handling
of the patterns, you can use any syntax supported by it.

```js
// wuchale.config.js
export default {
    locales: ['en', 'es'],
    adapters: {
        main: svelte({
            loader: 'sveltekit',
            url: {
                patterns: [
                    '/about',
                    '/items{/*rest}',
                    '/',
                    '/*rest',
                ],
                // you can also pass a filename that supports a localize function
                localize: true,
            },
        }),
    }
    // ...
}
```

The paths that don't match these patterns are ignored, so you can choose which ones you want to internationalize.

Now, what happens next is two things.

## Pattern translation and manifest

The first is that the patterns themselves are put inside the same PO files so
that they are translated by the translator. This makes it consistent that all
translation can be handled by the translator. But URLs patterns should be
handled carefully. Therefore, by default, the `pofile` handler puts them in a
separate `*.url.po` file, like this:

```po
# es.po
#: main
#, url:main,url:js
msgctxt "original: /items{/*rest}"
msgid "/items{0}"
msgstr "/elementos{0}"
```

- It sets the `url:{adapterKey}` flags to convey that they are used as URL patterns by these adapters
- To prevent accidental translation of parameters which could cause problems when they are used, it converts them into its own placeholder notation
- But it puts the original pattern in the context above it to
    - give more context to the translator and
    - distinguish between patterns that would become the same after the params are converted into `{0}`

Then, after the translation, it generates a URL manifest file and a
corresponding file, `urls.js` in the locales directory, which exports a
function to match URLs during routing.

## Routing

During routing, wuchale has to reverse the two parts (translation and
localization) to get the original path and route it correctly. And the created
manifests and `urls.js` files are handy for this. For example, to use the
matching from the above config in SvelteKit's `hooks.js`:

```js
// hooks.js

import { matchUrl } from './locales/single.url.js'
import { deLocalizeDefault } from 'wuchale/url'
import { locales } from './locales/data.js'

/** @type {import('@sveltejs/kit').Reroute} */
export const reroute = ({url}) => {
    // get /acerca-de and es from /es/acerca-de
    const [upath, locale] = deLocalizeDefault(url.pathname, locales)
    // get /about from /acerca-de
    const {path} = matchUrl(upath, locale)
    // return the original in case no pattern matches
    return path ?? url.pathname
}
```

:::note
The matching is done in the same order specified in the config, wuchale doesn't
do any specificity checks. Therefore, put the catch-all patterns last.
:::

## Link handling

The other part is this, when it gets a text fragment that is probably a link,
it translates it from the pattern translation so that the it is translated
exactly the same way as the routing and prevent 404s.

Let's take the following example:

```svelte
<a href="/items/foo/{itemId}">Item</a>
```

It checks if it matches any of the patterns, in this case this matches `items{/*rest}`. It then:

- Gets the translated pattern, `/elementos{/*rest}`
- Replaces the parameter to make it like any other message, `/elementos/foo/{0}`
- Compiles and includes it in the compiled catalog
- Transforms the code to use the compiled value, and wraps it with the configured `localize` function

All of this is done once, during build time. After after that, the URLs are
just like other strings, static or interpolated, just included in one big
array.

## Localization

The localization part is project-dependent. Since the most common way is to prefix the locale in front of the path like `/en/about`, wuchale automatically does that when you set `localize: true` in the URL config. But that may not be enough, for example if:

- The site uses different domain names for different locales, and/or
- Whether a locale needs to be prefixed is dependent on the domain if the app targets multiple domains

Especially in the second case, for example let's say we have an `/about` page with `example.com` and `example.es` as targets. And we want to have both `en` and `es` locales on both, but we don't want unnecessary locale prefixes so we want:

- `example.com/about`
- `example.es/acerca-de`
- `example.com/es/acerca-de`
- `example.es/en/about`

Cases like this cannot be fulfilled with simple prefixing. In that case, you
can implement both the **localization** and **de-localization**. For the former, you
can export your own `localize` function that conforms to this type:

```ts
type URLLocalizer = (path: string, locale: string) => string;
```

And provide the file to the config:

```js
// wuchale.config.js
export default {
    // ...
    adapters: {
        main: svelte({
            // ...
            url: {
                patterns: [
                    // ...
                ],
                localize: 'src/lib/url.js',
            },
        }),
    }
    // ...
}
```

So it would roughly be like

```js
// src/lib/url.js
export function localize(path, locale) {
    const host = (new URL(location.href)).host
    if (host === 'example.com' && locale === 'en' || host === 'example.es' && locale === 'es') {
        return path
    }
    return `/${locale}/${path}`
}
```

As for the **de-localization**, since you handle that at the routing level, and
wuchale just provided with a util for the default, you don't configure
anything. You just apply a matching implementation at the right place (e.g.
SvelteKit `hooks.js`):

```js
import { matchUrl } from './locales/single.url.js'
import { deLocalize } from './lib/url.js' // just an example
import { locales } from './locales/data.js'

/** @type {import('@sveltejs/kit').Reroute} */
export const reroute = ({url}) => {
    const [upath, locale] = deLocalize(url.pathname, locales)
    const {path} = matchUrl(upath, locale)
    return path ?? url.pathname
}
```

The implementation of `deLocalize` is left as an exercise.
