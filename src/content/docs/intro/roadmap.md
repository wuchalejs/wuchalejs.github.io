---
title: Roadmap
description: Explore wuchale's development roadmap - upcoming ICU/Intl.MessageFormat support, backend language extraction for Go & Python, Next.js adapter, and LSP tooling.
---

These are not concrete goals set in stone. They are subject to change based on
circumstances and feedback. And feedback is welcome.

## [`Intl.MessageFormat`](https://formatjs.github.io/docs/intl-messageformat/)

`wuchale` already supports Gettext style pluralization. But this will bring
full localization (l10n) support for genders, currencies, dates, etc along
with ICU style pluralization. It will be an optional feature.

## Other backend languages (Go, Python)

It is desirable that the messages from the server be internationalized too.
`wuchale` already supports server code in JavaScript/TypeScript using the
Vanilla adapter. But since it is very common to use other languages for the
backend, extending support for them is planned. The challenge is that they
don't have the concept of bundlers where you can transform code before it goes
into the compiler. But since bundle size is not a concern there, it is possible
to add an extract-only adapter for them that outputs catalog modules with the
source strings themselves as the keys, in their language that can just be
imported, and then the dev decides how they use the translation catalogs.

## Additional support

`wuchale` already has three adapters: the Vanilla, JSX and Svelte adapters,
with two ways of using them: CLI and a Vite plugin. Additional support is
planned for:

- Next.js

## LSP server

During development, it would be nice if the string we are writing will be extracted
or not, right from the editor. This will be implemented.
