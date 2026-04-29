1. **Install**

    ```bash
    npm install wuchale @wuchale/svelte
    ```

2. **Configure Vite**

    ```diff lang="js" add="wuchale()"
    // vite.config.js
    import { svelte } from '@sveltejs/vite-plugin-svelte'
    +import { wuchale } from 'wuchale/vite'

    export default {
        plugins: [ wuchale(), svelte() ]
    }
    ```

3. **Create Configuration**

    ```javascript
    // wuchale.config.js
    // @ts-check
    import { adapter as svelte } from "@wuchale/svelte"
    import { defineConfig } from "wuchale"

    export default defineConfig({
        locales: ['en', 'es'],
        adapters: {
            main: svelte({ loader: 'svelte' }),
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App**

    Connect the locale selection and loading logic to your app. Follow the
    [Svelte setup guide](/adapters/svelte/#svelte-spa).

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    ```svelte
    <p>Hello world</p>
    ```
