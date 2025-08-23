---
title: HMR
description: Leverage wuchale's Vite HMR integration for efficient translation updates - minimize reloads, preserve state, and enable live translations during development.
---

With how wuchale works, a single catalog is often shared between multiple
components. That presented a challenge because now updating the catalog to add
a single word means invalidating all of the files that use the catalog. This
was how `wuchale` initially worked. While it was fast, it became annoying on a
non trivial application because the whole state of the application was lost due
to a change in a small component.

HMR support is implemented in two directions.

## Editing source files

After trying to use different methods, one method became reliable and framework
agnostic: Embedding the updates inside the transformed modules themselves. No
Vite dev server events, no HMR API, no complicated implementation. This way,
there is no roundtrip for the catalog updates and a single HMR update holds all
the info. Then the new version of the file updates the catalog just before it
uses it.

The best thing is, this is independent of how you load the catalogs because the
source files update the catalog after getting it, just before using it.

This makes it as if wuchale was never there, while it does its job of
extracting and keeping the catalogs up to date. And also [live
translating](/guides/gemini) using Gemini!

This is only done during development though. No HMR related manipulation is
done during production builds or extraction using the CLI.

## Editing PO files

PO files are not edited as frequently and therefore editing them triggers a
full reload instead of small localized updates.
