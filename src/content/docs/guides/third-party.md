---
title: Third party packages
description: Make your whole app cohesive by internationalizing even third party packages
---

Sometimes, we use a package for some part of our UI, maybe a component library
or a library that provides some messages directly shown to the user. While some
put the files in our codebase (like `shadcn-ui`), others ship the files in the
packages. To make the whole app cohesive, internationalization of such packages
that ship as plain code files (without other traditional internationalization
methods) is supported, just have another suitable adapter config (based on the
filetypes) for them and point wuchale at the files and that's mostly it.

What we have to configure for the adapter are the following:

- `files`: Point to the locations of the file in `node_modules`. If it's a
local package installed as a symlink, you should point to the real location.
- `sourceLocale`: If the package is written for a language that your app
doesn't target (not in `locales` in your main config), specify this on the
adapter config.

For example, let's say we use a Svelte component library `foo` written for
English while our app, a SvelteKit project, targets Spanish and German. Our
config would be:

```js
export default {
    locales: ['es', 'de'],
    adapters: {
        // other adapters for our files
        lib: svelte({
            loader: 'sveltekit',
            sourceLocale: 'en',
            files: 'node_modules/foo/dist/*.svelte'
        })
    }
}
```

After that, it's like any other adapter, meaning you have to load the catalogs
in `hooks.server.js` and `+layout.ts` like you do for other adapter configs.
