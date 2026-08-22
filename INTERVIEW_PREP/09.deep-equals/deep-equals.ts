function detectType(a: any) {
    if (a == null) return `${a}`
    return Object.getPrototypeOf(a)?.constructor?.name?.toLowerCase() ?? 'object'
}

export function deepEquals(a: any, b: any, cache = new Map()): boolean {
    // if === gives true
    if(a===b) return true

    // if types are not the same
    const typeA = detectType(a)
    const typeB = detectType(b)
    if(typeA !== typeB) return false

    // if is primitive, === works
    if(typeof a !=='object') return a===b

    // check keys size
    const [keysA , keysB] = [new Set(Object.keys(a)) , new Set(Object.keys(b))]
    if(keysA.size !== keysB.size) return false

    // check if keys are different
    if(keysA.symmetricDifference(keysB).size > 0) return false

    // check items
    for (const key in keysA) {
        // if(a[key] !== b[key]) return false
        if(!deepEquals(a[key] , b[key])) return false
    }

    return true
}