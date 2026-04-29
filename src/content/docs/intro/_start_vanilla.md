
1. **Install**

    ```bash
    npm install wuchale
    ```

2. **Configure Vite (only if using Vite)**

    ```diff lang="js" add="wuchale()"
    // vite.config.js
    +import { wuchale } from 'wuchale/vite'

    export default {
        plugins: [wuchale()]
    }
    ```

3. **Create Configuration**

    ```js
    // wuchale.config.js
    // @ts-check
    import { adapter as basic } from 'wuchale/adapter-vanilla'
    import { defineConfig } from 'wuchale'

    export default defineConfig({
        locales: ['en', 'es'],
        adapters: {
            main: basic({
                loader: 'vite' // If using Vite. Otherwise 'default'
            })
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App (if using Vite)**

    Connect the locale selection and loading logic to your app.

    ```javascript
    import { loadLocale } from 'wuchale/load-utils'
    await loadLocale(locale)
    ```

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    E.g. DOM
    ```javascript
    const showMsg = (element) => {
        element.innerHTML = 'Hello world'
    }
    ```
