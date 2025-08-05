---
title: Pluralization
---

Plurals are also elegantly handled when using `wuchale`. You still don't write
code just for the sake of internationalization, but for reusability. Your code
still works without `wuchale`.

## Usage

You first define your own function that selects the correct message from provided
candidates based on the number, replaces the placeholder if needed, and returns
the final message. The only requirement is that the signature has to match that of
the below example.

```javascript
// src/utils.js
export function plural(num, candidates, rule = n => n === 1 ? 0 : 1) {
    const index = rule(num)
    return candidates[index].replace('#', num)
}
```

Notice that this is still not about `wuchale`, you are just defining a
convenient reusable function with pluggable selection rules.

To be more specific, the signature has to be:

```ts
function plural(num: number, candidates: string[], rule?: (n: number) => number): string
```

Now you use your function in your codebase:

```svelte
<script>
    import {plural} from '/src/utils.js'
    let itemCount = 5
</script>

<p>{plural(itemCount, ['One item', '# items'])}</p>
```

That's it. `wuchale` has enough information to take it from there.

## How it works

The first information it takes is from your [locale
configuration](/reference/config/#localeconf) in `wuchale.config.js`. It takes
the number of plurals, `nPlurals` and prepares the translation catalogs in this
way (e.g. Spanish, after translation):

```po title="es.po" ins="Un artículo" ins="# artículos"
msgid "One item"
msgid_plural "# items"
msgstr[0] "Un artículo"
msgstr[1] "# artículos"
```

The next information it takes from the config is the `plural` rule. It bundles that with the data when it compiles the catalogs.

```js
// es.compiled.js
export const data = [['Un artículo', '# artículos']]
export const plural = n => n == 1 ? 0 : 1
```

There are only two plural forms because Spanish has two. Some languages have
more, and they are supported too, it's just a matter of having the correct
`nPlurals` and explaining the rule using the `plural` expression in the config
and `wuchale` prepares the the catalogs and compiles them accordingly.

Then during transformation, your code gets updated to use the current locale's data:

```svelte
<script>
    import _w_rt_ from '../locales/loader.svelte.js'
    const _w_runtime_ = _w_rt_('main')
    import {plural} from '/src/utils.js'
    let itemCount = 5
</script>

<p>{plural(itemCount, _w_runtime_.tp(0), _w_runtime_.pr)}</p>
```

That way, the function that you define doesn't have to know about the number of
possible plural rules; it is provided the candidates and the selection rule
specific to the locale. It just have to select the candidate, do the necessary
modification (replacing `#` for example) and return the resulting single
string.

You can [configure](/reference/adapter-common/#pluralsfunc) `wuchale` to work
with a function with a different name if you want.
