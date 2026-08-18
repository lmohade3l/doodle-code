// Check if two types are exactly equal
export type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

// Expect a type to be true
export type Expect<T extends true> = T

type First<T extends readonly any[]> = T extends [infer First, ...any] ? First : never

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>,
]

type errors = [
  // @ts-expect-error strings are not arrays
  First<'notArray'>,
  // @ts-expect-error objects are not arrays
  First<{ 0: 'arrayLike' }>,
]