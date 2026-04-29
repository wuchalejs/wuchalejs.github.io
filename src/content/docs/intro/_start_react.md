1. **Install**

    ```bash
    npm install wuchale @wuchale/jsx
    ```

2. **Configure Vite**

    ```diff lang="js" add="wuchale()"
    // vite.config.js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    +import { wuchale } from 'wuchale/vite'

    export default defineConfig({
        plugins: [ wuchale(), react() ],
    })
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
            main: jsx({ loader: 'react' }),
        }
    })
    ```

4. **Scaffold and initial extract**

    ```bash
    npx wuchale
    ```

5. **Setup in Your App**

    Connect the locale selection and loading logic to your app. Follow the
    [React setup guide](/adapters/jsx/#react).

6. **Start Coding!**

    Write your code components naturally. `wuchale` will extract and compile
    translations automatically:

    ```jsx
    function Hello() {
        return <p>Hello world</p>
    }
    ```
