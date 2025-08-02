---
title: Loading catalogs
description: Tutorial about loading catalogs
---

When it comes to loading catalogs, `wuchale` doesn't restrict you to only use
certain loading strategies. Instead, it provides building blocks to implement
any strategy, and uses them in a sane default way to reduce the initial setup.
But if you need to change the default or want to learn about all available
tools, it is explained here.

## Basics

You can specify one or more adapter configurations in your `wuchale.config.js`.
Each adapter is responsible for the files specified for it. And each adapter
has a loader file. The loader file has one job: loading the [compiled
catalogs](/concepts/catalogs#compiled-catalogs) and providing it to the
transformed modules.

The loader file has to export a function as `default`. The function signature has to be this:

```ts
(loadID: string) => import('wuchale/runtime').Runtime
```

The transformed modules then import that, call it with their `loadID` and
expect a `Runtime` object. To be specific, the top of the transformed modules
will be like this:

```js
import _w_load_ from "../path/to/loader.js"
const _w_runtime_ = _w_load_('load_id')
```

The `Runtime` is a tiny wrapper class (whole implementation in just [66
lines](https://github.com/wuchalejs/wuchale/blob/main/packages/wuchale/src/runtime.ts))
for the compiled catalogs that makes it ready to access by the transformed
modules. It accepts a [compiled catalog](/concepts/catalogs#compiled-catalogs)
or `undefined` if none is available.

```js
import { Runtime } from 'wuchale/runtime'

const rt = new Runtime({data: ['Hello'], plural: n => n == 1 ? 0 : 1})
// get the one at index 0
rt.t(0) // -> returns 'Hello'

// or when there is no compiled catalog
const rt = new Runtime()
```

When it has no data, it returns something like `[i18n-404:0]` to indicate that
there is nothing at that index.
