---
title: AI live translation
description: Integrate LLMs with wuchale for live on-the-fly translations during development or CLI usage. Optimize API usage with request queuing and prevent redundant translations.
---

`wuchale` can use LLMs to translate messages on-the-fly, during development or
during the CLI invokation. When coupled with the [HMR](/guides/hmr) support,
you can get a seamless experience where you edit the source code in one
language and see the updates in the browser in another language live.

## Gemini

Gemini was chosen as the default particularly because it has free (limited)
access to use it with an API key. You can get your own free API key from
[Google AI Studio](https://aistudio.google.com/app/apikey). Once you have that,
you can set it to the environment variable:

```bash
export GEMINI_API_KEY=your_api_key
```

And then you can use `wuchale` as normal: start the dev server or use the CLI
command. It will pick up the untranslated messages and translate them using
Gemini.

To customize how Gemini is used, you can import it and customize it in the config:

```js
// wuchale.config.js

import { gemini } from "wuchale";

export default {
  //...
  ai: gemini({
    batchSize: 40,
    parallel: 5,
    think: true, // default: false
  }),
  //...
};
```

## Other LLMs

To use another LLM, you can create your own object that conforms to the [AI config type](/reference/config/#ai).

```js
// wuchale.config.js

export default {
  //...
  ai: {
    name: "ChatGPT", // e.g.
    batchSize: 50,
    parallel: 10,
    translate: (content, instruction) => {
      // logic
      return translatedContent;
    },
  },
  //...
};
```

Which model you use, whether it's local or remote, or how you connect to it is
completely up to you. You can implement your own logic, or use a pre-made
package.

For example, you can choose to use [Vercel's AI
SDK](https://www.npmjs.com/package/ai) package to get a uniform API you can work
with accross different providers. Taking GPT 5 as an example, you can
configure wuchale to use it like so:

```js
// wuchale.config.js
import { defineConfig } from "wuchale"

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export default defineConfig({
    otherLocales: ['es'],
    adapters: {
        // ...
    },
    ai: {
        name: 'GPT-5',
        batchSize: 50,
        parallel: 1,
        translate: async (messages, instruction) => {
            const { text } = await generateText({
                model: openai('gpt-5.1'),
                system: instruction,
                prompt: messages,
            })
            return text
        }
    }
})
```

You can then set the environment variable `OPENAI_API_KEY` to the API key and start the dev server.

Now since the SDK provides a uniform API, you can use [any model from any
provider that it
supports](https://ai-sdk.dev/docs/introduction#model-providers).

## Mistake handling

If the LLM makes mistakes (which it often does) and doesn't translate some of
the messages, or makes mistakes on the message keys etc, `wuchale` collects the
untranslated messages and the messages whose keys (untranslated) were not
properly returned and gives it to the LLM again.

For example, let's say we have this:

```po
msgid "Hello!"
msgstr ""

msgid "Welcome"
msgstr ""

msgid "Welcome {0}!"
msgstr ""
```

And the LLM returns this:

```po
msgid "Hello"
msgstr "Hola"

msgid "Welcom-"
msgstr "Bienven-"

msgid "Welcome {0}!"
msgstr ""
```

Then `wuchale` retries for the following:

```po
msgid "Welcome"
msgstr ""

msgid "Welcome {0}!"
msgstr ""
```

And if it still makes mistakes, the process continues until all messages are
translated.

## Usage limit optimization

`wuchale` is designed to keep the number of requests as low as possible in
order not to exceed the limit. How:

### Requests

You can use the `batchSize` and `parallel` options to control how big and how
many the requests are. Reasonable defaults have been chosen for the default
Gemini, but you can customize them.


### No re-translation

Once a message is translated, it is stored in the catalog, just like a human
translated it. And `wuchale` never makes another request to translate that same
message.

