---
title: Installation
nav_order: 1
---

To install `wuchale`, you have to install the base package and the adapter(s)
you want to use. The adapter for vanilla JS/TS projects is built into the base
package. For other projects, the adapter has to be installed. Currently, only
the Svelte adapter is available.

This installation guide assumes a simple Svelte project as an example. The
specific different steps required for different setups will be given in the
specific adapter page.

# 1. Install

```bash
npm install wuchale @wuchale/svelte
```

# 2. Configure Vite

```javascript
// vite.config.js
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { wuchale } from 'wuchale'

export default {
    plugins: [
        wuchale(),
        svelte(),
    ]
}
```

# 3. Create Configuration

Create `wuchale.config.js` in your project root:

```javascript
// @ts-check
import { adapter as svelte } from "@wuchale/svelte"
import { defineConfig } from "wuchale"

export default defineConfig({
    locales: {
        // English included by default
        es: { name: 'Spanish' },
        fr: { name: 'French' }
    },
    adapters: {
        main: svelte(),
    }
})
```

# 4. Initialize locales

```bash
npx wuchale init
```

This command:

- Creates the locales directory if it doesn't exist
- Creates the loader file if it doesn't exist
- If the loader didn't exist before, it scans the source files and extracts the texts as a first time scan

### 6. Setup in Your App

Now that the loader file is created, you can edit it, export the things you
need from there, and setup how the translations are loaded.

```html
<!-- src/App.svelte -->
<script>
    import { loadLocale } from 'wuchale/run-client'
    
    let locale = $state('en')
</script>

{#await loadLocale(locale)}
    <!-- @wc-ignore -->
    Loading translations...
{:then}
    <!-- Your app content -->
{/await}
```

### 7. Start Coding!

Write your Svelte components naturally. `wuchale` will extract and compile
translations automatically:

```html
<h1>Welcome to our store!</h1>
<p>Hello {userName}, you have {itemCount} items in your cart.</p>
```

For full usage examples, look inside the **[examples
repository](https://github.com/wuchalejs/examples)**. It contains examples for
different usage patterns.

After installing, you can learn about the [Usage](./usage).
