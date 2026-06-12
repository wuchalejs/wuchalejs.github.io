---
title: CLI
description: wuchale CLI guide - use npx wuchale, initialize your project, extract and manage translation catalogs, check status—perfect for Vite-free or server-only workflows.
---

`wuchale` provides a CLI from the package `wuchale`. The CLI can be invoked directly:

```bash
npx wuchale [command] {options}
```

You can get help by running it with `--help`

```console
$ npx wuchale --help

wuchale cli

Usage:
    wuchale [command] {options}

Commands:
    [none]  Extract/compile messages from the codebase into catalogs
            deleting unused messages if --clean is specified
    status  Show current status
    check   Check for errors

Options:
    --config         Use another config file instead of wuchale.config.js|wuchale.config.mjs|wuchale.config.ts|wuchale.config.mts
    --clean, -c      Remove unused messages from catalogs
    --watch, -w      Continuously watch for file changes
    --sync           Extract sequentially instead of in parallel
    --modify a1,a2   Modify files in place for adapters a1, a2, etc.
    --log-level, -l  {error,warn,info,verbose} (only when no commands) set log level
    --help, -h       Show this help

You can specify --help after a sub-command for more.
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
messages.

If `--modify adapter1,adapter2` is given, it writes the generated transformed
files for those adapters back to disk. This can be used when Vite is not
used/needed (for example, for server only projects and other bundlers).

:::note
`--modify` OVERWRITES the files, therefore only use it when you are certain,
and have Git already setup and in a clean state, so that you can restore them.
Normally you should use it only when you use an unsupported bundler and in that
case you should only run it in CI just before deployment. Or you can use it for
debugging (and restore with Git.)
:::

## `status`

```console
$ npx wuchale status --help

Usage:
    wuchale status {options}

Options:
    --json           output info as structured JSON instead of table and text
    --help, -h       Show this help
```

This shows the status information of the setup like if the loader files exist
and are not empty, the number of total messages, untranslated, obsolete.

An optional `--json` flag can be specified to get the information in a JSON format.

## `check`

```console
$ npx wuchale check --help

Usage:
    wuchale check {options}

Options:
    --full           check if there are unextracted and newly obsolete messages in source code as well
    --help, -h       Show this help
```

This checks for any possible unintended errors. It checks for two things:

- By default, it checks the translation catalog files to see if all of the translations are in the intended structure.
    - Missing/additional/different placeholders, incorrect nesting, etc produce an error.
    - Untranslated messages do not produce an error as they are in a possibly valid intermediate state until they are translated.
- If the `--full` flag is specified, it goes through the codebase and does the normal extraction without actually writing anything, it then checks if there is any change not already in the catalogs and if any, it reports an error. The possible cases are:
    - New messages
    - Newly obsoleted messages
    - Reference changes

:::note
If you want to check for untranslated and/or obsolete messages that are not
new, use the `status` command with `--json` and use `jq` to check them the way
you like.
:::
