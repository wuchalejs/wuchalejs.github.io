---
title: Roadmap
---

## Adapters

`wuchale` started life as a Svelte preprocessor. But it gradually became
apparent that the problem it solves is relevant not just for projects using
Svelte but other frameworks as well. Moreover, the Svelte-specific code was
actually a small part of the whole codebase. As such, its architecture has
developed into a core with pluggable adapters.

The core contains the adapter for vanilla JavaScript/TypeScript projects and
the Svelte adapter was extracted into a separate package. That means `wuchale`
already has two adapters. For now, the adapter API is being finalized and
polished.

In the near future, there will be official adapters for other frameworks and
the adapter API will be fully documented so that the community will be able to
develop any adapters.

The first official adapter after Svelte will be React.

## LSP server

During development, it would be nice if the string we are writing will be extracted
or not, right from the editor. This will be implemented.

## Disclaimer

These are not concrete goals set in stone. They are subject to change based on
circumstances and feedback. And feedback is welcome.
