---
title: Fallback
description: Ensure users see fallback translations in wuchale - default to source messages when translations are missing, avoiding empty or placeholder text.
---

Often, translations lag behind the source code. And it is necessary to make sure
that the user sees at least the English version of the message, instead of some
meaningless text. For example, for the following code:

```svelte
<p>Hello</p>
```

When it is extracted initially, it becomes the following for other languages:

```po
msgid "Hello"
msgstr ""
```

Then during compile time, if the text has not yet been translated, it looks for
the first translation along a fallback chain. With no configuration, for
locales that are regional variants like `fr-CH`, it falls back to the base one
`fr`. And explicit chains can be configured by providing from-to pairs in the
fallback key. Finally, the end of the chain is the source locale. For example,
with a config like this:

```js
// wuchale.config.js
export default {
  // ...
  fallback: {
    "fr-CH": "fr-FR",
    "fr-FR": "fr-ES",
  },
  // ...
};
```

The fallback chain for `fr-CH` (with `en` as the source locale) would be:

1. `fr-FR`
1. `fr-ES`
1. `fr`
1. `en`
