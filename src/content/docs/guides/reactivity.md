---
title: Reactivity
---

By default, wuchale tries to use the reactivity system of the framework where
possible for better UX. However, that may not be necessary when the whole page
can be reloaded when the locale changes instead of changing the messages
in-place.

If you want to disable the reactivity and just want to use simple values, you can configure it on the adapter config [`useReactive`](/reference/adapter-common/#runtimeusereactive):

```js
// wuchale.config.js

export default {
    // ...
    adapters: svelte({
        // ...
        useReactive: false
    })
}
```

## Caveat

If you choose this, your code should not have top level variables that contain
messages which were possible to update because of reactivity. For example, if
you have this in your Svelte component:

```svelte
<script>
const msg = 'Hello'
</script>

<p>{msg}</p>
```

By default wuchale changes it to:

```svelte
<script>
// imports...
const _w_runtime_ = _w_load_rx_('main')
const msg = $derived(_w_runtime_(0))
</script>

<p>{msg}</p>
```

And whenever the catalogs are loaded, it can be updated. But this is lost if
you disable reactivity. So you should instead make it a function and call it
when needed:

```svelte
<script>
const msg = () => 'Hello'
</script>

<p>{msg()}</p>
```

In which case wuchale changes it to:

```svelte
<script>
// imports...
const msg = () => {
    const _w_runtime_ = _w_load_('main')
    return _w_runtime_(0)
}
</script>

<p>{msg()}</p>
```

And it will work as normal because it's called when it's rendered, which can be
delayed until the catalogs are loaded.
