---
title: Development modes
description: Configure how wuchale behaves during development - choose how aggressively it tracks message changes, and take advantage of HMR support for instant feedback when editing source files or catalogs.
---

## `dev` modes

The config [`dev`](/reference/config/#dev) controls the behavior during
development mode and it can be one of the following:

- `false`: Disabled, nothing done during development
- `'read'`: Only uses existing translations and doesn't add newly detected messages
- `'add'`: Adds newly detected messages and updates their refs as they get referenced, but doesn't touch existing messages
- `'refs'`: Adds new messages, updates refs of all messages and marks obsoletes when no longer referenced
- `'clean'`: Full behavior same as `npx wuchale --clean`, deletes unused messages

:::note
When the `dev` mode is `clean`, messages that are deleted are kept in memory as
long as the dev server is alive. That way, if an already translated message is
deleted and later re-added (happens when experimenting with UI text), there
will be no re-translation necessary, it will be written from memory.
:::

:::tip
This config can be temporarily changed without restarting the dev server by
writing a file in the `{localesDir}/.wuchale`:

```sh
echo '{"dev":false}' > src/locales/.wuchale/confUpdate.json
```

This can be used to make it play nice with other tools, e.g. git while
rebasing, by putting the command in a hook.
:::

## HMR support

HMR support is enabled when the `dev` mode is enabled (not `false`) and it
supports two directions.

### Editing source files

The updates are embedded inside the transformed modules themselves. This way,
there is no roundtrip for the catalog updates and a single HMR update holds all
the info. Then the new version of the file updates the catalog just before it
uses it. And this is independent of how you the catalogs are loaded because the
source files update the catalog after getting it, just before using it.

This makes it as if wuchale was never there, while it does its job of
extracting and keeping the catalogs up to date, even [live
translating](/guides/ai)!

### Editing catalog storage files

Catalog storage files are not edited as frequently and therefore editing them
triggers a full reload instead of small localized updates.
