---
title: Mixed and nested structures
---

While simple text fragments are easy to extract, mixed and nested texts are
not. But `wuchale` handles them seamlessly. When writing them in the [`.po`
files](/concepts/catalogs/#po-files), it uses a simple convention that is easy
to work with for translators.

## Text mixed with expressions

These are created when extracting template literals and markup text with expressions in the middle. For example,

```js
const msg = `Hello ${userName}, welcome to ${appName}!`
```

And

```svelte
<p>Hello {userName}, welcome to ${appName}!</p>
```

Are both extracted into:

```nginx
msgid "Hello {0}, welcome to {1}!"
msgstr ""
```

The expressions are converted into zero based numeric placeholders. Now the
translator can rearrange anything as the language dictates and `wuchale` will
use the numbers in the placeholders to know where to put what.

## Nested content

When text is mixed with markup that contains other text or expressions, it is
also handled gracefully.

```svelte
<p>Welcome to <i>the app {appName}</i>, <b>{userName}</b>!</p>
```

This is extracted as:

```nginx
msgid "Welcome to <0>the app {0}</0>, <1/>!"
msgstr ""
```

This example shows two behaviours `wuchale` has when handling nesting content.

- When the nested content contains only text or text mixed with something else,
    it is extracted in HTML tags with both opening and closing tags `<0>...</0>`.
- When it doesn't contain any text, the whole thing is extracted as a
    self-closing tag `<1/>`. Because the translator doesn't need to know what is inside
    the tag because it is not translatable. They can translated without being
    overwhelmed with unnecessary details.

**Note**: The numeric indices of the placeholders is within their immediate parent.
