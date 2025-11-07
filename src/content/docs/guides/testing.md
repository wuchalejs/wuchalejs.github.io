---
title: Testing
description: Learn how to test internationalized wuchale code in different environments. Configure Vitest for server-side testing and Testing Library for client-side testing with proper catalog loading.
---

If you want to test your code, you have to load the catalogs the appropriate
way. Since testing environments emulate different conditions (server/client),
you have to load the catalogs in the corresponding way.

:::note
This guide uses a SvelteKit project as an example for filenames etc., but the
concepts should be applicable to other frameworks as well.
:::

## [Vitest](https://vitest.dev/)

Vitest runs under Vite but it doesn't emulate client environments by itself. So
the environment it emulates is the server and therefore you have to load the
catalogs as appropriate. For example, if we have the following to test:

```js
// hello.svelte.ts
export const greet = () => {
    return 'Hello from module' // extracted/translated by wuchale
}
```

Then the setup for the test should be something like:

```js
// hello.svelte.test.js

import { expect, test } from 'vitest';
import { greet } from './hello.svelte.js'; // to be tested

import * as main from '../locales/main.loader.server.svelte.js'
import * as js from '../locales/js.loader.server.js'

import { loadLocales, runWithLocale } from 'wuchale/load-utils/server';
import { locales } from '../locales/data.js'

await loadLocales(main.key, main.loadIDs, main.loadCatalog, locales)
await loadLocales(js.key, js.loadIDs, js.loadCatalog, locales)

test('Greeting', () => {
    // test with Spanish
    runWithLocale('es', () => {
        let h = greet()
        expect(h).toEqual('Hola desde el módulo');
    })
});
```

## [Testing Library](https://testing-library.com/)

Testing Library emulates the client environment and therefore you have to load
the catalogs as done for the client, using `loadLocale`. For example, if you
have the component:

```svelte
<!-- hello.svelte -->

<!-- extracted and translated by wuchale -->
<button>Hello</button>
```

```js
// hello.svelte.test.js

import { expect, test } from 'vitest';
import { greet } from './hello.svelte.js';

import { loadLocale } from 'wuchale/load-utils';

import Hello from './hello.svelte'
import {render, screen} from '@testing-library/svelte'

// test with Spanish
await loadLocale('es')

test('Greeting', () => {
    render(Hello)

    const button = screen.getByRole('button', {name: 'Hola'})
    expect(button).toBeInTheDocument()
})
```
