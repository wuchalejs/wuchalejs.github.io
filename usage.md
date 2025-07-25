---
title: Usage
order: 2
---

## Pluralization

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

`wuchale` creates two files per locale per adapter. Taking Svelte as an example,

```
src/
├── locales/
│   ├── en.po         # Source catalog (commit this)
│   ├── en.svelte.js  # Compiled data module (gitignore)
│   ├── es.po         # Translation catalog (commit this)
│   └── es.svelte.js  # Compiled data module (gitignore)
└── App.svelte        # Your components
```

The `.js` file suffix depends on the specific adapter.

### Nested Content

Complex nested structures are preserved:

```svelte
<p>Welcome to <strong>{appName}</strong>, {userName}!</p>
```

Extracted as:
```
Welcome to <0/>, {0}!
```

### Context

Disambiguate identical texts:

```svelte
<!-- @wc-context: navigation -->
<button>Home</button>

<!-- @wc-context: building -->
<span>Home</span>

```

### Useful Usage Pattern

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
}
```
