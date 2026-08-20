// Check if two types are exactly equal
export type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

// Expect a type to be true
export type Expect<T extends true> = T

type MyPick<T extends {}, K extends keyof T> = {
    [P in K]: T[P]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
    title: string
}

interface Expected2 {
    title: string
    completed: boolean
}

type cases = [
    Expect<Equal<MyPick<Todo, 'title'>, Expected1>>,
    Expect<Equal<MyPick<Todo, 'title' | 'completed'>, Expected2>>,
    // @ts-expect-error - invalid key
    MyPick<Todo, 'invalid'>,
]