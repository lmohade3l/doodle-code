# Pick

## Problem

Implement the built-in `Pick<T, K>` generic without using it.
Constructs a type by picking the set of properties `K` from `T`.

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// { title: string, completed: boolean }
```