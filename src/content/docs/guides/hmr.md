---
title: HMR
---

With how wuchale works, a single catalog is often shared between multiple
components. That presented a challenge because now updating the catalog to add
a single word means invalidating all of the files that use the catalog. This
was how `wuchale` initially worked. While it was fast, it became annoying on a
non trivial application because the whole state of the application was lost due
to a change in a small component.

Now `wuchale` integrates with Vite on a deeper level using Vite's awesome HMR
API and it combines it with the reactivity of the framework in use (e.g.
Svelte). This way, it delivers granular updates to the specific place where the
message was changed. This is done by providing a hook along with the catalog
for when the catalog is updated and using it in the default loaders. You can
use it too if you modify the default loaders.

```js
import * as enMain from 'virtual:wuchale/catalog/main/main/en'

enMain.onUpdate(newData => console.log(newData))
```

You can read more about loading in [Loading catalogs](/guides/loading).

This makes it as if wuchale was never there, while it does its job of
extracting and keeping the catalogs up to date. And also [live
translating](/guides/gemini) using Gemini!

This is only done during development though. No HMR related manipulation is
done during production builds or extraction using the CLI.
