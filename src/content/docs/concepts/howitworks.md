---
title: How it works
---

![Diagram](https://raw.githubusercontent.com/wuchalejs/wuchalejs.github.io/main/public/favicon.svg)

### Compilation Process

1. **Extract** - AST traversal identifies translatable text
2. **Transform** - Text nodes replaced with `wuchaleTrans.t(n)` calls
3. **Catalog** - Updates .po files with new/changed messages
4. **Translate** - Optional Gemini AI translation for new messages
5. **Compile** - Generates optimized JavaScript modules
6. **Bundle** - Vite handles HMR in dev, optimized builds for production
