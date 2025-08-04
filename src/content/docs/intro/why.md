---
title: Why wuchale?
---

## No extra syntax

Traditional i18n solutions require you to wrap every translatable string with
function calls or components.
```svelte
<!-- Lingui -->
<p><Trans>Hello</Trans></p>
<!-- Paraglide -->
<p>{t.welcome_message()}</p>
<!-- Lingui, i18next and many others -->
<p>{t('home.welcome.greeting')}</p>
```

`wuchale` takes a different approach and tries to work with your normal code.

```svelte
<p>Hello</p>
```

Write your code naturally. No imports, no wrappers, no annotations.
`wuchale` handles everything at compile time.

The argument is this:

> We already write enough syntax to tell if a piece of
text should be translated or not. We should not have to write
more just to internationalize it.

Internationalization should be an easy
choice, not a heavy chore.

## Easy to add and remove

A side-effect of the above principle is that pre-existing projects now require
very low effort to internationalize because the code doesn't have to change,
`wuchale` understands the code and works with it.

Another benefit is that unlike other solutions, your codebase doesn's get
locked into one library. `wuchale` is still removable easily because you didn't
modify your code. If you remove `wuchale`, you will still have a perfectly
functional codebase with just one locale.

## Protobuf-like compilation

Other i18n solutions add keys to the catalogs to access the specific text.

```js
// Lingui
export const messages = JSON.parse(`{"key1":["Hello"],"key2":["World"]}`)
// i18next
export const messages = {key1: "Hello", key2: "World"}
// Paraglide
export const key1 = () => "Hello"
export const key2 = () => "World"
```

`wuchale` avoids using keys altogether and uses an array instead.

```js
export const data = ["Hello", "World"]
```

This drastically reduces the bundle size as there are no keys in the catalogs
and numeric indices are shorter and faster to access data than strings in the
code as well.

This is somewhat similar to the benefit that [protocol
buffers](https://protobuf.dev/) provide: schemaless compact exchange format.

## Instant feedback during development

HMR became important for a reason: it allows us to have a fast feedback loop
and therefore makes adjusting and fixing issues faster, helping to ship
products faster.

`wuchale` integrates with Vite's HMR deeply and connects everything so that
when you make changes in one file (be it the code or the catalogs), it is
reflected in the browser instantly.

It even goes a step further. It [integrates with Gemini](/guides/gemini) and
does the actual translation on-the-fly, allowing you to edit your source code
in one language and have it updated in the browser in another language of your
choosing.

## Flexibility

### Text format

`wuchale` doesn't make assumptions to how you write your code. You may write it
in any pattern that the language allows and `wuchale` understands it. This is
important when we want to have some part of the texts formatted differently,
nesting elements within elements, or any complicated text you can come up with,
it extracts it preserving what should be together.

```svelte
<p>Welcome to <i>the app {appName}</i>, <b>{userName}</b>!</p>
```

### Loading catalogs

Different projects require different ways of loading the catalogs and `wuchale`
respects your choice if you want to use async loading, break catalogs into
smaller pieces, on a per-component basis, selectively group some of the files
but not others, or load them synchronously to avoid too many separate requests,
or any other strategy you may think of, you can implement it using the provided
tools.

## Very few dependencies

Unlike traditional i18n solutions that pull in heavy transformation frameworks
like Babel or complex AST manipulation libraries, `wuchale` maintains an lean
dependency tree with just a handful of carefully selected, lightweight
packages, and mainly works with the libraries you already use (e.g. Svelte's
own parser for Svelte). This minimal footprint means faster install times,
reduced bundle sizes, smaller attack surfaces, and fewer supply chain
vulnerabilities in your project.
