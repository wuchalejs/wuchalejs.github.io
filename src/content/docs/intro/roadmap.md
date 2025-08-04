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

## Bundlers

The second stage after being a Svelte preprocessor in `wuchale`'s development
was a Vite plugin. Right now, `wuchale` can also work as a standalone CLI in
addition to being a Vite plugin. And again, the Vite-specific code is now a
small part of the whole codebase. Therefore, the Vite plugin will become a
separate package and the remaining will then be something like what TypeScript
is: a CLI with an API to integrate into many things.

This opens up possibilities to use it in setups that may not use Vite, such as
other bundlers if required.
