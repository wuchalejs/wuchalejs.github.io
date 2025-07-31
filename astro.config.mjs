// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Wuchale',
            logo: {
                src: './public/favicon.svg',
            },
			social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/wuchalejs/wuchale' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/ypVSZTbzvG' },
                { icon: 'npm', label: 'NPM', href: 'https://npmjs.com/package/wuchale' },
            ],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Installation', slug: 'start/installation' },
						{ label: 'Usage', slug: 'start/usage' },
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
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
    site: 'https://wuchale.dev'
});
