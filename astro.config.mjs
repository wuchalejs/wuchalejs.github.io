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
			social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/wuchalejs/wuchale' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/ypVSZTbzvG' },
                { icon: 'npm', label: 'NPM', href: 'https://npmjs.com/package/wuchale' },
            ],
			sidebar: [
				{
					label: 'Introduction',
					items: [
						{ label: 'Get started', slug: 'intro/start' },
						{ label: 'Why wuchale', slug: 'intro/why' },
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
