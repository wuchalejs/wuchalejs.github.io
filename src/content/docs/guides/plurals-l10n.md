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

A file `{localesDir}/plural.js` is written automatically based on the
configured `locales`. It exports a function:

```js
function plural(n: number, candidates: string[], locale?: Locale): string
```

The plural rules are based on the CLDR project which covers [100+
languages](https://cldr.unicode.org/#:~:text=to%20know%20about-,100%2B%20languages,-.%20It%20is%20the).
The environment exposes these rules through the
[`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
global object, which the written `plural` function relies on. This means there
is no need to define the rules as long as they are one of the supported
languages.

### Usage

The `plural` function accepts the number and the candidate messages as
arguments. The third argument `locale` is to be provided by wuchale at
transformation time. Therefore you can just import and use it like:

```svelte
<script>
    import plural from '../locales/plural.js'
    let itemCount = 5
</script>

<p>{plural(itemCount, ['One item', '# items'])}</p>
```

That's it. `wuchale` has enough information to take it from there. It takes the
source messages and creates the plural entry (e.g. Spanish in PO, after
translation):

```po title="es.po" ins="Un artículo" ins="# artículos" ins="# de artículos"
msgid ""
msgstr ""
"...{other headers}"
"Plural-Forms: nplurals=3;\n"
"X-Plurals-Order: one, many, other;\n"

msgid "One item"
msgid_plural "# items"
msgstr[0] "Un artículo"
msgstr[1] "# artículos"
msgstr[2] "# de artículos"
```

The headers are there to convey the expected order of the plurals. To see what
exactly they mean for the specific language, with examples, you can use the
[Unicode
table](https://www.unicode.org/cldr/charts/48/supplemental/language_plural_rules.html).
The order is important to make sure that the correct one is selected at
runtime, because the same order is also written with the `plural` function.

### Languages outside CLDR

In the case of the rarer languages that are not covered by CLDR, you can define
your own `plural` function with the same signature elsewhere, and use that
instead of the default one. To help with that, a second `Map` object is
exported from `plural.js` so that you can get the CLDR rules for the locales
that are supported and use your own for the ones that are not. For example:

```js
// src/lib/plural.js
import { indices } from '../locales/plural.js'

// some other rule to select the candidate index
const otherRule = n => n === 3 ? 0 : 1

export default function plural(n, candidates, locale = 'en') {
    const rule = locale === 'other' ? otherRule : indices.get(locale)
    return candidates[rule(n)]?.replace('#', n.toString())
}

```

### Pattern configuration

Wuchale doesn't track import relationships, rather only names and signatures.
Therefore if you don't agree with the naming or arguments order, you can define
your own function (like above), and configure the pattern in
[patterns](/reference/adapter-common/#patterns). The pattern for the above
signature of `plural` is configured by default.

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
