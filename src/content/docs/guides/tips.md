---
title: Useful tips
---

## Language names

You only provide the locale identifiers when configuring `wuchale` and it is
expected that you handle how the language picker is implemented in the
interface. And for that you have to show the name of the language instead of
the locale identifier.

To help with that, you can use the
[`Intl.DisplayNames`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames#language_display_names)
object (Baseline Widely available) provided by the browser and Node.js. It can
show, among other things, the names of languages in any language which makes it
very versatile as you can show the names all in English, each in their own
language or any way you like.

```js
// Get display names of language in English
const languageNamesEn = new Intl.DisplayNames(["en"], { type: "language" });
languageNamesEn.of("en-US"); // "English (United States)"
languageNamesEn.of("es"); // "Spanish"
languageNamesEn.of("fr"); // "French"

// Spanish in Spanish
const languageNamesEs = new Intl.DisplayNames(["es"], { type: "language" });
languageNamesEs.of("es"); // "español"
```

This is what `wuchale` itself uses when displaying the names in the CLI status
messages.

## Event names

In some cases it may be necessary to use DOM event names as strings. But
according to the default heuristic rule, event names satisfy the criteria to be
considered user displayable if they are used inside functions (such as event
handlers).

```js
function eventHandler(event) {
  if (event.key === 'Escape') {
    // ...
  }
}
```

You may not want to modify the heuristic function that acts globally, too
general. You may not want to use ignore comment directives either, too specific
and will need too much typing if the event names are many.

A cleaner approach is to extract constants to the top level, which are ignored
by default:

```js
const keys = {
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  // ...
};

function eventHandler(event) {
  if (event.key === keys.Escape) {
    // ...
  }
}
```
