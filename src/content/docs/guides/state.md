---
title: Locale state store
description: Manage active locales in wuchale using URL path parameters, search parameters, or global state. Learn best practices for SSR and client-side reactivity.
---

You can track the state of which locale is currently active anyway you prefer.
These are just some obvious examples.

## URL path parameter

Example: `your.site/en`

This is the most reliable method as it is an essential part of the URL of the
page. If you use a routing library, you can set it up so that you can get it
from anywhere in your codebase. It has two main benefits:

1. If you use SSR, it is readily available on the server as well as on the
   client without any compromises or custom state tracking effort from you.
2. If you care about SEO, it is a good practice that can improve your ranking.

The catch is that in some cases you may have to do more than you may prefer to
set it up. For example, in file system based routers like SvelteKit, you may
have to rearrange your whole codebase to be under the top level directory (e.g.
`[locale]` in case of SvelteKit).

## URL Search parameter

Example: `your.site?locale=en`

This is also an option if you want to have the locale as part of the URL but
don't want it inside the path. It is also readily available both on the server
and the client for SSR.

But it is less reliable in the sense that it may be stripped away from the URL
by mistake. Its SEO benefits may also not be as great.

## Global state

You can also just omit it entirely from the URL and use global state for it.

```js
export const locale = $state('en')
```

Can also work on both the client and the server for SSR and it can also be
reactive due to the framework.

But that means the same URL can show different locales depending on this state,
and it gets lost on page reload unless you do something more to store it
somewhere else (you should do it anyway to not require the user to select it
every time).
