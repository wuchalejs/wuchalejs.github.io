---
title: Usage
nav_order: 2
---

# Setup

To see specific loaders in action, you can look inside the **[examples
repository](https://github.com/wuchalejs/examples)**.

# What gets extracted

There are three possible places for a user-facing text to be in:

- Markup: inside HTML tags like `<p>text</p>`
- Attribute: insite element attributes like `<span title="Text"></span>`
- Script: strings inside JavaScript code

Inside of these, which texts exactly are extracted is decided by the adapter in
use, because not all text should be extracted as user facing text. Some
attributes and strings are not meant to be seen by the user.

The adapter uses a heuristic function to make these decisions and that function
can be overriden using the configuration. This heuristic function receives the
text along with other details about the text and can decide whether to extract
it or not.

Complex nested structures are preserved:

```svelte
<p>Welcome to <strong>{appName}</strong>, {userName}!</p>
```

Extracted as:
```
Welcome to <0/>, {0}!
```

# Comment directives

## Force ignore, include

When we don't want to modify the adapter, which applies to all files under the
adapter, we can use comment directives to override the decisions of the
adapter:

```svelte
<!-- @wc-ignore -->
<button>Home</button>
```

```javascript
console.log(/* @wc-include */ 'Hello')
```

## Context

To disambiguate identical texts or to give more details, we can use the comment
to give it the context and they will be extracted separately with their own
contexts which can help the translator later.

```svelte
<!-- @wc-context: navigation -->
<button>Home</button>

<!-- @wc-context: building -->
<span>Home</span>
```

# Pluralization

Define your function

```javascript
// in e.g. src/utils.js
export function plural(num, candidates, rule = n => n === 1 ? 0 : 1) {
    const index = rule(num)
    return candidates[index].replace('#', num)
}
```

Use it

```svelte
<script>
    import {plural} from '/src/utils.js'
    let itemCount = 5
</script>

<p>{plural(itemCount, ['One item', '# items'])}</p>
```

# 📁 File Structure

Unless configured to write other files to disk, `wuchale` only writes files
that you should commit.

```
src/
├── locales/
│   ├── en.po     # Source catalog
│   ├── es.po     # Translation catalog
│   └── loader.js # Loader file for the adapter
└── App.svelte    # Your components
```

If you configure the loader to write the compiled catalogs and the proxy,

```
src/
├── locales/
│   ├── en.po           # Source catalog
│   ├── en.compiled.js  # Source catalog compiled
│   ├── es.po           # Translation catalog
│   ├── es.compiled.js  # Translation catalog compiled
│   └── proxy.js        # Proxy file for catalogs
│   └── loader.js       # Loader file for the adapter
└── App.svelte          # Your components
```

If you configure it to write the transformed code as well, it will write it to
`src/locales/.output/` or the `outDir` you configure.

