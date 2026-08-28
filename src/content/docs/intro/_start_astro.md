1. **Install**

    ```bash
    npm install wuchale @wuchale/astro
    ```

2. **Configure Astro**

    ```diff lang="js"
    // astro.config.js
    import { defineConfig } from 'astro/config'
    +import { wuchale } from '@wuchale/astro/integration'

    // https://astro.build/config
    export default defineConfig({
    +    integrations: [wuchale()],
    });
    ```

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
