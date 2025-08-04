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
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/wuchalejs/wuchale' },
                { icon: 'npm', label: 'NPM', href: 'https://npmjs.com/package/wuchale' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/ypVSZTbzvG' },
            ],
            sidebar: [
                {
                    label: 'Introduction',
                    items: [
                        { slug: 'intro/start' },
                        { slug: 'intro/why' },
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
