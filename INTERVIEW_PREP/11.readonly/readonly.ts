// Check if two types are exactly equal
export type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

// Expect a type to be true
export type Expect<T extends true> = T

type MyReadonly<T extends {}> = {
    readonly [P in keyof T]: T[P]
}

interface Todo {
  title: string
  description: string
}

type cases = [Expect<Equal<MyReadonly<Todo>, Readonly<Todo>>>]