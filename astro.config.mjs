// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Wuchale',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/wuchalejs/wuchale' }],
			sidebar: [
				{
					label: 'Guides',
					// items: [
					// 	// Each item here is one entry in the navigation menu.
					// 	{ label: 'Installation', slug: 'guides/installation' },
					// ],
					autogenerate: { directory: 'guides' },
				},
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
    site: 'https://wuchale.dev'
});
