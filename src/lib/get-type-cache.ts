// $$ node %f

import { resolve } from 'node:path'
import { getType, type Opts } from './get-type.ts'
import { createHash } from 'crypto'
import { writeFile, readFile, readdir } from 'node:fs/promises'

const cacheDir = resolve('types-cache')

export async function getTypeCache(file: string, name: string, opts: Opts) {
    const info = JSON.stringify({file, name, opts})
    const hash = createHash('md5').update(info).digest('hex')
    const cacheFile = resolve(cacheDir, hash)
    try {
        const content = await readFile(cacheFile, {encoding: 'utf8'})
        return content.slice(content.indexOf('\n'))
    } catch (err) {
        if ((err as {code: string}).code !== 'ENOENT') {
            throw err
        }
        const type = getType(file, name, opts)
        await writeFile(cacheFile, `${info}\n${type}`)
        return type
    }
}

export async function updateCache() {
    await Promise.all((await readdir(cacheDir)).map(async cacheFil => {
        const cacheFile = resolve(cacheDir, cacheFil)
        const content = await readFile(cacheFile, {encoding: 'utf8'})
        const info = content.slice(0, content.indexOf('\n'))
        console.log('updating', cacheFil, info)
        const {file, name, opts} = JSON.parse(info)
        const type = getType(file, name, opts)
        await writeFile(cacheFile, `${info}\n${type}`)
    }))
}
