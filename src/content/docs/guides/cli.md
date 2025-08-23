---
title: CLI
description: wuchale CLI guide - use npx wuchale, initialize your project, extract and manage translation catalogs, check status—perfect for Vite-free or server-only workflows.
---

`wuchale` provides a CLI from the package `wuchale`. The CLI can be invoked directly:

```bash
npx wuchale [command] {options}
```

You can get help by running

```bash
npx wuchale --help
```

You can optionally add some commands to your `package.json` for convenience.

```jsonc
// ...
"scripts": {
    // ...
    "extract": "wuchale",
    "clean": "wuchale --clean"
},
// ...
```

The following commands are accepted (in place of `{cmd}`).

## (No command)

You just run

```bash
npx wuchale
```

This scans all of the files that match the [configured
pattern](/reference/adapter-common#files) for the adapters and extracts the
messages. And if `writeFiles` is enabled, it writes the generated files. This
can be used when Vite is not used/needed (for example, for server only
projects). Watch mode is also supported.

## `init`

This initializes a new project. What exactly it does is the following, for each adapter configuration:

- If the loader file doesn't exist (with any of the file extensions supported
    by the adapter), or if it does exist but is an empty file, it creates it from
    the default one. You can choose between the available loaders to fill the
    content of the default loader. Preliminary checks are done to suggest the best
    one as the first option (for example, the existence of `@sveltejs/kit` as a
    dependency to decide between SvelteKit and Svelte).
- [Extract](#extract) from the source for the first time. This makes sure that
    the codebase is scanned as it is at the moment. Next, if Vite is used, the
    files are scanned incrementally as they are edited.

## `status`

This shows the status information of the setup like if the loader files exist
and are not empty, the number of total messages, untranslated, obsolete.
