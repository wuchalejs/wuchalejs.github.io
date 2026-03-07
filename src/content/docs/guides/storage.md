---
title: Custom storage
---

While PO files are solid for most projects, they have issues that might make them less ideal for a project.

- They are designed [with English as the source language](https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html) in mind (as the GNU's coding standards require English). This has the implication that they only have two places for plural forms in the source (`msgid` and `msgid_plural`). If the source language has more plural forms (e.g. Slavic languages, Arabic, etc), they are unusable.
- They are one file per locale. This makes a lot of the contents duplicated (references, extracted comments, etc.) This is for a good reason because they are to be given to translators who need as much context as possible to correctly translate. But if that is not a requirement, the large number of duplicated lines of code may be undesirable.

To not constrain projects where they are not the best choice, wuchale offers a
[storage interface (reference)](/reference/storage/) that accepts any
implementation as long as it conforms to the interface. This opens the
possibility to store messages in any format like JSON, YAML, or anything else.
The storage handler basically has to exchange data with wuchale, and where/how
it stores it is up to its implementation.

As an example, we can implement a simple JSON storage handler using it. An
example exchanged data (both for save and load operations, they have similar
shapes except that when loading there are some relaxations) looks like:

```ts
const data = {
    pluralRules: new Map([
        ['en', { nplurals: 2, plural: 'n == 1 ? 0 : 1' }],
        ['es', { nplurals: 2, plural: 'n == 1 ? 0 : 1' }],
    ]),
    items: [
        // this is a message item
        {
            id: ['Welcome'],
            translations: new Map([
                ['en', ['Welcome']],
                ['es', ['Bienvenido']],
            ]),
            references: [{
                file: 'src/routes/page.svelte',
                refs: [ null ]
            }],
            urlAdapters: []
        },
        // this is a URL item
        {
            id: ['/items/{0}'],
            context: 'original: /items/*rest',
            translations: new Map([
                ['en', ['/items/{0}']],
                ['es', ['/elementos/{0}']],
            ]),
            references: [{
                file: 'src/routes/page.svelte',
                refs: [
                    {
                        link: '/items/{0}/details',
                        placeholders: [[0, 'id']],
                    }
                ]
            }],
            urlAdapters: ['main']
        }
    ]
}
```

Now a storage handler for this can easily be implemented that saves to and
loads from a single JSON file. But care must be taken to handle Maps when doing
that because the JSON (de)serializer doesn't handle them, so they have to be
converted into/from objects.

```js
import {readFile, writeFile} from 'fs/promises'

const filename = 'src/locales/catalog.json'
function jsonHandler(opts /* not used for brevity */) {
    return {
        key: filename, // will be used to deduplicate when sharing it among adapters
        files: [filename], // make Vite watch this file
        async save(data) {
            const json = JSON.stringify({
                // convert to objects
                pluralRules: Object.fromEntries([...data.pluralRules]),
                items: data.items.map(item => ({
                    ...item,
                    // convert to objects
                    translations: Object.fromEntries(item.translations),
                })),
            })
            await writeFile(filename, json)
        },
        async load() {
            const raw = JSON.parse(await readFile(filename, 'utf8'))
            return {
                // convert from objects
                pluralRules: new Map(Object.entries(raw.pluralRules)),
                items: raw.items.map(item => ({
                    ...item,
                    // convert from objects
                    translations: new Map(Object.entries(item.translations)),
                })),
            }
        }
    }
}
```

And we can provide this to the adapter:

```js
// wuchale.config.js

export default {
    // ...
    adapters: {
        main: svelte({
            // ...
            storage: jsonHandler,
        })
    }
}
```

Now to build something more sophisticated, you will need more details from
wuchale. That's where the `opts` comes in, it gives you details like locales,
the project root directory, source locale of the calling adapter, etc. with the
shape [`StorageFactoryOpts`](/reference/storage/#whole-interface).
