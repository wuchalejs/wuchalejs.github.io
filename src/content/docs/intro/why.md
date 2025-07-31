---
title: Why wuchale?
---

Traditional i18n solutions require you to wrap every translatable string with
function calls or components. `wuchale` doesn't.

```html
<!-- Traditional i18n -->
<p>{t('Hello')}</p>
<p><Trans>Welcome {userName}</Trans></p>

<!-- With wuchale -->
<p>Hello</p>
<p>Welcome {userName}</p>
```

Write your code naturally. No imports, no wrappers, no annotations.
`wuchale` handles everything at compile time.

