---
title: JSX
description: Docs for the JSX adapter
---

Import | `import { adapter } from "@wuchale/jsx"`
-|-
Loader extensions | `.js`, `.ts`
Default `files` | `src/**/*.{jsx,tsx}`
Compatibility | Tested with React >= 19 and SolidJS >= 1.9. Can work with any JSX.

The JSX adapter implements support for any JSX based framework.
Framework-specific differences are just on the default loader and the nested
messages handler component (implementation detail). For those, there is already
support for React (and by extension Preact) and SolidJS.

## Setup in Your App

This is assuming that you didn't modify the default loader files.

### React

```jsx
<!-- src/App.tsx -->
import { useEffect, useState } from 'react'
import './App.css'
import { loadLocale } from 'wuchale/load-utils'

function App() {
    const [locale, setLocale] = useState('en')
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(false)
        loadLocale(locale).then(() => setLoaded(true))
    }, [locale])

    if (!loaded) {
        // @wc-ignore
        return 'Loading locale...'
    }

    return (
        {/* Your JSX */}
    )
}
```

### SolidJS

```jsx
// src/App.tsx
import { createEffect, createSignal, type Component } from 'solid-js';
import { loadLocale } from 'wuchale/load-utils'

import styles from './App.module.css';

const App: Component = () => {
    const [locale, setLocale] = createSignal('en')
    createEffect(() => {
        loadLocale(locale())
    })
    return (
        {/* Your JSX */}
    );
};
```

## Default extraction rules

This adapter only uses the [default rules](/guides/rules) and has no additional restrictions.

## Configuration Reference

For the main configuration, look in the [configuration reference](/reference/config).

For the common adapter configuration, look in the [common adapter options](/reference/adapter-common/).

### `variant`

**type**: `"react" | "solidjs"`
**default**: `react`

The library you intend to use it with. This affects small differences like the
component used to handle nested messages. It was necessary as SolidJS has a
different behaviour for handling loops in JSX. Buf if you don't use SolidJS,
using `react` should do the job as it is not tied to a framework, it's just a
map.
