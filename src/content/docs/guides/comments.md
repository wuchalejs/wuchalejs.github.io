---
title: Comment directives
description: Learn to control wuchale's translation extraction with comment directives - @wc-ignore, @wc-include, and @wc-context for precise message handling.
---

To control some aspects of the extraction process, you can use comments and
they apply to the next thing that comes after them. This will be familiar if
you have written TypeScript.

The specific syntax of the comment may differ depending on the syntax of the
file but the content is the same.

:::tip

A comment directive applies to the whole scope of a single non-comment thing
that comes after, including its children, unless overridden by another one for
the children.

```ts
export function status(t: number): string {
    // @wc-include
    // comment, bypassed
    switch (t) {
        case 1:
            return "deleted" // included
        case 2:
            return "invited" // included
        default:
            // @wc-ignore
            return 'Active' // ignored
    }
    return 'no status' // ignored because of heuristic, @wc-include is reset
}
```
:::

## `@wc-ignore`

When we don't want to modify the adapter's heuristic - which applies to all
files under the adapter - for some specific message, we can use comment directives
to ignore it:

```svelte
<!-- @wc-ignore -->
<button>Home</button>
```

## `@wc-ignore-file`

This is like `@wc-ignore` but for the whole file. You have to put it at or near
the beginning of the file before any extractable text.

## `@wc-include`

Likewise, to force include a message that would be ignored by the
heuristic, we can use this comment.

```javascript
console.log(/* @wc-include */ 'Hello')
```

## `@wc-url`

To force include a string that would be ignored by the heuristic and to signify
that it is a [URL value](/guides/urls), we can use this comment.

```javascript
console.log(/* @wc-url */ '/items')
```

## `@wc-context: {context}`

To disambiguate identical messages or to give more details, we can use the comment
to give it the context and they will be extracted separately with their own
contexts which can help the translator later.

```svelte
<!-- @wc-context: navigation -->
<button>Home</button>

<!-- @wc-context: building -->
<span>Home</span>
```

## `@wc-unit`

For markup that is all content, it may not be desired to put different
paragraphs in different places in the catalogs. In that case, a whole container
can be marked with this comment to keep it as a single message (excluding
attributes and strings inside interpolated code).

```svelte
<!-- @wc-unit -->
<div>
    <p>Parag 1</p>
    <p>Parag 2</p>
    <p>Parag 3</p>
</div>
```
