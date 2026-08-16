function detectType(value: any) {
    // null and undefind
    if (value == null) return `${value}`

    return Object.getPrototypeOf(value)?.constructor?.name?.toLowerCase() ?? 'object'
}

console.log(detectType(null))        // Expected: "null"
console.log(detectType(undefined))   // Expected: "undefined"
console.log(detectType(42))          // Expected: "number"
console.log(detectType('hello'))     // Expected: "string"
console.log(detectType(true))        // Expected: "boolean"
console.log(detectType([]))          // Expected: "array"
console.log(detectType({}))          // Expected: "object"
console.log(detectType(new Date()))  // Expected: "date"
console.log(detectType(new Map()))   // Expected: "map"
console.log(detectType(new Set()))   // Expected: "set"
console.log(detectType(/regex/))     // Expected: "regexp"