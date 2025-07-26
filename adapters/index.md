---
title: Adapters
has_children: true
nav_order: 3
---

`wuchale` is designed to work in different codebases which may use different
syntax. For example, a project that uses plain JavaScript/TypeScript is
different from one that uses Svelte. For this reason, the tasks that are
specific to the project type are offloaded to adapters and the core acts as the
orchestrator and handles the CLI.

Specifying multiple adapters is possible to support these use cases:

- To partition the catalog into smaller catalogs. Particularly useful in big
  applications which may have a *lot* of texts.
- To use different rules for different parts of the project. For example, to
  ignore certain text patterns in half of the application using a different
  heuristic pattern.
- To use different adapters for different parts of the project. This is
  especially necessary for fullstack projects where JavaScript/TypeScript are
  used for the backend and a frontend library is used for the interface. These
  need different adapters.

The main things adapters have to handle is the following:

- How to transform the code to use the runtime
- The heuristic function
- Files to extract from
- The location of the extracted catalogs
- Whether to write to disk and where

These are the officially supported adapters.

- [Vanilla](./vanilla)
- [Svelte](./svelte)
