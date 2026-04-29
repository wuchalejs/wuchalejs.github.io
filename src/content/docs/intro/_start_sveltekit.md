1. **Install**

    ```bash
    npm install wuchale @wuchale/svelte
    ```

2. **Configure Vite**

    ```diff lang="js" add="wuchale()"
    // vite.config.js
    import { sveltekit } from '@sveltejs/kit/vite'
    +import { wuchale } from 'wuchale/vite'

    export default {
        plugins: [ wuchale(), sveltekit() ]
    }
    ```

3. **Create Configuration**


    ```js
    // wuchale.config.js
    // @ts-check
    import { adapter as svelte } from "@wuchale/svelte"
    import { adapter as js } from 'wuchale/adapter-vanilla'
    import { defineConfig } from "wuchale"

    export default defineConfig({
        locales: ['en', 'es'],
        adapters: {
            main: svelte({ loader: 'sveltekit' }),
            js: js({
                loader: 'vite',
                files: [
                    'src/**/+{page,layout}.{js,ts}',
                    'src/**/+{page,layout}.server.{js,ts}',
                ],
            })
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App**

    Connect the locale selection and loading logic to your app. Follow the
    [SvelteKit setup guide](/adapters/svelte/#sveltekit-ssrssg).

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    ```svelte
    <p>Hello world</p>
    ```
