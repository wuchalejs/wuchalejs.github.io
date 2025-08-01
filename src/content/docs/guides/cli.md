---
title: CLI
---

`wuchale` provides a CLI from the package `wuchale`. The CLI can be invoked directly:

```bash
npx wuchale {cmd}
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
    "extract": "wuchale extract"
},
// ...
```

The following commands are accepted (in place of `{cmd}`).

## `init`

This initializes a new project. What exactly it does is the following, for each adapter configuration:

- If the loader file doesn't exist (with any of the file extensions supported
    by the adapter), or if it does exist but is an empty file, it creates it from
    the default one. Preliminary checks are done to decide what the contents of the
    default loader file should be (for example, the existence of `svelte.config.js`
    to decide between SvelteKit and Svelte).
- [Extract](#extract) from the source for the first time. This makes sure that the codebase
    is scanned as it is at the moment. Next, if Vite is used, the files are scanned
    incrementally as they are edited.

## `extract`

This scans all of the files that match the [configured
pattern](/reference/adapter-common#files) for the adapters and extracts the
texts. This can be used when Vite is not used/needed (for example, for server
only projects).
