---
title: Nested structures
---

Complex nested structures are preserved:

```svelte
<p>Welcome to <strong>{appName}</strong>, {userName}!</p>
```

Extracted as:
```
Welcome to <0/>, {0}!
```
