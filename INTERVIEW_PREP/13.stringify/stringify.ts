function detectType(a: any) {
    if (a === null || a === undefined) return `${a}`
    return Object.getPrototypeOf(a)?.constructor?.name?.toLowerCase() ?? 'object'
}

function escapeString(s: string) {
    return s
        .replace(/\\/g, '\\\\')   // backslash
        .replace(/"/g, '\\"')     // double quote
        .replace(/\n/g, '\\n')    // newline
        .replace(/\r/g, '\\r')    // carriage return
        .replace(/\t/g, '\\t');   // tab
}

function stringify(a: any): string {

    const typeA = detectType(a)
    if (typeA === 'null') return 'null'
    if (typeA === 'undefined') return 'undefined'

    if (typeof a === 'string') {
        // string escaping
        return `"${escapeString(a)}"`
    }

    if (typeof a === 'number') {
        // NaN, Infinity , -Infinity to JSON.stringify give null
        if (!Number.isFinite(a)) return 'null'
        return `${a}`
    }

    if (typeof a !== 'object') {
        return `${a}`
    }

    switch (typeA) {
        case 'array': {
            return `[${a.map((x: any) => stringify(x)).join(',')}]`
        }
        case 'object': {
            const keys = Object.keys(a)
            return `{${keys?.map((k: any) => {
                return ' ' + k + ': ' + stringify(a[k])
            })?.join(',')} }`
        }
        case 'date': {
            return `${a?.toLocaleString()}`
        }
        case 'regexp': {
            return `${a}`
        }
        default: {
            return `${a}`
        }
    }
}


console.log(stringify(Infinity))              // Expected: null
// console.log(stringify(null))              // Expected: null
// console.log(stringify(42))                // Expected: 42
// console.log(stringify(true))              // Expected: true
// console.log(stringify('hello'))           // Expected: "hello"
// console.log(stringify([1, 'a', true]))    // Expected: [1,"a",true]
// console.log(stringify({ a: 1, b: 'x' })) // Expected: { a: 1, b: "x" }
// console.log(stringify(new Date()))        // Expected: 3/7/2026, 8:15:00 PM (toLocaleString)
// console.log(stringify(/abc/gi))           // Expected: /abc/gi
// const circular: any = { a: 1 }; circular.self = circular
// console.log(stringify(circular))          // Expected: { a: 1, self: [Circular] }