---
title: Comment directives
---

To control some aspects of the extraction process, you can use comments and
they apply to the next thing that comes after them. This will be familiar if
you have written TypeScript.

A comment directive applies to the whole thing that comes after, including its
children, unless overridden by another one for the children.

The specific syntax of the comment may differ depending on the syntax of the
file but the content is the same.

## `@wc-ignore`

When we don't want to modify the adapter's heuristic - which applies to all
files under the adapter - for some specific text, we can use comment directives
to ignore it:

```svelte
<!-- @wc-ignore -->
<button>Home</button>
```

## `@wc-include`

Likewise, to force include a piece of text that would be ignored by the
heuristic, we can use this comment.

```javascript
console.log(/* @wc-include */ 'Hello')
```

## `@wc-context: {context}`

To disambiguate identical texts or to give more details, we can use the comment
to give it the context and they will be extracted separately with their own
contexts which can help the translator later.

```svelte
<!-- @wc-context: navigation -->
<button>Home</button>

<!-- @wc-context: building -->
<span>Home</span>
```
