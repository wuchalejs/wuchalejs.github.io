// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'wuchale',
            logo: {
                src: './public/favicon.svg',
            },
            customCss: [
                './src/styles/custom.css',
            ],
            editLink: {
                baseUrl: 'https://github.com/wuchalejs/wuchalejs.github.io/edit/main/',
            },
            head: [
                { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
                {
                    tag: 'script',
                    attrs: { type: 'application/ld+json' },
                    content: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "wuchale",
                        "description": "Compile-time internationalization toolkit for JavaScript frameworks",
                        "author": "Kidus Adugna",
                        "applicationCategory": "DeveloperTool",
                        "programmingLanguage": ["JavaScript", "TypeScript"],
                        "keywords": ["React", "Svelte", "SolidJS", "Preact", "i18n", "internationalization", "localization", "l10n"],
                        "operatingSystem": "Cross-platform"
                    })
                }
            ],
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/wuchalejs/wuchale' },
                { icon: 'npm', label: 'NPM', href: 'https://npmjs.com/package/wuchale' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/ypVSZTbzvG' },
                { icon: 'openCollective', label: 'Open Collective', href: 'https://opencollective.com/wuchale' },
            ],
            sidebar: [
                {
                    label: 'Introduction',
                    items: [
                        { slug: 'intro/start' },
                        { slug: 'intro/why' },
                        { slug: 'intro/approaches' },
                        { slug: 'intro/roadmap' },
                    ],
                },
                {
                    label: 'Guides',
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'Concepts',
                    autogenerate: { directory: 'concepts' },
                },
                {
                    label: 'Official Adapters',
                    autogenerate: { directory: 'adapters' },
                },
                {
                    label: 'Reference',
                    items: [
                        { slug: 'reference/config' },
                        { slug: 'reference/adapter-common' },
                        { label: 'Examples', link: 'https://github.com/wuchalejs/examples', attrs: { target: '_blank' } },
                    ],
                },
            ],
        }),
    ],
    site: 'https://wuchale.dev'
});
