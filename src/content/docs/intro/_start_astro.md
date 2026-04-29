1. **Install**

    ```bash
    npm install wuchale @wuchale/astro
    ```

2. **Configure Vite**

    ```diff lang="js"
    // astro.config.js
    import { wuchale } from 'wuchale/vite';
    import { defineConfig } from 'astro/config';

    // https://astro.build/config
    export default defineConfig({
    +    vite: {
    +        plugins: [wuchale()],
    +    },
    +    i18n: {
    +        locales: ['en', 'es'],
    +        defaultLocale: 'en',
    +        routing: {
    +            prefixDefaultLocale: true,
    +        }
    +    },
    });
    ```
    :::note
    **Additionally**, since we will use path prefixes using Astro's `i18n`
    routing, everything inside `src/pages` has to be moved to
    `src/[locale]/pages` and imports have to be adjusted accordingly.
    :::

3. **Create Configuration**

    ```javascript
    // wuchale.config.js
    // @ts-check
    import { adapter as astro } from "@wuchale/astro"
    import { defineConfig } from "wuchale"

    export default defineConfig({
        locales: ['en', 'es'],
        adapters: {
            main: astro(),
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App**

    Connect the locale selection and loading logic to your app. Follow the
    [Astro setup guide](/adapters/astro/#setup-in-your-app).

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    ```astro
    <p>Hello world</p>
    ```
