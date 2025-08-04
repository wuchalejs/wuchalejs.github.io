---
title: Fallback
---

Often, translations lag behind the source code. And it is necessary to make sure
that the user sees at least the English version of the text, instead of some
meaningless text. For example, for the following code:

```svelte
<p>Hello</p>
```

When it is extracted initially, it becomes the following for other languages:

```po
msgid "Hello"
msgtext ""
```

Then, unless not configured properly `wuchale` **never** shows some empty or
weird text to the user. What it does is, during compile time, if the text has
not yet been translated, it uses the compiled version of the source text
(`Hello` in the example) instead. That way the worst that the user sees is the
text as written in the source code.

This doesn't need a separate configuration, it is the default behavior. 
