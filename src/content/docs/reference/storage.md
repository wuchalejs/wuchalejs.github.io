---
title: Storage Interface
description: Complete type definitions for the storage interface — the contract between wuchale and custom storage implementations.
---

The storage interface provides a way to implement a custom storage handler for catalogs. The handler is provided to the adapter config as [`storage`](/reference/adapter-common/#storage).

## Item

An item is a unit (can be a message or a URL) extracted from the source code or the URL patterns you configured, with full translation and reference details.

```ts
export type FileRefEntry = {
    link?: string // for URLs
    placeholders: [number, string][]
}

export type FileRef = {
    file: string
    /**
     * multiple references in the same file
     * null when there is no link or placeholders just that it's referenced
     */
    refs: (FileRefEntry | null)[]
}

export interface Item {
    id: string[] // array to support plurals
    context?: string
    translations: Map<string, string[]> // by locale, arrays to support plurals
    references: FileRef[]
    urlAdapters: string[] // for URLs
    // for things that should survive the round trip with the storage
    [key: string]: unknown
}
```

And this is the unit that forms the basis for what exchanged with wuchale.

:::note
The placeholders are only for context during translation so they are not required by wuchale. If they are not important and you want to keep what you store lean, you can omit them and just use `null` for normal messages.
:::

## Plural rules

An additional thing that has to be stored with the translations is the plural rules.

```ts

export type PluralRule = {
    nplurals: number
    plural: string
}

export type PluralRules = Map<string, PluralRule>

```

## Exchanged data

There are just two exchange interactions with wuchale: saving data and loading data. And what the storage has to exchange is this:

```ts
export type SaveData = {
    pluralRules: PluralRules // will always be provided
    items: Item[]
}

export type LoadData = {
    pluralRules?: PluralRules // optional if it's the first time etc, will be filled by the default one
    items: Iterable<Item> // not just constrained to being array
}
```

## Whole interface

Putting it all together, what wuchale expects as a storage is a `StorageFactory` function that accepts `StorageFactoryOpts` options from wuchale, and returns a `CatalogStorage` object.

```ts

export type CatalogStorage = {
    /**
     * the key to check if two storages share the same location
     * e.g. this can be the dir for the pofile storage
     * two storages with same keys means they are the same/shared
     */
    key: string
    load(): Promise<LoadData>
    save(items: SaveData): Promise<void>
    /** the files controlled by this storage, for e.g. for Vite to watch */
    files: string[]
}

export type StorageFactoryOpts = {
    locales: string[]
    root: string
    /** whether the url is configured, can use to load separate url files */
    haveUrl: boolean
    sourceLocale: string
}

export type StorageFactory = (opts: StorageFactoryOpts) => CatalogStorage
```
