---
title: Pluralization and l10n
description: Implement pluralization and localization in wuchale - define a reusable function to select the correct message based on number, integrate locale-specific rules, and handle translations seamlessly.
---

As `wuchale` is not a library you import from, but a compile time tool, you can
tell it to look for patterns you write in the code to achieve pluralization and
localization. This is done using the
[`patterns`](/reference/adapter-common/#patterns). Two methods are supported.
In most cases the first one is sufficient and doesn't need any other package.

## Built-in pluralization

In this approach, the plural rule is written inside the catalog storage with
the messages (e.g. in PO file headers) and the candidates are listed in each
item. This approach is sufficient for most cases and it doesn't require
installing additional libraries.

The pattern for this is [configured as default](/reference/adapter-common/#patterns).

### Usage

You first define your own function that selects the correct message from provided
candidates based on the number, replaces the placeholder if needed, and returns
the final message. The only requirement is that the signature has to match that of
the below example.

```javascript
// src/utils.ts
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

### How it works

The rules for plurals are taken from the catalogs (e.g. PO file headers). For
example, you can edit the `.po` file for Spanish and make it look like:

```po title="es.po" ins="Un artículo" ins="# artículos" ins="nplurals=2; plural=n == 1 ? 0 : 1"
msgid ""
msgstr ""
"...{other headers}"
"Plural-Forms: nplurals=2; plural=n == 1 ? 0 : 1;\n"

msgid "One item"
msgid_plural "# items"
msgstr[0] "Un artículo"
msgstr[1] "# artículos"
```

Then it takes the rule and puts it as a function in the compiled catalog when the use of plurales is detected (according to the [default pattern](/reference/adapter-common/#patterns)).

```js
// es.compiled.js
export const c = [['Un artículo', '# artículos']]
export const p = n => n == 1 ? 0 : 1
```

In this example, there are only two plural forms because Spanish has two. Some
languages have more, and they are supported too, it's just a matter of having
the correct `nplurals` and explaining the rule using the `plural` expression in
the catalog and wuchale prepares uses them accordingly.

Then during transformation, your code gets updated to use the current locale's data:

```svelte
<script>
    import _w_rt_ from '../locales/main.loader.svelte.js'
    const _w_runtime_ = _w_rt_('main')
    import {plural} from '/src/utils.js'
    let itemCount = 5
</script>

<p>{plural(itemCount, _w_runtime_.p(0), _w_runtime_._.p)}</p>
```

That way, the function that you define doesn't have to know about the number of
possible plural rules; it gets the candidates and the selection rule specific
to the locale. It just have to select the candidate, do the necessary
modification (replacing `#` for example) and return the resulting single
string.

You can configure [patterns](/reference/adapter-common/#patterns) to work with
a function with a different name if you want.

## ICU style pluralization and localization

In this approach, the pluralization rule is mixed with the messages inside a
single big string. While it may have its complexity, it can be used to
construct complex combinations, even mixing with other data types like genders
and dates.

To work with this approach, you have to select and install the localization
library of your choice, `wuchale` doesn't limit you to any, because it doesn't
depend on any, it just transforms you code. For starters, here are some
suggestions:

- [Intl MessageFormat](https://www.npmjs.com/package/intl-messageformat): based on an ECMA-402 proposal
- [messageformat](https://www.npmjs.com/package/messageformat): based on another ECMA-402 proposal

We will take the first one as an example.

First you have to configure the signature of your own reusable function in the config:

```js
// ...
adapters: js({
  patterns: [
    {
      name: "formatMsg",
      args: ["message", "other", "locale"],
    },
  ],
});
//...
```

Then you create your reusable utility function with that name and signature:

```js
export function formatMsg(msg, args, locale = 'en') {
  return new IntlMessageFormat(msg, currentLocale).format(args);
}
```

And then you can use it anywhere:

```js
const msg = formatMsg(
  `{numPhotos, plural,
      =0 {You have no photos.}
      =1 {You have one photo.}
      other {You have # photos.}
    }`,
  { numPhotos: 1000 }
);
```

Then `wuchale` will extract and transform it into:

```js
const msg = formatMsg(_w_runtime_(0), { numPhotos: 1000 }, _w_runtime_.l);
```

And you will find that big string in the catalog storage (PO file), and can
translate it, changing the rules as you want.

```po title="es.po"
msgid ""
"\n"
"{numPhotos, plural,\n"
"=0 {You have no photos.}\n"
"=1 {You have one photo.}\n"
"other {You have # photos.}\n"
"}\n"
""
msgstr ""
"\n"
"{numPhotos, plural,\n"
"=0 {No tienes fotos.}\n"
"=1 {Tienes una foto.}\n"
"other {Tienes # fotos.}\n"
"}\n"
""
```

And it's put in the compiled catalogs as is (because the parsing and interpolation is now done by the library you choose):

```js
export let c = ['\n{numPhotos, plural,\n=0 {No tienes fotos.}\n=1 {Tienes una foto.}\nother {Tienes # fotos.}\n}\n']
```
