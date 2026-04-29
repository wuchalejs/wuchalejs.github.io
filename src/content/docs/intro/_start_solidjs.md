1. **Install**

    ```bash
    npm install wuchale @wuchale/jsx
    ```

2. **Configure Vite**

    ```diff lang="js" add="wuchale()"
    // vite.config.js
    import { defineConfig } from 'vite';
    import solidPlugin from 'vite-plugin-solid';
    +import { wuchale } from 'wuchale/vite';

    export default defineConfig({
        plugins: [wuchale(), solidPlugin()],
    });
    ```

3. **Create Configuration**

    ```javascript
    // wuchale.config.js
    // @ts-check
    import { adapter as jsx } from "@wuchale/jsx"
    import { defineConfig } from "wuchale"

    export default defineConfig({
        locales: ['en', 'es'],
        adapters: {
            main: jsx({
                loader: 'solidjs',
                variant: 'solidjs',
            }),
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App**

    Connect the locale selection and loading logic to your app. Follow the
    [SolidJS setup guide](/adapters/jsx/#solidjs).

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    ```jsx
    function Hello() {
        return <p>Hello world</p>
    }
    ```
