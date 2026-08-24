function detectType(a: any) {
    if (a == null) return `${a}`
    return Object.getPrototypeOf(a)?.constructor?.name?.toLowerCase() ?? 'object'
}

function stringify(a: any) {
    if(typeof a !=='object') {
        return `${a}`
    }

    const typeA = detectType(a)

    switch(typeA) {
        case 'array' : {
            return `[${a?.map((x: any) => stringify(x))}]`
        }
        case 'object' : {
            const keys = Object.keys(a)
            return `{${keys?.map(k => k + ':' + a[k])}}`
        }
        case 'regexp' :
        case 'date' : {
            return `${a}`
        }
    }

}


console.log(stringify(null))              // Expected: null
console.log(stringify(42))                // Expected: 42
console.log(stringify(true))              // Expected: true
console.log(stringify('hello'))           // Expected: "hello"
console.log(stringify([1, 'a', true]))    // Expected: [1,"a",true]
console.log(stringify({ a: 1, b: 'x' })) // Expected: { a: 1, b: "x" }
console.log(stringify(new Date()))        // Expected: 3/7/2026, 8:15:00 PM (toLocaleString)
console.log(stringify(/abc/gi))           // Expected: /abc/gi
const circular: any = { a: 1 }; circular.self = circular
console.log(stringify(circular))          // Expected: { a: 1, self: [Circular] }