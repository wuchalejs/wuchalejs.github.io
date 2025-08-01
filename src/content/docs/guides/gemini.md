---
title: Gemini live translation
---

`wuchale` can use Gemini to translate texts on-the-fly, during development or
during the CLI invokation. When coupled with the [HMR](/guides/hmr) support,
you can get a seamless experience where you edit the source code in one
language and see the updates in the browser in another language live.

Gemini was chosen particularly because it has free (limited) access to use it
with an API key. You can get your own free API key from [Google AI
Studio](https://aistudio.google.com/app/apikey). Once you have that, you can
set it to the environment variable:

```bash
export GEMINI_API_KEY=your_api_key
```

And then you can use `wuchale` as normal: start the dev server or use the CLI
command. It will pick up the untranslated texts and translate them using
Gemini.

## Usage limit optimization

`wuchale` is designed to keep the number of requests as low as possible in
order not to exceed the limit. How:

### Request queue

For many consecutive requests, it uses a request queue. But the queue doesn't
grow more than **2**. Because while the first request is being processed, any
new request that comes after the second one is incorporated into the second
one.

You can see that this works while using it, it prints messages to the console
when making a new request and when adding to an existing request.

### No re-translation

Once a text is translated, it is stored in the catalog, just like a human
translated it. And `wuchale` never makes another request to translate that same
text.
