// $ node %f

import { writeFile } from 'node:fs/promises'

const packages = [
    ['wuchale', 'wuchale'],
    ['svelte', '@wuchale/svelte'],
    ['jsx', '@wuchale/jsx'],
    ['vite-plugin', '@wuchale/vite-plugin'],
]

for (const [name, packageName] of packages) {
    const url = `https://raw.githubusercontent.com/wuchalejs/wuchale/refs/heads/main/packages/${name}/CHANGELOG.md`
    const res = await fetch(url)
    const content = await res.text()
    await writeFile(`./src/content/docs/changelogs/${name}.md`, `---\ntitle: "${packageName}"\n---\n${content}`)
}
