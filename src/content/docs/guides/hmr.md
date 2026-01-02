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
translating](/guides/ai) using AI!

This is only done during development though. No HMR related manipulation is
done during production builds or extraction using the CLI.

## Editing PO files

PO files are not edited as frequently and therefore editing them triggers a
full reload instead of small localized updates.

## Disabling

You can disable this HMR behavior entirely using the
[`hmr`](/reference/config/#hmr) config.

You can also temporarily disable it without restarting the dev server by
writing a file in the `localesDir` (experimental):

```sh
echo '{"hmr":false}' > src/locales/confUpdate.json
```

There is a known limitation with this that it only sees changes to the file,
not creation, so you should write again if the file is new. You may also need
to gitignore it as it's not a necessary file in the source. These will be fixed
in the next version.

You can use this to make it play nice with e.g. git while rebasing, by putting
the command in a hook.
