// $$ node %f

import {updateCache} from './src/lib/get-type-cache.ts'

console.log('updating types')
await updateCache()
