---
title: Comment directives
---

## Force ignore, include

When we don't want to modify the adapter, which applies to all files under the
adapter, we can use comment directives to override the decisions of the
adapter:

```svelte
<!-- @wc-ignore -->
<button>Home</button>
```

```javascript
console.log(/* @wc-include */ 'Hello')
```

