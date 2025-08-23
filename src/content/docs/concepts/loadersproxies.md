---
title: Loaders and proxies
description: Learn how wuchale's loaders and proxies manage translation catalogs - from virtual modules and compiled files to custom loading strategies, ensuring efficient internationalization.
---

When you run `npx wuchale init`, a loader file is created along with the
initial catalogs, next to the catalogs. The loader file is where you specify
how you integrate the catalogs into your app. Once it exists, even if you run
`npx wuchale init` again, it will not be overwritten unless it is empty.

The loader file is where all the transformed code (under the adapter) will
import the current catalog from. As such it controls all of those files. It
also has access to the catalog proxies that can provide the extracted catalogs
for that adapter, as well as the IDs of the catalogs that will be requested by
the transformed code.

The proxies are small modules (virtual by default, can be written to disk) that
export functions that take locale identifiers and return compiled catalogs.
When using virtual modules, they are two per adapter (one for sync, another for
async). The loader can choose which proxy to import from and use the function
to do the actual loading or export it to pass it to application code.

When using `wuchale` with `vite`, the loader is considered special in the sense
that when it imports the catalogs and load IDs from the provided virtual
modules, what it gets is specifically for it. Other files needing the same data
need to import it from the loader.

After the initial default creation, it is under your control and you can load
the catalogs however you please. All the loader has to do is export a default
function that takes a load ID and returns the catalog for that ID.

As for the actual loading, the application code somewhere you decide has to
initiate the loading and this depends on the codebase. For SvelteKit for
example, if we want SSR, it has to be in the load function of the layout (or
the page.) For normal Svelte, it has to be at the main component using
something like an await block or an `$effect`. All of this should be decided by
you.

