<p align="center">
    <img width="180" src="https://raw.githubusercontent.com/K1DV5/wuchale/main/images/logo.svg" alt="Vite logo">
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/wuchale"><img src="https://img.shields.io/npm/v/wuchale.svg" alt="npm package"></a>
  <a href="https://github.com/K1DV5/wuchale/actions/workflows/node.js.yml"><img src="https://github.com/K1DV5/wuchale/actions/workflows/node.js.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://pr.new/K1DV5/wuchale"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>
<br/>

`wuchale` is A non-invasive, normal code based compile-time internationalization (i18n) toolkit.

> 🎯 **Smart translations, tiny runtime, full HMR.** Extract strings at build
> time, generate optimized translation catalogs, support live translations
> (even with Gemini AI), and ship minimal code to production.

# Why `wuchale`?

Traditional i18n solutions require you to wrap every translatable string with
function calls or components. `wuchale` doesn't.

```svelte
<!-- Traditional i18n -->
<p>{t('Hello')}</p>
<p><Trans>Welcome {userName}</Trans></p>

<!-- With wuchale -->
<p>Hello</p>
<p>Welcome {userName}</p>
```

Write your code naturally. No imports, no wrappers, no annotations.
`wuchale` handles everything at compile time.

Try live examples in your browser, no setup required:

- Vanilla TS: [![Vanilla TS example on StackBlitz](https://img.shields.io/badge/StackBlitz-Demo-blue?logo=stackblitz)](https://stackblitz.com/github/wuchalejs/examples/tree/main/vanilla?file=wuchale.config.js)
- Svelte: [![Svelte example on StackBlitz](https://img.shields.io/badge/StackBlitz-Demo-blue?logo=stackblitz)](https://stackblitz.com/github/wuchalejs/examples/tree/main/svelte?file=wuchale.config.js)
- SvelteKit: [![SvelteKit TS example on StackBlitz](https://img.shields.io/badge/StackBlitz-Demo-blue?logo=stackblitz)](https://stackblitz.com/github/wuchalejs/examples/tree/main/sveltekit?file=wuchale.config.js)
- SvelteKit (advanced): [![Advanced SvelteKit example on StackBlitz](https://img.shields.io/badge/StackBlitz-Demo-blue?logo=stackblitz)](https://stackblitz.com/github/wuchalejs/examples/tree/main/sveltekit-advanced?file=wuchale.config.js)

# ✨ Key Features

- **🔧 Zero-effort integration** - Add i18n to existing projects without rewriting code
- **🚀 Compile-time optimization** - All transformations happen during build, minimal runtime overhead
- **🔄 Full, granular HMR support** - Live updates during development, including auto-translation
- **📦 Tiny footprint** - Only 2 additional dependencies (`wuchale` + `pofile`), no bloated `node_modules`
- **🎯 Smart extraction** - Uses AST analysis: handles nested markup, conditionals, loops, and complex interpolations
- **🌍 Standard .po files** - Compatible with existing translation tools and workflows
- **🤖 Optional AI translation** - Gemini integration for automatic translations during development

# 🚀 Installation and usage

Please look at the [Installation](./installation) and [Usage](./usage) pages.

# 🤝 Contributing

Contributions are welcome! Please check out our test suites located inside each package for examples of supported scenarios.

# ❤️ Sponsors

Thank you **[@hayzamjs](https://github.com/hayzamjs)** for sponsoring the
project and using it in [Sylve](https://github.com/AlchemillaHQ/Sylve), giving
valuable feedback!
