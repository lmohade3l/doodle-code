function detectType(a: any) {
    if (a == null) return `${a}`
    return Object.getPrototypeOf(a)?.constructor?.name?.toLowerCase() ?? 'object'
}

function deepEquals(a: any, b: any) {
    // if === gives true
    if (a === b) return true

    // if types are not equals give false
    const [typeA, typeB] = [detectType(a), detectType(b)]
    if (typeA !== typeB) return false

    //? if primitive, check ===
    if (typeof a !== 'object') return a === b

    if(typeA === 'object' || typeA==='array') {
        
    }
    
    
}