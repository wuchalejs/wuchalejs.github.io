---
title: Useful tips
---

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
