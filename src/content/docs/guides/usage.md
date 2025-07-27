---
title: Usage
nav_order: 2
---

# Loader, Proxies and setup

When you run `npx wuchale init`, a loader file is created along with the
initial catalogs, next to the catalogs. The loader file is where you specify
how you integrate the catalogs into your app. Once it exists, even if you run
`npx wuchale init` again, it will not be overwritten unless it is empty.

The loader file is where all the transformed code (under the adapter) will
import the current catalog from. As such it controls all of those files. It
also has access to the catalog proxies that can provide the extracted catalogs
for that adapter, as well as the IDs of the catalogs that will be requested by
the transformed code.

The proxies are small modules (virtual by default, can be written to disk) that
export functions that take locale identifiers and return compiled catalogs.
When using virtual modules, they are two per adapter (one for sync, another for
async). The loader can choose which proxy to import from and use the function
to do the actual loading or export it to pass it to application code.

When using `wuchale` with `vite`, the loader is considered special in the sense
that when it imports the catalogs and load IDs from the provided virtual
modules, what it gets is specifically for it. Other files needing the same data
need to import it from the loader.

After the initial default creation, it is under your control and you can load
the catalogs however you please. All the loader has to do is export a default
function that takes a load ID and returns the catalog for that ID.

As for the actual loading, the application code somewhere you decide has to
initiate the loading and this depends on the codebase. For SvelteKit for
example, if we want SSR, it has to be in the load function of the layout (or
the page.) For normal Svelte, it has to be at the main component using
something like an await block or an `$effect`. All of this should be decided by
you.

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

```html
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

```html
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

```html
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

```html
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

# Useful Usage Pattern

A common scenario is needing to prevent string extraction inside functions, but
you may not want to modify the global heuristic or litter your code with
comment directives. A cleaner approach is to extract constants to the top
level, which are ignored by default:

```js
const keys = {
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  // ...
};

function eventHandler(event) {
  if (event.key === keys.Escape) {
    // ...
  }
}
```

# Tailwind CSS

`wuchale` writes the changes to the translation catalog `.po` files as you edit
your source files. This makes those files up to date. However, Tailwind watches
any files not recognized by javascript as a possible source of CSS class names
(for some reason!) and since the files are not JS files, it only does a full
page refresh. As you can imagine, everytime you add a new word and save,
wuchale modifies the `.po` file and a full reload will be annoying.

This can be easily solved though. You can add the locales directory to the
ignore list inside the Tailwind main css:

```css
/* src/routes/app.css */
@import "tailwindcss";
@source not "../locales/";
```

# Configuration reference

```javascript
export default {
    // Source language code
    sourceLocale: 'en',
    
    // Available locales with plural rules
    locales: {
        en: {
            name: 'English',
            // the number of plurals in the language
            nPlurals: 2,
            // The expression to use to decide which candidate to choose when using your plural() function
            // The number should be used as 'n' because this will be the body of an arrow function with n as an argument.
            pluralRule: 'n == 1 ? 0 : 1'
        }
    },
    
    // Adapters are the project type specific bindings for wuchale. For the vanilla adapter configuration, look below.
    // You can repeat the same adapter with different keys and catalog configurations
    // to break the translations into smaller parts
    adapters: {
        // key: AdapterConf
    }
    
    // Enable HMR updates during development. You can disable this to avoid the small overhead
    // of live translation updates and work solely with the source language.
    // HMR is highly optimized -- it updates only the affected components,
    // preserving application state and avoiding full reloads.
    hmr: true,
    
    // Gemini API key (or 'env' to use GEMINI_API_KEY)
    // if it's 'env', and GEMINI_API_KEY is not set, it is disabled
    // set it to null to disable it entirely
    geminiAPIKey: 'env'

    // If you find wuchale to be too chatty, you can silence it using this.
    messages: true,
}
```
