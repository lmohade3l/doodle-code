function detectType(a: any) {
    if (a == null) return `${a}`
    return Object.getPrototypeOf(a)?.constructor?.name?.toLowerCase() ?? 'object'
}

function deepClone(a: any) {
    if (typeof a !== 'object') return a

    const typeA = detectType(a)

    switch (typeA) {
        case 'map':{
            const res = new Map()
            const keys = a?.keys()
            for(const key of keys){
                res.set(key , deepClone(a.get(key)))
            }
            return res
        }
        case 'object': {
            const res: any = {}
            const keys = Object.keys(a)
            for (const key of keys) {
                res[key] = deepClone(a[key])
            }

            return res
        }
        case 'array' : {

        }
    }
}

// --- Examples ---
// Uncomment to test your implementation:

const obj = { a: { b: 1 }, c: [2, 3] }
const cloned = deepClone(obj)
cloned.a.b = 99
console.log(obj.a.b)     // Expected: 1 (unaffected)
console.log(cloned.a.b)  // Expected: 99

const map = new Map([['key', { value: 1 }]])
const clonedMap = deepClone(map)
console.log(clonedMap.get('key'))  // Expected: { value: 1 }
console.log(clonedMap.get('key') !== map.get('key'))  // Expected: true

const circular: any = { a: 1 }; circular.self = circular
const clonedCircular = deepClone(circular)
console.log(clonedCircular.self === clonedCircular)  // Expected: true