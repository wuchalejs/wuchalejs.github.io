---
title: Tailwind CSS
description: Optimize wuchale with Tailwind CSS - prevent full page reloads during translation updates by excluding the locales directory from Tailwind's purging process.
---

During development, `wuchale` writes the changes to the catalog storage files
(e.g. `.po` files) as you edit your source files and works with Vite's HMR to
send updates. This makes everything up to date without a full reload.

However, Tailwind watches any files not recognized by javascript as a possible
source of CSS class names (for some reason!) and since the files are not JS
files, it only does a full page refresh. As you can imagine, everytime you add
a new word and save, wuchale modifies the catalog file and a full reload will
be annoying.

This can be easily solved though. You can add the locales directory to the
ignore list inside the Tailwind main css:

```css
/* src/routes/app.css */
@import "tailwindcss";
@source not "../locales/";
```
